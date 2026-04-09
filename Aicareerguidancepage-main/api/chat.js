const SYSTEM_CONTEXT = `You are BC CourseFinder™, an AI assistant for Belgium Campus students. Belgium Campus iTversity is a leading private higher education institution in South Africa specializing in Information Technology and innovation-driven learning.

Key information about Belgium Campus iTversity:
- Founded in 1999, focused on developing highly skilled, industry-ready IT graduates
- Offers Higher Certificates (1 year), Diplomas (2-3 years), Advanced Diplomas, and Bachelor's Degrees (3-4 years)
- All qualifications are DHET registered and industry-recognized
- Over 8% of South Africa's ICT graduates come from Belgium Campus
- Main IT career paths: Software Development, Data Science, AI, Cybersecurity, Network Engineering, UX/UI Design, Systems Architecture
- Strong industry partnerships with leading tech companies for internships and employment
- Three campuses: Pretoria (Main - 138 Berg Ave, Heatherdale), Kempton Park (45A Long Street), Stellenbosch (10 Distillery Road)
- Modern facilities: hybrid classrooms, robotics labs, innovation spaces, libraries, sports facilities
- Strong graduate employability through industry exposure and practical learning
- Contact: info@belgiumcampus.ac.za, +27 10 593 5368
- Applications: apply@belgiumcampus.ac.za
- Website: belgiumcampus.ac.za

Your role:
- Help students choose appropriate IT career paths based on their interests and goals
- Provide detailed information about qualifications, courses, and entry requirements
- Explain differences between certificates, diplomas, advanced diplomas, and degrees
- Guide students on internship, learnership, and career opportunities
- Answer questions about campus facilities, student life, and accommodation
- Provide accurate contact information and direct students to the right departments
- Be friendly, professional, encouraging, and supportive
- Keep responses concise but informative (2-4 paragraphs max)
- Use bullet points for clarity when listing options or comparing programs
- Encourage students to explore their interests and reach out for more information

Always maintain a helpful, student-focused tone and inspire confidence in students' IT career journey.`;

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message || message.trim() === '') {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: 'Gemini API key not configured. Please add GEMINI_API_KEY to your Vercel environment variables.'
    });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_CONTEXT }]
          },
          contents: [
            {
              parts: [{ text: message }]
            }
          ],
          generationConfig: {
            maxOutputTokens: 1024,
            temperature: 0.7,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData?.error?.message || 'Gemini API request failed';

      if (errorMessage.includes('API key')) {
        return res.status(500).json({ error: 'Invalid API key. Please check your GEMINI_API_KEY in Vercel environment variables.' });
      }
      if (response.status === 429) {
        return res.status(429).json({ error: 'API quota exceeded. Please try again later.' });
      }

      return res.status(response.status).json({ error: errorMessage });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(500).json({ error: 'No response generated. The content may have been blocked by safety filters.' });
    }

    return res.status(200).json({ response: text });

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return res.status(500).json({
      error: 'Failed to get AI response. Please try again.',
      details: error.message
    });
  }
}

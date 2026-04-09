export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    message: 'BC CourseFinder™ API is running',
    model: 'gemini-1.5-flash',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
}

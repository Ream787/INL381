import { useState } from "react";
import {
  Users, MessageSquare, TrendingUp, Activity, Shield, BookOpen,
  Search, Filter, ChevronDown, Eye, CheckCircle, Clock, AlertTriangle,
  GraduationCap, MapPin, BarChart2, Settings, Bell
} from "lucide-react";

// Mock data
const mockStudents = [
  { id: "1", name: "Thabo Mokoena", email: "student@belgiumcampus.ac.za", program: "BSc IT", campus: "Pretoria", year: 2, status: "active", joined: "2024-02-01", chats: 14 },
  { id: "3", name: "Amara Osei", email: "amara.osei@belgiumcampus.ac.za", program: "BSc Computer Science", campus: "Johannesburg", year: 1, status: "active", joined: "2024-03-15", chats: 8 },
  { id: "4", name: "Lerato Sithole", email: "lerato.s@belgiumcampus.ac.za", program: "Diploma in IT", campus: "Pretoria", year: 3, status: "active", joined: "2023-01-20", chats: 31 },
  { id: "5", name: "Sipho Ndlovu", email: "sipho.n@belgiumcampus.ac.za", program: "BCom Informatics", campus: "Cape Town", year: 2, status: "inactive", joined: "2023-08-10", chats: 5 },
  { id: "6", name: "Zanele Dube", email: "zanele.d@belgiumcampus.ac.za", program: "BSc IT", campus: "Online", year: 1, status: "active", joined: "2024-04-02", chats: 22 },
  { id: "7", name: "Kwame Asante", email: "kwame.a@belgiumcampus.ac.za", program: "Postgrad Diploma in IT", campus: "Johannesburg", year: 1, status: "active", joined: "2024-01-09", chats: 19 },
  { id: "8", name: "Nomsa Khumalo", email: "nomsa.k@belgiumcampus.ac.za", program: "BSc Computer Science", campus: "Pretoria", year: 3, status: "inactive", joined: "2022-07-15", chats: 3 },
];

const mockActivity = [
  { id: 1, user: "Thabo Mokoena", action: "Started a new chat session", time: "2 min ago", type: "chat" },
  { id: 2, user: "Amara Osei", action: "Asked about BSc IT career paths", time: "15 min ago", type: "chat" },
  { id: 3, user: "Zanele Dube", action: "Registered a new account", time: "1 hour ago", type: "register" },
  { id: 4, user: "Lerato Sithole", action: "Updated profile information", time: "2 hours ago", type: "profile" },
  { id: 5, user: "Kwame Asante", action: "Asked about internship options", time: "3 hours ago", type: "chat" },
  { id: 6, user: "Sipho Ndlovu", action: "Logged into the platform", time: "5 hours ago", type: "login" },
];

const campusStats = [
  { campus: "Pretoria", students: 312, active: 289 },
  { campus: "Johannesburg", students: 245, active: 201 },
  { campus: "Cape Town", students: 178, active: 155 },
  { campus: "Online", students: 94, active: 88 },
];

type Tab = "overview" | "students" | "activity" | "campuses";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const filteredStudents = mockStudents.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.program.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <BarChart2 className="w-4 h-4" /> },
    { id: "students", label: "Students", icon: <Users className="w-4 h-4" /> },
    { id: "activity", label: "Activity", icon: <Activity className="w-4 h-4" /> },
    { id: "campuses", label: "Campuses", icon: <MapPin className="w-4 h-4" /> },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      {/* Admin header banner */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a4a7f] px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-amber-400" />
              <h1 className="text-white text-xl">Admin Dashboard</h1>
            </div>
            <p className="text-white/60 text-sm">BC CourseFinder™ — System Management</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full" />
            </button>
            <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                activeTab === tab.id
                  ? "bg-[#1e3a5f] text-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={<Users className="w-5 h-5 text-blue-600" />} label="Total Students" value="829" change="+12 this month" bg="bg-blue-50" border="border-blue-100" />
              <StatCard icon={<Activity className="w-5 h-5 text-green-600" />} label="Active Users" value="733" change="88% active rate" bg="bg-green-50" border="border-green-100" />
              <StatCard icon={<MessageSquare className="w-5 h-5 text-purple-600" />} label="Chat Sessions" value="2,847" change="+134 this week" bg="bg-purple-50" border="border-purple-100" />
              <StatCard icon={<TrendingUp className="w-5 h-5 text-amber-600" />} label="Avg. Chats/User" value="18.3" change="↑ from 14.2 last month" bg="bg-amber-50" border="border-amber-100" />
            </div>

            {/* Popular topics */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-[#1e3a5f] mb-4">Most Queried Topics</h2>
              <div className="space-y-3">
                {[
                  { topic: "IT Career Paths", queries: 648, pct: 82 },
                  { topic: "Diploma vs. Degree", queries: 521, pct: 66 },
                  { topic: "Internship Options", queries: 489, pct: 62 },
                  { topic: "Software Development Skills", queries: 412, pct: 52 },
                  { topic: "Maths & Science Careers", queries: 334, pct: 42 },
                  { topic: "Understanding Qualifications", queries: 287, pct: 36 },
                ].map((item) => (
                  <div key={item.topic} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-700">{item.topic}</span>
                        <span className="text-sm text-gray-500">{item.queries} queries</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#1e3a5f] rounded-full" style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-[#1e3a5f] mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "View All Students", icon: <Users className="w-5 h-5" />, action: () => setActiveTab("students") },
                  { label: "Recent Activity", icon: <Activity className="w-5 h-5" />, action: () => setActiveTab("activity") },
                  { label: "Campus Reports", icon: <MapPin className="w-5 h-5" />, action: () => setActiveTab("campuses") },
                  { label: "Programme Stats", icon: <BookOpen className="w-5 h-5" />, action: () => {} },
                ].map((a) => (
                  <button
                    key={a.label}
                    onClick={a.action}
                    className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-[#1e3a5f] hover:text-white border border-gray-100 hover:border-[#1e3a5f] rounded-xl text-gray-600 transition-all group"
                  >
                    {a.icon}
                    <span className="text-xs text-center">{a.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Students tab */}
        {activeTab === "students" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <h2 className="text-[#1e3a5f] flex-1">Student Directory</h2>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search students..."
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] w-full sm:w-56"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] bg-white"
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Student", "Programme", "Campus", "Year", "Chats", "Status", ""].map((h) => (
                      <th key={h} className="text-left text-xs text-gray-500 px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#1e3a5f] flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-semibold">{s.name.split(" ").map(n => n[0]).join("")}</span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-900">{s.name}</p>
                            <p className="text-xs text-gray-400">{s.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">{s.program}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{s.campus}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">Year {s.year}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{s.chats}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs ${
                          s.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}>
                          {s.status === "active" ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredStudents.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p>No students found matching your search.</p>
                </div>
              )}
            </div>
            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-400">Showing {filteredStudents.length} of {mockStudents.length} students</p>
              <span className="text-xs text-gray-400">Page 1 of 1</span>
            </div>
          </div>
        )}

        {/* Activity tab */}
        {activeTab === "activity" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-[#1e3a5f] mb-5">Recent Activity</h2>
            <div className="space-y-3">
              {mockActivity.map((item) => (
                <div key={item.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.type === "chat" ? "bg-blue-100" :
                    item.type === "register" ? "bg-green-100" :
                    item.type === "profile" ? "bg-purple-100" : "bg-gray-100"
                  }`}>
                    {item.type === "chat" ? <MessageSquare className="w-4 h-4 text-blue-600" /> :
                     item.type === "register" ? <Users className="w-4 h-4 text-green-600" /> :
                     item.type === "profile" ? <Shield className="w-4 h-4 text-purple-600" /> :
                     <Activity className="w-4 h-4 text-gray-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{item.user}</p>
                    <p className="text-xs text-gray-500">{item.action}</p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Campuses tab */}
        {activeTab === "campuses" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {campusStats.map((c) => (
                <div key={c.campus} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-[#1e3a5f]" />
                    <h3 className="text-[#1e3a5f]">{c.campus}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-2xl text-gray-900">{c.students}</p>
                      <p className="text-xs text-gray-400">Total Students</p>
                    </div>
                    <div>
                      <p className="text-2xl text-green-600">{c.active}</p>
                      <p className="text-xs text-gray-400">Active</p>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1e3a5f] rounded-full"
                      style={{ width: `${Math.round((c.active / c.students) * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">{Math.round((c.active / c.students) * 100)}% active rate</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, change, bg, border }: {
  icon: React.ReactNode; label: string; value: string; change: string; bg: string; border: string;
}) {
  return (
    <div className={`${bg} border ${border} rounded-2xl p-5`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg bg-white shadow-sm`}>{icon}</div>
      </div>
      <p className="text-2xl text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      <p className="text-xs text-gray-400 mt-1">{change}</p>
    </div>
  );
}

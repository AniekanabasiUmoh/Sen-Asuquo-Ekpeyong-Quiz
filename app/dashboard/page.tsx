"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import PageShell from "@/components/PageShell";
import { useRole } from "@/lib/RoleContext";
import {
  currentQuiz, completedQuizzes, candidateResult, achievements,
  schools, topStudents, allLGAs, recentActivity, scoreDistribution,
  dashboardStats, topSubjects, exams
} from "@/lib/mockData";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, Cell
} from "recharts";
import {
  Trophy, TrendingUp, Flame, CheckCircle2, Clock, ArrowRight, Award,
  Users, School, MapPin, Zap, UserPlus, Calendar, Plus, Sparkles, BarChart2, FileText, CheckCircle
} from "lucide-react";

function DashboardContent() {
  const { role } = useRole();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  // State for mock registration form
  const [regName, setRegName] = useState("");
  const [regLga, setRegLga] = useState("Calabar Municipal");
  const [regSubjectCount, setRegSubjectCount] = useState("5");
  const [schoolStudents, setSchoolStudents] = useState(() => {
    // Mock school candidate list from Gov. Secondary School Calabar
    return topStudents.filter(s => s.school.includes("Government Secondary School"));
  });
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  // State for mock quiz scheduler
  const [quizTitle, setQuizTitle] = useState("");
  const [quizSubject, setQuizSubject] = useState("Mathematics");
  const [quizDuration, setQuizDuration] = useState("15");
  const [scheduleSuccess, setScheduleSuccess] = useState<string | null>(null);

  const student = candidateResult;

  const handleRegisterCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) return;
    const newStudent = {
      id: schoolStudents.length + 100,
      name: regName,
      school: "Government Secondary School, Calabar",
      lga: regLga,
      score: 0.0,
      rank: schoolStudents.length + 1,
      movement: 0,
      portrait: "/assets/portraits/participant_4.png",
    };
    setSchoolStudents([...schoolStudents, newStudent]);
    setRegSuccess(`Successfully registered ${regName}! Candidate ID: CRS/2025-26/00${Math.floor(100 + Math.random() * 800)}`);
    setRegName("");
    setTimeout(() => setRegSuccess(null), 5000);
  };

  const handleScheduleQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTitle.trim()) return;
    setScheduleSuccess(`Quiz "${quizTitle}" successfully deployed! It will go live on the next scheduled Sunday.`);
    setQuizTitle("");
    setTimeout(() => setScheduleSuccess(null), 5000);
  };

  const studentStats = [
    { label: "My Rank", value: `#${student.rank}`, sub: "in your school", icon: <Trophy size={18} />, color: "#f4b400" },
    { label: "Average Score", value: `${student.percentage}%`, sub: "Grade A", icon: <TrendingUp size={18} />, color: "#2eaf5d" },
    { label: "Current Streak", value: "5 weeks", sub: "Keep it going!", icon: <Flame size={18} />, color: "#f97316" },
    { label: "Quizzes Done", value: completedQuizzes.length, sub: "this season", icon: <CheckCircle2 size={18} />, color: "#2f6bff" },
  ];

  const schoolStats = [
    { label: "Candidates Registered", value: schoolStudents.length, sub: "Govt. Sec. School Calabar", icon: <Users size={18} />, color: "#2f6bff" },
    { label: "School Rank", value: "#1", sub: "in Calabar Municipal", icon: <Trophy size={18} />, color: "#f4b400" },
    { label: "Average Score", value: "82.4%", icon: <TrendingUp size={18} />, color: "#2eaf5d" },
    { label: "Medals Won", value: "25", sub: "12 Gold · 8 Silver · 5 Bronze", icon: <Award size={18} />, color: "#f97316" },
  ];

  const adminStats = [
    { label: "Total Candidates", value: "4,218", sub: "Active statewide", icon: <Users size={18} />, color: "#2f6bff" },
    { label: "Participating Schools", value: "127", sub: "Across all 18 LGAs", icon: <School size={18} />, color: "#2eaf5d" },
    { label: "Total Season Prizes", value: "₦25.0M", sub: "Champions pool", icon: <Trophy size={18} />, color: "#f4b400" },
    { label: "Active Weekly Quiz", value: "Week 24", sub: "1,842 submissions", icon: <Zap size={18} />, color: "#f97316" },
  ];

  // Render correct title based on activeTab
  const getBreadcrumbs = () => {
    const base = ["Home", "Dashboard"];
    if (activeTab !== "overview") {
      base.push(activeTab.charAt(0).toUpperCase() + activeTab.slice(1));
    }
    return base;
  };

  return (
    <PageShell>
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ──────────────────────────────────────────────────────────
            1. STUDENT DASHBOARD
            ────────────────────────────────────────────────────────── */}
        {role === "student" && (
          <>
            {/* Hero + Live Quiz */}
            <div className="rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--navy-950) 0%, #12327a 100%)" }}>
              <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10" style={{ background: "white", transform: "translate(35%, -40%)" }} />
              <div className="absolute bottom-0 right-24 w-40 h-40 rounded-full opacity-5" style={{ background: "var(--gold-500)", transform: "translate(0, 40%)" }} />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 flex-shrink-0" style={{ borderColor: "rgba(255,255,255,0.25)" }}>
                    <Image src={student.portrait} alt={student.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Welcome back, {student.name.split(" ")[0]} 👋</h1>
                    <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>
                      {student.school.split(",")[0]} · Rank #{student.rank} in your school
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl p-4 lg:min-w-80" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--gold-500)" }} />
                    <span className="text-xs font-bold tracking-widest" style={{ color: "var(--gold-500)" }}>{currentQuiz.week} — LIVE NOW</span>
                  </div>
                  <div className="font-semibold mb-1">{currentQuiz.title}</div>
                  <div className="flex items-center gap-1.5 text-xs mb-3" style={{ color: "rgba(255,255,255,0.6)" }}>
                    <Clock size={12} /> Ends in {currentQuiz.endsIn.days}d {currentQuiz.endsIn.hours}h · {currentQuiz.totalQuestions} questions
                  </div>
                  <Link href="/exam-portal/1/take" className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-90" style={{ background: "var(--gold-500)", color: "var(--navy-950)" }}>
                    Take This Week's Quiz <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {studentStats.map(s => (
                <div key={s.label} className="card p-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${s.color}18`, color: s.color }}>
                    {s.icon}
                  </div>
                  <div className="text-2xl font-bold" style={{ color: "var(--navy-950)" }}>{s.value}</div>
                  <div className="text-xs mt-0.5 font-medium" style={{ color: "var(--text)" }}>{s.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* score progress + recent quizzes */}
            <div className="grid lg:grid-cols-5 gap-6">
              <div className="card p-6 lg:col-span-3">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold" style={{ color: "var(--text)" }}>My Score Progress</h3>
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "rgba(46,175,93,0.1)", color: "var(--green-600)" }}>
                    ↑ Up {student.scoreTrend[student.scoreTrend.length - 1].score - student.scoreTrend[0].score} pts
                  </span>
                </div>
                <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>Your weekly quiz scores this season</p>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={student.scoreTrend} margin={{ left: -20, right: 5 }}>
                    <defs>
                      <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--blue-600)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="var(--blue-600)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="week" tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[70, 100]} tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)", fontSize: 12 }} formatter={(v) => [`${v}%`, "Score"]} />
                    <Area type="monotone" dataKey="score" stroke="var(--blue-600)" strokeWidth={2.5} fill="url(#scoreGrad)" dot={{ fill: "var(--blue-600)", r: 3 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="card overflow-hidden lg:col-span-2">
                <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-bold text-sm" style={{ color: "var(--text)" }}>Recent Quizzes</h3>
                  <Link href="/profile" className="text-xs font-medium" style={{ color: "var(--blue-600)" }}>View all →</Link>
                </div>
                <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                  {completedQuizzes.map(q => (
                    <div key={q.id} className="px-5 py-3.5">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>{q.title}</div>
                          <div className="text-xs" style={{ color: "var(--muted)" }}>{q.date} · Rank #{q.rank}</div>
                        </div>
                        <div className="text-lg font-bold flex-shrink-0" style={{ color: q.score >= 80 ? "var(--green-600)" : "#f97316" }}>{q.score}%</div>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                        <div className="h-full rounded-full" style={{ width: `${q.score}%`, background: q.score >= 80 ? "var(--green-600)" : "#f97316" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Award size={17} style={{ color: "var(--gold-500)" }} />
                  <h3 className="font-bold" style={{ color: "var(--text)" }}>My Achievements</h3>
                </div>
                <span className="text-xs" style={{ color: "var(--muted)" }}>
                  {achievements.filter(a => a.earned).length} of {achievements.length} unlocked
                </span>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {achievements.map(a => (
                  <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: a.earned ? "var(--surface)" : "transparent", border: a.earned ? "none" : "1px dashed var(--border)", opacity: a.earned ? 1 : 0.55 }}>
                    <div className="relative w-12 h-12 flex-shrink-0" style={{ filter: a.earned ? "none" : "grayscale(1)" }}>
                      <Image src={a.icon} alt={a.title} fill className="object-contain" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>{a.title}</div>
                      <div className="text-xs" style={{ color: "var(--muted)" }}>{a.earned ? `Earned ${a.date}` : "Locked"}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* How You Compare */}
            <div className="card p-6">
              <h3 className="font-bold mb-4" style={{ color: "var(--text)" }}>How You Compare</h3>
              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  { label: "You", score: student.percentage, color: "var(--blue-600)", note: "Your average" },
                  { label: "Your School Avg", score: 82.1, color: "var(--green-600)", note: student.school.split(",")[0] },
                  { label: "State Average", score: 74.2, color: "var(--muted)", note: "All candidates" },
                ].map(row => (
                  <div key={row.label}>
                    <div className="flex items-baseline justify-between mb-1.5">
                      <span className="text-sm font-medium" style={{ color: "var(--text)" }}>{row.label}</span>
                      <span className="text-sm font-bold" style={{ color: "var(--navy-950)" }}>{row.score}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden mb-1" style={{ background: "var(--border)" }}>
                      <div className="h-full rounded-full" style={{ width: `${row.score}%`, background: row.color }} />
                    </div>
                    <div className="text-xs" style={{ color: "var(--muted)" }}>{row.note}</div>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  You're scoring <span className="font-bold" style={{ color: "var(--green-600)" }}>{(student.percentage - 74.2).toFixed(1)} points</span> above the state average.
                </p>
                <Link href="/leaderboard" className="text-sm font-medium flex items-center gap-1" style={{ color: "var(--blue-600)" }}>
                  See full leaderboard <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </>
        )}

        {/* ──────────────────────────────────────────────────────────
            2. SCHOOL COORDINATOR DASHBOARD
            ────────────────────────────────────────────────────────── */}
        {role === "school" && (
          <>
            {/* Banner welcome */}
            <div className="rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg, #06245f 0%, #1e4ea8 100%)" }}>
              <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10" style={{ background: "white", transform: "translate(35%, -40%)" }} />
              <h1 className="text-2xl font-bold mb-1">Government Secondary School Portal</h1>
              <p className="text-sm opacity-80 max-w-xl">
                Managing candidates and analytics for Calabar Municipal Zone. Add students, track subject scores, and compare state averages.
              </p>
            </div>

            {/* School KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {schoolStats.map(s => (
                <div key={s.label} className="card p-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${s.color}18`, color: s.color }}>
                    {s.icon}
                  </div>
                  <div className="text-2xl font-bold" style={{ color: "var(--navy-950)" }}>{s.value}</div>
                  <div className="text-xs mt-0.5 font-medium" style={{ color: "var(--text)" }}>{s.label}</div>
                  {s.sub && <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{s.sub}</div>}
                </div>
              ))}
            </div>

            {/* Dynamic tabs/sections */}
            {activeTab === "overview" && (
              <div className="grid lg:grid-cols-5 gap-6">
                {/* School progress bar charts */}
                <div className="card p-6 lg:col-span-3">
                  <h3 className="font-bold mb-1" style={{ color: "var(--text)" }}>Subject Performance</h3>
                  <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>Average score across school candidates per subject</p>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={topSubjects} margin={{ left: -20, right: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis dataKey="subject" tick={{ fontSize: 10, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                      <Tooltip formatter={(v) => [`${v}%`, "Average Score"]} />
                      <Bar dataKey="avgScore" fill="var(--blue-600)" radius={[6, 6, 0, 0]}>
                        {topSubjects.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={["#2f6bff", "#2eaf5d", "#f4b400", "#7c3aed", "#f97316"][index % 5]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Top students from this school */}
                <div className="card p-5 lg:col-span-2">
                  <h3 className="font-bold mb-4" style={{ color: "var(--text)" }}>School Champions</h3>
                  <div className="space-y-4">
                    {schoolStudents.slice(0, 3).map((st, idx) => (
                      <div key={st.id} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{
                          background: idx === 0 ? "rgba(244,180,0,0.15)" : idx === 1 ? "rgba(107,120,144,0.15)" : "rgba(249,115,22,0.15)",
                          color: idx === 0 ? "var(--gold-500)" : idx === 1 ? "var(--muted)" : "#f97316"
                        }}>
                          {idx + 1}
                        </div>
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border" style={{ borderColor: "var(--border)" }}>
                          <Image src={st.portrait} alt={st.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>{st.name}</div>
                          <div className="text-xs" style={{ color: "var(--muted)" }}>LGA: {st.lga}</div>
                        </div>
                        <div className="text-sm font-bold" style={{ color: "var(--navy-950)" }}>{st.score}%</div>
                      </div>
                    ))}
                  </div>
                  <Link href="/dashboard?tab=students" className="btn-secondary w-full py-2.5 text-xs text-center block mt-5">
                    View Roster Roster
                  </Link>
                </div>
              </div>
            )}

            {/* Students tab */}
            {activeTab === "students" && (
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-base" style={{ color: "var(--text)" }}>School Candidates Roster ({schoolStudents.length})</h3>
                  <Link href="/dashboard?tab=register" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:opacity-90 transition-opacity">
                    <Plus size={14} /> Register Candidate
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead style={{ background: "var(--surface)", color: "var(--muted)" }}>
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-semibold">Rank</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold">Name</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold">LGA</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold">Average score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                      {schoolStudents.map((st, i) => (
                        <tr key={st.id} className="hover:bg-gray-50/50">
                          <td className="px-4 py-3 font-semibold text-xs text-gray-500">#{i + 1}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 flex-shrink-0" style={{ borderColor: "var(--border)" }}>
                                <Image src={st.portrait} alt={st.name} fill className="object-cover" />
                              </div>
                              <span className="font-medium text-slate-800">{st.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500">{st.lga}</td>
                          <td className="px-4 py-3 text-right font-bold text-slate-900">{st.score > 0 ? `${st.score}%` : "Not Graded"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Register Candidates tab */}
            {activeTab === "register" && (
              <div className="max-w-xl mx-auto card p-6">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600"><UserPlus size={18} /></div>
                  <div>
                    <h3 className="font-bold text-base" style={{ color: "var(--text)" }}>Register New Candidate</h3>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>Enroll a student into the Senator's Quiz Competition</p>
                  </div>
                </div>

                {regSuccess && (
                  <div className="mb-4 p-4 rounded-xl text-sm font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-2 animate-fadeIn">
                    <CheckCircle size={16} /> {regSuccess}
                  </div>
                )}

                <form onSubmit={handleRegisterCandidate} className="space-y-4 text-sm">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-600">Candidate Full Name</label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      placeholder="e.g. Samuel Archibong"
                      className="w-full px-4 py-2.5 rounded-xl border outline-none border-slate-200 focus:border-blue-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-600">LGA Zone</label>
                      <select
                        value={regLga}
                        onChange={e => setRegLga(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border outline-none border-slate-200 focus:border-blue-600 bg-white"
                      >
                        <option>Calabar Municipal</option>
                        <option>Calabar South</option>
                        <option>Akpabuyo</option>
                        <option>Odukpani</option>
                        <option>Bakassi</option>
                        <option>Akamkpa</option>
                        <option>Biase</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-600">Subject Tally</label>
                      <select
                        value={regSubjectCount}
                        onChange={e => setRegSubjectCount(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border outline-none border-slate-200 focus:border-blue-600 bg-white"
                      >
                        <option>3 Subjects</option>
                        <option>4 Subjects</option>
                        <option>5 Subjects</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-1.5 mt-2">
                    Submit Registration & Generate ID
                  </button>
                </form>
              </div>
            )}

            {/* School Analytics tab */}
            {activeTab === "analytics" && (
              <div className="card p-6 space-y-6">
                <div>
                  <h3 className="font-bold text-base" style={{ color: "var(--text)" }}>School Performance Analytics</h3>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>State-wide comparison charts and candidate benchmarks</p>
                </div>
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="p-4 rounded-2xl border" style={{ borderColor: "var(--border)" }}>
                    <h4 className="font-semibold text-sm mb-3 text-slate-700">Participation Ratio</h4>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-500">Active Competitors</span>
                      <span className="text-sm font-semibold text-slate-800">245 / 300 students</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-green-500" style={{ width: "81.6%" }} />
                    </div>
                    <div className="text-[10px] text-slate-400 mt-2">Targeting 90% participation by the end of season</div>
                  </div>

                  <div className="p-4 rounded-2xl border" style={{ borderColor: "var(--border)" }}>
                    <h4 className="font-semibold text-sm mb-3 text-slate-700">Benchmark comparison</h4>
                    <div className="space-y-3">
                      {[
                        { label: "Your School Avg", score: 82.4, color: "var(--blue-600)" },
                        { label: "LGA Municipal Avg", score: 78.4, color: "var(--gold-500)" },
                        { label: "Statewide Avg", score: 74.2, color: "var(--muted)" }
                      ].map(item => (
                        <div key={item.label}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium">{item.label}</span>
                            <span className="font-bold">{item.score}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${item.score}%`, background: item.color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ──────────────────────────────────────────────────────────
            3. STATE ADMIN DASHBOARD
            ────────────────────────────────────────────────────────── */}
        {role === "admin" && (
          <>
            {/* Banner welcome */}
            <div className="rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden animate-fadeIn" style={{ background: "linear-gradient(135deg, #031a4a 0%, #0c2b6f 100%)" }}>
              <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10" style={{ background: "white", transform: "translate(35%, -40%)" }} />
              <div className="relative z-10">
                <h1 className="text-2xl font-bold mb-1">State Administration Control</h1>
                <p className="text-sm opacity-80 max-w-xl">
                  Supervise candidate registration, deploy weekly quizzes, compile leaderboard averages, and view statewide reports.
                </p>
              </div>
            </div>

            {/* Admin stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {adminStats.map(s => (
                <div key={s.label} className="card p-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${s.color}18`, color: s.color }}>
                    {s.icon}
                  </div>
                  <div className="text-2xl font-bold" style={{ color: "var(--navy-950)" }}>{s.value}</div>
                  <div className="text-xs mt-0.5 font-medium" style={{ color: "var(--text)" }}>{s.label}</div>
                  {s.sub && <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{s.sub}</div>}
                </div>
              ))}
            </div>

            {/* Main Admin Section */}
            {activeTab === "overview" && (
              <div className="grid lg:grid-cols-5 gap-6">
                {/* Score Distribution Chart */}
                <div className="card p-6 lg:col-span-3">
                  <h3 className="font-bold mb-1" style={{ color: "var(--text)" }}>State Score Distribution</h3>
                  <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>Summary of student grade counts across Cross River South</p>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={scoreDistribution} margin={{ left: -20, right: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis dataKey="grade" tick={{ fontSize: 10, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                      <Tooltip formatter={(v) => [`${v} Students`, "Count"]} />
                      <Bar dataKey="count" fill="var(--blue-600)" radius={[6, 6, 0, 0]}>
                        {scoreDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Quick actions panel */}
                <div className="card p-5 lg:col-span-2 space-y-4">
                  <h3 className="font-bold text-sm" style={{ color: "var(--text)" }}>Administrative Actions</h3>
                  
                  {scheduleSuccess && (
                    <div className="p-3.5 rounded-xl text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-2 animate-fadeIn font-medium">
                      <CheckCircle size={14} /> {scheduleSuccess}
                    </div>
                  )}

                  <form onSubmit={handleScheduleQuiz} className="space-y-3.5 text-xs">
                    <div className="font-semibold text-slate-700 border-b pb-1.5">Schedule Next Quiz</div>
                    <div>
                      <label className="block font-semibold mb-1 text-slate-600">Quiz Title</label>
                      <input
                        type="text"
                        required
                        value={quizTitle}
                        onChange={e => setQuizTitle(e.target.value)}
                        placeholder="e.g. Week 25 Math Challenge"
                        className="w-full px-3 py-2 rounded-lg border outline-none border-slate-200 focus:border-blue-600"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold mb-1 text-slate-600">Subject</label>
                        <select
                          value={quizSubject}
                          onChange={e => setQuizSubject(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border outline-none border-slate-200 focus:border-blue-600 bg-white"
                        >
                          <option>Mathematics</option>
                          <option>English Language</option>
                          <option>Biology</option>
                          <option>Physics</option>
                          <option>Chemistry</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-semibold mb-1 text-slate-600">Duration (mins)</label>
                        <input
                          type="number"
                          required
                          value={quizDuration}
                          onChange={e => setQuizDuration(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border outline-none border-slate-200 focus:border-blue-600"
                        />
                      </div>
                    </div>
                    <button type="submit" className="btn-primary w-full py-2 flex items-center justify-center gap-1 font-semibold">
                      <Plus size={14} /> Deploy Challenge
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Recent Activity Ticker (only showing in Admin) */}
            <div className="card p-6">
              <h3 className="font-bold text-sm mb-4" style={{ color: "var(--text)" }}>Live Submissions Feed</h3>
              <div className="space-y-4">
                {recentActivity.map(act => (
                  <div key={act.id} className="flex items-center gap-3.5 text-sm border-b pb-3.5 last:border-0 last:pb-0" style={{ borderColor: "var(--border)" }}>
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border flex-shrink-0" style={{ borderColor: "var(--border)" }}>
                      <Image src={act.avatar || "/assets/portraits/participant_5.png"} alt="portrait" fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{act.message}</p>
                      <span className="text-xs text-slate-400">{act.time}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{
                      background: act.type === "result" ? "rgba(46,175,93,0.12)" : act.type === "quiz" ? "rgba(244,180,0,0.15)" : "rgba(47,107,255,0.1)",
                      color: act.type === "result" ? "var(--green-600)" : act.type === "quiz" ? "#d4af37" : "var(--blue-600)"
                    }}>
                      {act.type.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* State analytics tab */}
            {activeTab === "state-analytics" && (
              <div className="card p-6 space-y-6">
                <div>
                  <h3 className="font-bold text-base" style={{ color: "var(--text)" }}>LGA Heatmap Rankings</h3>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>Average academic performance mapped by local government area (LGA)</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead style={{ background: "var(--surface)", color: "var(--muted)" }}>
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-semibold">Rank</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold">LGA Name</th>
                        <th className="text-center px-4 py-3 text-xs font-semibold">Schools</th>
                        <th className="text-center px-4 py-3 text-xs font-semibold">Candidates</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold">Average score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                      {allLGAs.map((l, i) => (
                        <tr key={l.lga} className="hover:bg-gray-50/50">
                          <td className="px-4 py-3 font-semibold text-xs text-gray-500">#{i + 1}</td>
                          <td className="px-4 py-3 font-semibold text-slate-800">{l.lga}</td>
                          <td className="px-4 py-3 text-center text-gray-600">{l.schools}</td>
                          <td className="px-4 py-3 text-center text-gray-600">{l.candidates}</td>
                          <td className="px-4 py-3 text-right">
                            <span className="font-bold" style={{ color: l.avgScore >= 70 ? "var(--green-600)" : l.avgScore >= 60 ? "#f97316" : "var(--muted)" }}>
                              {l.avgScore}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </PageShell>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen" style={{ color: "var(--muted)" }}>Loading dashboard…</div>}>
      <DashboardContent />
    </Suspense>
  );
}

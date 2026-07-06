"use client";

import { useState } from "react";
import Image from "next/image";
import PageShell from "@/components/PageShell";
import { candidateResult, topStudents, schools, allLGAs, topSubjects } from "@/lib/mockData";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { CheckCircle, Award, Download, Share2, Printer, Search, AlertCircle, FileText } from "lucide-react";

const pieColors = ["#2f6bff", "#2eaf5d", "#f4b400", "#7c3aed", "#f97316"];

export default function ResultsPage() {
  const [searchTab, setSearchTab] = useState("Candidate");
  const [searchQuery, setSearchQuery] = useState("Ekpenyong Akpan");
  const [activeQuery, setActiveQuery] = useState("Ekpenyong Akpan");
  const [showCertificate, setShowCertificate] = useState(false);

  // Helper function to build dynamic student results
  const getCandidateResult = (nameQuery: string) => {
    const studentInfo = topStudents.find(
      s => s.name.toLowerCase().includes(nameQuery.toLowerCase()) || 
           `crs/2025-26/00${s.id + 100}`.includes(nameQuery.toLowerCase())
    );
    if (!studentInfo) return null;
    
    // Scale factor based on their average score vs Ekpenyong's 94.4
    const scale = studentInfo.score / 94.4;
    const baseSubjects = [
      { name: "Mathematics", score: 98, max: 100, grade: "A", percentile: 99 },
      { name: "English Language", score: 95, max: 100, grade: "A", percentile: 97 },
      { name: "Biology", score: 94, max: 100, grade: "A", percentile: 96 },
      { name: "Physics", score: 92, max: 100, grade: "A", percentile: 94 },
      { name: "Chemistry", score: 93, max: 100, grade: "A", percentile: 95 },
    ];
    
    const subjects = baseSubjects.map(sub => {
      const newScore = Math.min(100, Math.round(sub.score * scale));
      return {
        ...sub,
        score: newScore,
        grade: newScore >= 80 ? "A" : newScore >= 65 ? "B" : newScore >= 50 ? "C" : "D",
        percentile: Math.min(99, Math.max(70, Math.round(sub.percentile * scale))),
      };
    });

    const scoreTrend = [
      { week: "Wk 1", score: Math.round(81 * scale) },
      { week: "Wk 2", score: Math.round(85 * scale) },
      { week: "Wk 3", score: Math.round(88 * scale) },
      { week: "Wk 4", score: Math.round(90 * scale) },
      { week: "Wk 5", score: Math.round(92 * scale) },
      { week: "Wk 6", score: Math.round(studentInfo.score) },
    ];

    return {
      name: studentInfo.name,
      school: studentInfo.school,
      lga: studentInfo.lga,
      candidateId: `CRS/2025-26/00${studentInfo.id + 140}`,
      season: "2025/2026 Season 1",
      rank: studentInfo.rank,
      totalScore: Math.round(studentInfo.score * 5),
      maxScore: 500,
      percentage: studentInfo.score,
      grade: studentInfo.score >= 80 ? "A" : studentInfo.score >= 65 ? "B" : studentInfo.score >= 50 ? "C" : "D",
      portrait: studentInfo.portrait,
      subjects,
      scoreTrend,
    };
  };

  const getSchoolResult = (schoolQuery: string) => {
    return schools.find(s => s.name.toLowerCase().includes(schoolQuery.toLowerCase()));
  };

  const getLgaResult = (lgaQuery: string) => {
    return allLGAs.find(l => l.lga.toLowerCase().includes(lgaQuery.toLowerCase()));
  };

  const getSubjectResult = (subQuery: string) => {
    return topSubjects.find(s => s.subject.toLowerCase().includes(subQuery.toLowerCase()));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveQuery(searchQuery);
  };

  // Get active result structures
  const activeCandidate = searchTab === "Candidate" ? getCandidateResult(activeQuery) : null;
  const activeSchool = searchTab === "School" ? getSchoolResult(activeQuery) : null;
  const activeLga = searchTab === "LGA" ? getLgaResult(activeQuery) : null;
  const activeSubject = searchTab === "Subject" ? getSubjectResult(activeQuery) : null;

  const isSearchEmpty = !activeCandidate && !activeSchool && !activeLga && !activeSubject;

  return (
    <PageShell>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Results Portal</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>Search, verify, and view academic scores and print official certificates.</p>
        </div>

        {/* Search Panel */}
        <div className="card p-5">
          <div className="flex gap-1 p-1 rounded-xl w-fit mb-4" style={{ background: "var(--border)" }}>
            {["Candidate", "School", "LGA", "Subject"].map(tab => (
              <button key={tab} onClick={() => { setSearchTab(tab); setSearchQuery(""); setActiveQuery(""); }}
                className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={searchTab === tab ? { background: "#fff", color: "var(--text)", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" } : { color: "var(--muted)" }}
              >{tab}</button>
            ))}
          </div>
          <form onSubmit={handleSearchSubmit} className="flex gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={`Type ${searchTab.toLowerCase()} name (e.g. ${
                  searchTab === "Candidate" ? "Ekpenyong, Bassey, Mary" : 
                  searchTab === "School" ? "Government Secondary, Hope Waddell" : 
                  searchTab === "LGA" ? "Calabar Municipal, Yala" : "Mathematics, Biology"
                })...`}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-blue-100"
                style={{ borderColor: "var(--border)", color: "var(--text)" }}
              />
            </div>
            <button type="submit" className="btn-primary px-6 py-2.5 text-sm flex items-center gap-1.5 font-semibold">
              Search Results
            </button>
          </form>
        </div>

        {/* EMPTY STATE */}
        {isSearchEmpty && (
          <div className="card p-8 text-center max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-amber-50 text-amber-500 mx-auto">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">No Records Found</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Could not find any matched results for "{activeQuery || searchQuery}" in the {searchTab} registry.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 text-left">
              <span className="font-bold block mb-1">Recommended Searches:</span>
              {searchTab === "Candidate" && "• Ekpenyong Akpan, Bassey Edet, Mary E. Offiong"}
              {searchTab === "School" && "• Government Secondary School, Hope Waddell Training Institution"}
              {searchTab === "LGA" && "• Calabar Municipal, Calabar South, Yala"}
              {searchTab === "Subject" && "• Mathematics, Biology, Chemistry"}
            </div>
          </div>
        )}

        {/* ── CANDIDATE DISPLAY ── */}
        {searchTab === "Candidate" && activeCandidate && (
          <>
            <div className="card p-6">
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <div className="relative w-24 h-28 rounded-xl overflow-hidden border-2 flex-shrink-0" style={{ borderColor: "var(--border)" }}>
                  <Image src={activeCandidate.portrait} alt={activeCandidate.name} fill className="object-cover" />
                </div>
                <div className="flex-1 w-full">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>{activeCandidate.name}</h2>
                      <div className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>{activeCandidate.school}</div>
                      <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>ID: {activeCandidate.candidateId} • {activeCandidate.season}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => setShowCertificate(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors hover:bg-gray-50 bg-white"
                        style={{ borderColor: "var(--border)", color: "var(--text)" }}
                      >
                        <Printer size={13} className="text-blue-600" /> Print Certificate
                      </button>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: "rgba(46,175,93,0.1)", color: "var(--green-600)" }}>
                        <CheckCircle size={14} /> Verified Result
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3.5 rounded-xl text-sm" style={{ background: "rgba(47,107,255,0.05)", border: "1px solid rgba(47,107,255,0.12)" }}>
                    <span className="font-semibold" style={{ color: "var(--blue-600)" }}>
                      {activeCandidate.name} scored higher than {99 - activeCandidate.rank + 1}% of all statewide candidates this week.
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                    {[
                      { label: "Total Score", value: `${activeCandidate.totalScore}/${activeCandidate.maxScore}` },
                      { label: "Percentage", value: `${activeCandidate.percentage}%` },
                      { label: "Grade", value: activeCandidate.grade },
                      { label: "Rank", value: `#${activeCandidate.rank}` },
                    ].map(stat => (
                      <div key={stat.label} className="p-3 rounded-xl" style={{ background: "var(--surface)" }}>
                        <div className="text-xs" style={{ color: "var(--muted)" }}>{stat.label}</div>
                        <div className="text-xl font-bold mt-0.5" style={{ color: "var(--navy-950)" }}>{stat.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Subject breakdown */}
              <div className="lg:col-span-2 card overflow-hidden">
                <div className="px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-bold" style={{ color: "var(--text)" }}>Subject Breakdown</h3>
                </div>
                <table className="w-full text-sm">
                  <thead style={{ background: "var(--surface)", color: "var(--muted)" }}>
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-semibold">Subject</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold">Score</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold">Grade</th>
                      <th className="text-right px-6 py-3 text-xs font-semibold">Percentile</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeCandidate.subjects.map((sub, i) => (
                      <tr key={sub.name} className="border-t" style={{ borderColor: "var(--border)" }}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="relative w-8 h-8 rounded-lg overflow-hidden border flex-shrink-0" style={{ borderColor: "var(--border)" }}>
                              <Image src={["/assets/icons/math.png", "/assets/icons/english.png", "/assets/icons/biology.png", "/assets/icons/physics.png", "/assets/icons/chemistry.png"][i % 5]} alt={sub.name} fill className="object-contain p-0.5" />
                            </div>
                            <span className="font-medium" style={{ color: "var(--text)" }}>{sub.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div>
                            <span className="font-bold" style={{ color: "var(--navy-950)" }}>{sub.score}</span>
                            <span className="text-xs" style={{ color: "var(--muted)" }}>/{sub.max}</span>
                          </div>
                          <div className="mt-1.5 h-1.5 w-24 mx-auto rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                            <div className="h-full rounded-full" style={{ width: `${sub.score}%`, background: pieColors[i % 5] }} />
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(46,175,93,0.1)", color: "var(--green-600)" }}>{sub.grade}</span>
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-sm" style={{ color: "var(--text)" }}>Top {100 - sub.percentile + 1}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Performance donut */}
              <div className="card p-5 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm mb-4" style={{ color: "var(--text)" }}>Performance Overview</h3>
                  <div className="flex justify-center">
                    <PieChart width={160} height={160}>
                      <Pie data={activeCandidate.subjects.map(s => ({ name: s.name, value: s.score }))} cx={80} cy={80} innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value">
                        {activeCandidate.subjects.map((_, i) => <Cell key={i} fill={pieColors[i % 5]} />)}
                      </Pie>
                    </PieChart>
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  {activeCandidate.subjects.map((s, i) => (
                    <div key={s.name} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: pieColors[i % 5] }} />
                      <span className="text-xs flex-1 text-slate-600 truncate">{s.name}</span>
                      <span className="text-xs font-bold text-slate-800">{s.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Score trend */}
              <div className="card p-5">
                <h3 className="font-bold text-sm mb-4" style={{ color: "var(--text)" }}>Score Trend</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={activeCandidate.scoreTrend}>
                    <XAxis dataKey="week" tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} width={30} />
                    <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)", fontSize: 12 }} />
                    <Line type="monotone" dataKey="score" stroke="var(--blue-600)" strokeWidth={2.5} dot={{ fill: "var(--blue-600)", r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Top performers */}
              <div className="card p-5">
                <h3 className="font-bold text-sm mb-4" style={{ color: "var(--text)" }}>Top Performers Statewide</h3>
                <div className="space-y-3.5">
                  {topStudents.slice(0, 4).map(s => (
                    <div key={s.id} className="flex items-center gap-3">
                      <div className="relative w-9 h-9 rounded-full overflow-hidden border flex-shrink-0" style={{ borderColor: "var(--border)" }}>
                        <Image src={s.portrait} alt={s.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>{s.name}</div>
                        <div className="text-xs truncate" style={{ color: "var(--muted)" }}>{s.school.split(",")[0]}</div>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold" style={{ color: "var(--gold-500)" }}>
                        <Award size={12} /> {s.score}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── SCHOOL DISPLAY ── */}
        {searchTab === "School" && activeSchool && (
          <div className="card p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-100">
                <FileText size={22} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">{activeSchool.name}</h2>
                <p className="text-xs text-slate-500">{activeSchool.lga} LGA Zone · State Rank #{activeSchool.rank}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Average Score", value: `${activeSchool.avgScore}%` },
                { label: "Active Candidates", value: activeSchool.candidates },
                { label: "Best Subject Area", value: activeSchool.bestSubject },
                { label: "Medals Won", value: activeSchool.gold + activeSchool.silver + activeSchool.bronze },
              ].map(stat => (
                <div key={stat.label} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-xs text-slate-500">{stat.label}</div>
                  <div className="text-xl font-bold mt-1 text-slate-900">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── LGA DISPLAY ── */}
        {searchTab === "LGA" && activeLga && (
          <div className="card p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600 border border-emerald-100">
                <FileText size={22} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">{activeLga.lga} LGA Results</h2>
                <p className="text-xs text-slate-500">Cross River South · Region Rank #{activeLga.rank}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "LGA Average Score", value: `${activeLga.avgScore}%` },
                { label: "Schools Competing", value: activeLga.schools },
                { label: "Total Candidates", value: activeLga.candidates },
                { label: "Performance Trend", value: activeLga.trend.toUpperCase(), color: activeLga.trend === "up" ? "text-green-600" : "text-gray-600" },
              ].map(stat => (
                <div key={stat.label} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-xs text-slate-500">{stat.label}</div>
                  <div className={`text-xl font-bold mt-1 text-slate-900 ${stat.color || ""}`}>{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SUBJECT DISPLAY ── */}
        {searchTab === "Subject" && activeSubject && (
          <div className="card p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-50 text-amber-500 border border-amber-100">
                <FileText size={22} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">{activeSubject.subject} Category</h2>
                <p className="text-xs text-slate-500">State Syllabus benchmarks</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Subject Average Score", value: `${activeSubject.avgScore}%` },
                { label: "Active Competitors", value: activeSubject.participants.toLocaleString() },
                { label: "Grading Scale", value: "Standard A-F" },
              ].map(stat => (
                <div key={stat.label} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-xs text-slate-500">{stat.label}</div>
                  <div className="text-xl font-bold mt-1 text-slate-900">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── CERTIFICATE MODAL & PRINT STYLING ── */}
      {showCertificate && activeCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setShowCertificate(false)}>
          {/* Inject dynamic print-only CSS styles */}
          <style dangerouslySetInnerHTML={{__html: `
            @media print {
              body * {
                visibility: hidden;
              }
              #certificate-print-area, #certificate-print-area * {
                visibility: visible;
              }
              #certificate-print-area {
                position: absolute;
                left: 50% !important;
                top: 50% !important;
                transform: translate(-50%, -50%) !important;
                width: 900px !important;
                height: auto !important;
                border: 15px double #f4b400 !important;
                background: #031a4a !important;
                color: #fff !important;
                -webkit-print-color-adjust: exact;
                padding: 40px !important;
                border-radius: 0px !important;
                box-shadow: none !important;
              }
            }
          `}} />

          <div className="w-full max-w-2xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl animate-scaleIn border border-slate-700" onClick={e => e.stopPropagation()}>
            {/* The printable card container */}
            <div id="certificate-print-area" className="relative p-12 text-center text-white" style={{ background: "linear-gradient(135deg, #020d20 0%, #061c47 50%, #031a4a 100%)", border: "12px solid #f4b400" }}>
              {/* Vintage border patterns */}
              <div className="absolute inset-3 border border-white/10 rounded pointer-events-none" />
              <div className="absolute inset-5 border-2 border-white/5 rounded pointer-events-none" />
              
              <div className="relative w-18 h-18 mx-auto mb-4">
                <Image src="/assets/brand/logo_state_quiz.png" alt="State Quiz Logo" fill className="object-contain" />
              </div>
              <div className="text-[10px] font-extrabold tracking-widest text-yellow-500 mb-1">OFFICIAL RECOGNITION OF EXCELLENCE</div>
              <h2 className="text-xl font-bold tracking-wider text-white font-serif mb-6" style={{ letterSpacing: "1px" }}>SEN. ASUQUO EKPENYONG QUIZ COMPETITION</h2>
              
              <div className="w-24 h-0.5 bg-yellow-500 mx-auto mb-5" />

              <div className="text-white/60 text-xs italic font-serif mb-2">This is proudly presented to</div>
              <div className="text-3xl font-bold text-white tracking-wide font-sans mb-3 underline decoration-yellow-500 decoration-wavy underline-offset-8">{activeCandidate.name}</div>
              <div className="text-white/80 text-xs font-serif mb-5 max-w-md mx-auto">
                for outstanding academic performance at <span className="font-semibold text-white">{activeCandidate.school}</span>, achieving a statewide average percentile of
              </div>

              <div className="text-5.5xl font-black text-yellow-500 leading-none mb-1 tracking-tighter" style={{ fontFamily: "Georgia, serif" }}>{activeCandidate.percentage}%</div>
              <div className="text-xs font-bold text-yellow-500/80 mb-6 uppercase tracking-widest">Grade {activeCandidate.grade} · Ranked #{activeCandidate.rank} Statewide</div>

              <div className="w-full flex justify-between items-end mt-10 px-8 text-left border-t border-white/10 pt-6">
                <div>
                  <div className="text-[10px] text-white/50">CONSTITUENCY</div>
                  <div className="text-[11px] font-bold text-white">Cross River South District</div>
                  <div className="text-[9px] text-white/40">{activeCandidate.season}</div>
                </div>
                <div className="text-right">
                  {/* Handwritten mock signature */}
                  <div className="text-yellow-500 font-serif italic text-lg leading-none mb-1 select-none pr-3" style={{ fontFamily: "'Brush Script MT', cursive, sans-serif" }}>Asuquo Ekpenyong</div>
                  <div className="w-36 h-px bg-white/20 ml-auto mb-1" />
                  <div className="text-[10px] text-white/50 uppercase font-semibold">SENATOR ASUQUO EKPENYONG</div>
                  <div className="text-[9px] text-yellow-500/70">Founding Sponsor</div>
                </div>
              </div>
            </div>

            {/* Modal foot controls */}
            <div className="p-4 flex gap-3 bg-slate-900 border-t border-slate-800">
              <button onClick={() => window.print()} className="btn-primary flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-2" style={{ background: "var(--gold-500)", color: "var(--navy-950)" }}>
                <Printer size={14} /> Print Certificate
              </button>
              <button onClick={() => setShowCertificate(false)} className="px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-bold text-white hover:bg-slate-800 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}

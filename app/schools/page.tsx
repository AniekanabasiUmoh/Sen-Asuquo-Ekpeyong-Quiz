"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { schools, topStudents } from "@/lib/mockData";
import { Search, TrendingUp, TrendingDown, Minus, ChevronRight, School as SchoolIcon, Users, MapPin, BarChart2, X, Award, ArrowRight } from "lucide-react";
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "up") return <TrendingUp size={14} className="text-green-500" />;
  if (trend === "down") return <TrendingDown size={14} className="text-red-500" />;
  return <Minus size={14} style={{ color: "var(--muted)" }} />;
}

const medals = ["/assets/medals/rank_gold_1.png", "/assets/medals/rank_silver_2.png", "/assets/medals/rank_bronze_3.png"];
const lgas = ["All LGAs", ...Array.from(new Set(schools.map(s => s.lga)))];

// Mock subject scores helper
const schoolSubjectPerf = [
  { subject: "Maths", score: 84 },
  { subject: "English", score: 79 },
  { subject: "Biology", score: 76 },
  { subject: "Physics", score: 72 },
  { subject: "Chemistry", score: 70 },
];

export default function SchoolsPage() {
  const [search, setSearch] = useState("");
  const [lgaFilter, setLgaFilter] = useState("All LGAs");
  const [sortBy, setSortBy] = useState("rank");
  const [activeTab, setActiveTab] = useState("All Schools");
  const [selectedSchool, setSelectedSchool] = useState<typeof schools[0] | null>(null);

  let filtered = schools.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.lga.toLowerCase().includes(search.toLowerCase());
    const matchLGA = lgaFilter === "All LGAs" || s.lga === lgaFilter;
    return matchSearch && matchLGA;
  });

  if (sortBy === "score") filtered = [...filtered].sort((a, b) => b.avgScore - a.avgScore);
  else if (sortBy === "candidates") filtered = [...filtered].sort((a, b) => b.candidates - a.candidates);
  else filtered = [...filtered].sort((a, b) => a.rank - b.rank);

  const displayed = activeTab === "Top Schools" ? filtered.slice(0, 5) : filtered;

  return (
    <PageShell>
      {/* Inject slide animation styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide-in-right {
          0% { transform: translateX(100%); }
          100% { transform: translateX(0); }
        }
        .animate-slide-right {
          animation: slide-in-right 0.25s ease-out forwards;
        }
      `}} />

      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Schools Directory</h1>
            <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>{schools.length} participating schools across Cross River South</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Schools", value: "127", icon: <SchoolIcon size={20} />, color: "var(--blue-600)", bg: "rgba(47,107,255,0.08)" },
            { label: "Total Candidates", value: "4,218", icon: <Users size={20} />, color: "var(--green-600)", bg: "rgba(46,175,93,0.08)" },
            { label: "LGAs Covered", value: "18", icon: <MapPin size={20} />, color: "var(--gold-500)", bg: "rgba(244,180,0,0.1)" },
            { label: "Avg Score", value: "74.2%", icon: <BarChart2 size={20} />, color: "#7c3aed", bg: "rgba(124,58,237,0.08)" },
          ].map(s => (
            <div key={s.label} className="card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
              <div>
                <div className="text-xs" style={{ color: "var(--muted)" }}>{s.label}</div>
                <div className="text-lg font-bold" style={{ color: "var(--navy-950)" }}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search & filters */}
        <div className="card p-5 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search schools by name or LGA..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border outline-none"
                style={{ borderColor: "var(--border)", color: "var(--text)" }}
              />
            </div>
            <select
              value={lgaFilter}
              onChange={e => setLgaFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl text-sm border outline-none bg-white"
              style={{ borderColor: "var(--border)", color: "var(--text)" }}
            >
              {lgas.map(l => <option key={l}>{l}</option>)}
            </select>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-3 py-2.5 rounded-xl text-sm border outline-none bg-white"
              style={{ borderColor: "var(--border)", color: "var(--text)" }}
            >
              <option value="rank">Sort: By Rank</option>
              <option value="score">Sort: Avg Score</option>
              <option value="candidates">Sort: Candidates</option>
            </select>
          </div>
          <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: "var(--border)" }}>
            {["All Schools", "Top Schools"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={activeTab === tab ? { background: "#fff", color: "var(--text)", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" } : { color: "var(--muted)" }}
              >{tab}</button>
            ))}
          </div>
        </div>

        {/* Table list */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ background: "var(--surface)", color: "var(--muted)" }}>
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Rank</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">School</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold hidden sm:table-cell">LGA</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold hidden md:table-cell">Candidates</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold hidden lg:table-cell">Best Subject</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold">Avg Score</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold">Trend</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {displayed.map(school => (
                  <tr 
                    key={school.id} 
                    className="border-t hover:bg-gray-50/50 transition-colors cursor-pointer" 
                    style={{ borderColor: "var(--border)" }}
                    onClick={() => setSelectedSchool(school)}
                  >
                    <td className="px-4 py-3">
                      {school.rank <= 3 ? (
                        <span className="relative inline-flex w-7 h-7">
                          <Image src={medals[school.rank - 1]} alt={`rank ${school.rank}`} fill className="object-contain" />
                        </span>
                      ) : (
                        <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "var(--surface)", color: "var(--muted)" }}>{school.rank}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="relative w-9 h-9 rounded-lg overflow-hidden border flex-shrink-0" style={{ borderColor: "var(--border)" }}>
                          <Image src={school.crest} alt={school.name} fill className="object-contain p-0.5" />
                        </div>
                        <div className="font-semibold text-slate-800 hover:text-blue-600 transition-colors">{school.name}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs hidden sm:table-cell" style={{ color: "var(--muted)" }}>{school.lga}</td>
                    <td className="px-4 py-3 text-center text-sm hidden md:table-cell" style={{ color: "var(--text)" }}>{school.candidates}</td>
                    <td className="px-4 py-3 text-center hidden lg:table-cell">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: "rgba(47,107,255,0.08)", color: "var(--blue-600)" }}>{school.bestSubject}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold" style={{ color: "var(--navy-950)" }}>{school.avgScore}%</td>
                    <td className="px-4 py-3 text-center" onClick={e => e.stopPropagation()}><TrendIcon trend={school.trend} /></td>
                    <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                      <button onClick={() => setSelectedSchool(school)} className="text-xs font-semibold flex items-center gap-0.5 text-blue-600 hover:opacity-80">
                        Inspect <ChevronRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t flex items-center justify-between text-xs" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
            <span>Showing {displayed.length} of {schools.length} schools</span>
            <div className="flex gap-1">
              <button className="px-3 py-1 rounded border bg-white" style={{ borderColor: "var(--border)" }}>← Prev</button>
              <button className="px-3 py-1 rounded border font-bold text-white bg-slate-900 border-slate-900">1</button>
              <button className="px-3 py-1 rounded border bg-white" style={{ borderColor: "var(--border)" }}>2</button>
              <button className="px-3 py-1 rounded border bg-white" style={{ borderColor: "var(--border)" }}>Next →</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── SCHOOL PREVIEW SIDE-DRAWER ── */}
      {selectedSchool && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs" onClick={() => setSelectedSchool(null)}>
          <div 
            className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between border-l border-slate-200 animate-slide-right"
            onClick={e => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border p-1" style={{ background: "white" }}>
                    <Image src={selectedSchool.crest} alt={selectedSchool.name} fill className="object-contain" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm leading-tight max-w-[220px]">{selectedSchool.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{selectedSchool.lga} LGA</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedSchool(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
                >
                  <X size={16} className="text-slate-500" />
                </button>
              </div>

              {/* School stats widgets */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                {[
                  { label: "Avg Score", value: `${selectedSchool.avgScore}%`, color: "text-blue-600" },
                  { label: "Candidates", value: selectedSchool.candidates, color: "text-slate-800" },
                  { label: "Best Subject", value: selectedSchool.bestSubject, color: "text-emerald-600" },
                  { label: "Medals Tally", value: selectedSchool.gold + selectedSchool.silver + selectedSchool.bronze, color: "text-yellow-600" }
                ].map(item => (
                  <div key={item.label} className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                    <span className="text-[10px] text-slate-400 font-semibold block">{item.label}</span>
                    <span className={`text-base font-bold mt-1 block ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Subject Breakdown Chart */}
              <div className="pt-4">
                <h4 className="font-bold text-slate-800 text-xs mb-3 flex items-center gap-1">
                  <BarChart2 size={13} className="text-blue-500" />
                  Subject strength scores
                </h4>
                <div className="h-40 bg-slate-50/50 border border-slate-100 rounded-xl p-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={schoolSubjectPerf} layout="vertical" margin={{ left: -30, right: 10, top: 0, bottom: 0 }}>
                      <XAxis type="number" domain={[0, 100]} hide />
                      <YAxis dataKey="subject" type="category" tick={{ fontSize: 9, fill: "#6b7890" }} axisLine={false} tickLine={false} />
                      <Tooltip formatter={(v) => [`${v}%`, "Average"]} />
                      <Bar dataKey="score" fill="#2f6bff" radius={[0, 4, 4, 0]} barSize={10}>
                        {schoolSubjectPerf.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={["#2f6bff", "#2eaf5d", "#f4b400", "#7c3aed", "#f97316"][idx % 5]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Champions inside school */}
              <div className="pt-4">
                <h4 className="font-bold text-slate-800 text-xs mb-2.5 flex items-center gap-1">
                  <Award size={13} className="text-yellow-500" />
                  Top registered candidates
                </h4>
                <div className="space-y-2">
                  {topStudents.filter(s => s.school.includes(selectedSchool.name.split(",")[0])).slice(0, 2).map((ch, idx) => (
                    <div key={ch.id} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-2">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-200">
                          <Image src={ch.portrait} alt={ch.name} fill className="object-cover" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-700">{ch.name}</div>
                          <div className="text-[10px] text-slate-400">CRS Rank #{ch.rank} statewide</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">{ch.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer action buttons */}
            <div className="pt-6 border-t flex flex-col gap-2 border-slate-100">
              <Link 
                href={`/schools/${selectedSchool.id}`}
                className="btn-primary w-full py-2.5 text-xs text-center flex items-center justify-center gap-1"
              >
                Go to Full School Profile <ArrowRight size={13} />
              </Link>
              <button 
                onClick={() => setSelectedSchool(null)}
                className="w-full py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}

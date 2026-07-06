"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { schools, topStudents, allLGAs, topSubjects } from "@/lib/mockData";
import { TrendingUp, TrendingDown, Minus, Search } from "lucide-react";

const medals = ["/assets/medals/rank_gold_1.png", "/assets/medals/rank_silver_2.png", "/assets/medals/rank_bronze_3.png"];

function RankBadge({ rank }: { rank: number }) {
  if (rank <= 3) return <span className="relative inline-flex w-7 h-7"><Image src={medals[rank - 1]} alt={`rank ${rank}`} fill className="object-contain" /></span>;
  return <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "var(--surface)", color: "var(--muted)" }}>{rank}</span>;
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "up") return <TrendingUp size={14} className="text-green-500" />;
  if (trend === "down") return <TrendingDown size={14} className="text-red-500" />;
  return <Minus size={14} style={{ color: "var(--muted)" }} />;
}

function MovementBadge({ m }: { m: number }) {
  if (m > 0) return <span className="text-xs font-bold" style={{ color: "var(--green-600)" }}>+{m}</span>;
  if (m < 0) return <span className="text-xs font-bold" style={{ color: "#ef4444" }}>{m}</span>;
  return <span className="text-xs" style={{ color: "var(--muted)" }}>—</span>;
}

const tabs = ["Schools", "Students", "LGAs", "Subjects"];

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("Schools");
  const [search, setSearch] = useState("");

  const filteredSchools = schools.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.lga.toLowerCase().includes(search.toLowerCase())
  );
  const filteredStudents = topStudents.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.school.toLowerCase().includes(search.toLowerCase())
  );
  const filteredLGAs = allLGAs.filter(l =>
    l.lga.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageShell>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Leaderboard</h1>
            <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>2025 Season 1 — Rankings updated in real-time</p>
          </div>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-9 pr-4 py-2 rounded-xl text-sm border outline-none"
              style={{ borderColor: "var(--border)", color: "var(--text)", width: 220 }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: "var(--border)" }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); setSearch(""); }}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={activeTab === tab
                ? { background: "#fff", color: "var(--text)", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }
                : { color: "var(--muted)" }}
            >{tab}</button>
          ))}
        </div>

        {/* Schools tab */}
        {activeTab === "Schools" && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 card overflow-hidden">
              <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
                <h2 className="font-bold" style={{ color: "var(--text)" }}>Top Schools — {filteredSchools.length} results</h2>
                <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "rgba(47,107,255,0.08)", color: "var(--blue-600)" }}>2025 Season 1</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead style={{ background: "var(--surface)", color: "var(--muted)" }}>
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-semibold">Rank</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold">School</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold hidden md:table-cell">LGA</th>
                      <th className="text-center px-3 py-3 text-xs font-semibold hidden lg:table-cell">🥇</th>
                      <th className="text-center px-3 py-3 text-xs font-semibold hidden lg:table-cell">🥈</th>
                      <th className="text-center px-3 py-3 text-xs font-semibold hidden lg:table-cell">🥉</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold">Avg Score</th>
                      <th className="text-center px-3 py-3 text-xs font-semibold">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSchools.map((school) => (
                      <tr key={school.id} className="border-t hover:bg-gray-50/50 transition-colors" style={{ borderColor: "var(--border)" }}>
                        <td className="px-4 py-3"><RankBadge rank={school.rank} /></td>
                        <td className="px-4 py-3">
                          <Link href={`/schools/${school.id}`} className="flex items-center gap-2.5 hover:opacity-80">
                            <div className="relative w-8 h-8 rounded-lg overflow-hidden border flex-shrink-0" style={{ borderColor: "var(--border)" }}>
                              <Image src={school.crest} alt={school.name} fill className="object-contain p-0.5" />
                            </div>
                            <div>
                              <div className="font-medium text-sm leading-tight" style={{ color: "var(--text)" }}>{school.name}</div>
                              <div className="text-xs md:hidden" style={{ color: "var(--muted)" }}>{school.lga}</div>
                            </div>
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-xs hidden md:table-cell" style={{ color: "var(--muted)" }}>{school.lga}</td>
                        <td className="px-3 py-3 text-center text-xs font-semibold hidden lg:table-cell" style={{ color: "#b8860b" }}>{school.gold}</td>
                        <td className="px-3 py-3 text-center text-xs font-semibold hidden lg:table-cell" style={{ color: "#6b7280" }}>{school.silver}</td>
                        <td className="px-3 py-3 text-center text-xs font-semibold hidden lg:table-cell" style={{ color: "#92400e" }}>{school.bronze}</td>
                        <td className="px-4 py-3 text-right font-bold text-sm" style={{ color: "var(--navy-950)" }}>{school.avgScore}%</td>
                        <td className="px-3 py-3 text-center"><TrendIcon trend={school.trend} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-6">
              <div className="card p-5">
                <h3 className="font-bold text-sm mb-4" style={{ color: "var(--text)" }}>Top Students</h3>
                <div className="space-y-3">
                  {topStudents.slice(0, 5).map(s => (
                    <div key={s.id} className="flex items-center gap-3">
                      <RankBadge rank={s.rank} />
                      <div className="relative w-8 h-8 rounded-full overflow-hidden border flex-shrink-0" style={{ borderColor: "var(--border)" }}>
                        <Image src={s.portrait} alt={s.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>{s.name}</div>
                        <div className="text-xs truncate" style={{ color: "var(--muted)" }}>{s.school.split(",")[0]}</div>
                      </div>
                      <div className="text-sm font-bold" style={{ color: "var(--navy-950)" }}>{s.score}%</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-5">
                <h3 className="font-bold text-sm mb-4" style={{ color: "var(--text)" }}>Top LGAs</h3>
                <div className="space-y-3">
                  {allLGAs.slice(0, 5).map(lga => (
                    <div key={lga.lga} className="flex items-center gap-3">
                      <RankBadge rank={lga.rank} />
                      <div className="flex-1">
                        <div className="text-sm font-medium" style={{ color: "var(--text)" }}>{lga.lga}</div>
                        <div className="text-xs" style={{ color: "var(--muted)" }}>{lga.schools} schools · {lga.candidates} candidates</div>
                      </div>
                      <div className="text-sm font-bold" style={{ color: "var(--navy-950)" }}>{lga.avgScore}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Students tab */}
        {activeTab === "Students" && (
          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
              <h2 className="font-bold" style={{ color: "var(--text)" }}>Top Students — {filteredStudents.length} results</h2>
            </div>
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {filteredStudents.map(s => (
                <div key={s.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
                  <RankBadge rank={s.rank} />
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 flex-shrink-0" style={{ borderColor: "var(--border)" }}>
                    <Image src={s.portrait} alt={s.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold" style={{ color: "var(--text)" }}>{s.name}</div>
                    <div className="text-sm" style={{ color: "var(--muted)" }}>{s.school}</div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{s.lga} LGA</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold" style={{ color: "var(--navy-950)" }}>{s.score}%</div>
                    <MovementBadge m={s.movement} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LGAs tab */}
        {activeTab === "LGAs" && (
          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
              <h2 className="font-bold" style={{ color: "var(--text)" }}>All LGA Rankings — {filteredLGAs.length} LGAs</h2>
            </div>
            <table className="w-full text-sm">
              <thead style={{ background: "var(--surface)", color: "var(--muted)" }}>
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold">Rank</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold">LGA</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold hidden sm:table-cell">Schools</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold hidden md:table-cell">Candidates</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold">Avg Score</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold">Trend</th>
                </tr>
              </thead>
              <tbody>
                {filteredLGAs.map(lga => (
                  <tr key={lga.lga} className="border-t hover:bg-gray-50/50" style={{ borderColor: "var(--border)" }}>
                    <td className="px-6 py-4"><RankBadge rank={lga.rank} /></td>
                    <td className="px-6 py-4 font-medium" style={{ color: "var(--text)" }}>{lga.lga}</td>
                    <td className="px-4 py-4 text-center hidden sm:table-cell" style={{ color: "var(--muted)" }}>{lga.schools}</td>
                    <td className="px-4 py-4 text-center hidden md:table-cell" style={{ color: "var(--muted)" }}>{lga.candidates}</td>
                    <td className="px-6 py-4 text-right font-bold" style={{ color: "var(--navy-950)" }}>{lga.avgScore}%</td>
                    <td className="px-4 py-4 text-center"><TrendIcon trend={lga.trend} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Subjects tab */}
        {activeTab === "Subjects" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topSubjects.map((subject, i) => (
              <div key={subject.subject} className="card p-5 flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border" style={{ borderColor: "var(--border)" }}>
                  <Image src={subject.icon} alt={subject.subject} fill className="object-contain p-1.5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm" style={{ color: "var(--text)" }}>{subject.subject}</div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{subject.participants.toLocaleString()} participants</div>
                  <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                    <div className="h-full rounded-full" style={{ width: `${subject.avgScore}%`, background: ["var(--blue-600)", "var(--green-600)", "#7c3aed", "var(--gold-500)", "#f97316"][i] }} />
                  </div>
                </div>
                <div className="font-bold text-lg flex-shrink-0" style={{ color: "var(--navy-950)" }}>{subject.avgScore}%</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}

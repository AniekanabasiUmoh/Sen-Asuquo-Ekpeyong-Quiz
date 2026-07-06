"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import { schools, topStudents } from "@/lib/mockData";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
} from "recharts";
import { TrendingUp, TrendingDown, Minus, Users, Award, Trophy, MapPin } from "lucide-react";

const medals = ["/assets/medals/rank_gold_1.png", "/assets/medals/rank_silver_2.png", "/assets/medals/rank_bronze_3.png"];

const subjectPerf = [
  { subject: "Maths", score: 84 },
  { subject: "English", score: 79 },
  { subject: "Biology", score: 76 },
  { subject: "Physics", score: 72 },
  { subject: "Chemistry", score: 70 },
];

const seasonHistory = [
  { season: "S1 2024", rank: 4, avg: 74.1 },
  { season: "S2 2024", rank: 3, avg: 76.8 },
  { season: "S1 2025", rank: 1, avg: 82.4 },
];

export default function SchoolProfilePage({ params }: { params: { id: string } }) {
  const school = schools.find(s => s.id === Number(params.id));
  if (!school) notFound();

  const [tab, setTab] = useState("Overview");
  const schoolStudents = topStudents.filter(s => s.school.includes(school.name.split(",")[0])).length > 0
    ? topStudents.filter(s => s.school.includes(school.name.split(",")[0]))
    : topStudents.slice(0, 3);

  const TrendIcon = ({ trend }: { trend: string }) => {
    if (trend === "up") return <TrendingUp size={14} className="text-green-500" />;
    if (trend === "down") return <TrendingDown size={14} className="text-red-500" />;
    return <Minus size={14} style={{ color: "var(--muted)" }} />;
  };

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Hero card */}
        <div className="card overflow-hidden">
          <div className="h-24 relative" style={{ background: "linear-gradient(135deg, var(--navy-950) 0%, #1a3a7a 100%)" }}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 70% 50%, white 0%, transparent 60%)" }} />
          </div>
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end -mt-10 mb-5">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-lg flex-shrink-0" style={{ background: "white" }}>
                <Image src={school.crest} alt={school.name} fill className="object-contain p-1.5" />
              </div>
              <div className="flex-1 sm:mb-1">
                <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>{school.name}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-sm" style={{ color: "var(--muted)" }}>
                    <MapPin size={13} /> {school.lga}
                  </span>
                  <span className="flex items-center gap-1 text-sm" style={{ color: "var(--muted)" }}>
                    <Users size={13} /> {school.candidates} candidates
                  </span>
                  <span className="flex items-center gap-1 text-sm font-medium" style={{ color: school.trend === "up" ? "var(--green-600)" : school.trend === "down" ? "#ef4444" : "var(--muted)" }}>
                    <TrendIcon trend={school.trend} /> {school.trend === "up" ? "Rising" : school.trend === "down" ? "Falling" : "Stable"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-bold" style={{ background: "rgba(244,180,0,0.1)", color: "#b8860b" }}>
                <Trophy size={14} /> Rank #{school.rank} Statewide
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Avg Score", value: `${school.avgScore}%`, color: "var(--blue-600)" },
                { label: "Gold Medals", value: school.gold, color: "#b8860b" },
                { label: "Silver Medals", value: school.silver, color: "#6b7280" },
                { label: "Bronze Medals", value: school.bronze, color: "#92400e" },
              ].map(s => (
                <div key={s.label} className="p-4 rounded-xl text-center" style={{ background: "var(--surface)" }}>
                  <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: "var(--border)" }}>
          {["Overview", "Students", "Performance"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={tab === t ? { background: "#fff", color: "var(--text)", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" } : { color: "var(--muted)" }}
            >{t}</button>
          ))}
        </div>

        {tab === "Overview" && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Subject performance */}
            <div className="card p-5">
              <h3 className="font-bold text-sm mb-4" style={{ color: "var(--text)" }}>Subject Performance</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={subjectPerf} barSize={28}>
                  <XAxis dataKey="subject" tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[60, 90]} tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)", fontSize: 12 }} />
                  <Bar dataKey="score" fill="var(--blue-600)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Season history */}
            <div className="card p-5">
              <h3 className="font-bold text-sm mb-4" style={{ color: "var(--text)" }}>Season History</h3>
              <ResponsiveContainer width="100%" height={140}>
                <LineChart data={seasonHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="season" tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[70, 90]} tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)", fontSize: 12 }} />
                  <Line type="monotone" dataKey="avg" stroke="var(--blue-600)" strokeWidth={2.5} dot={{ fill: "var(--blue-600)", r: 4 }} name="Avg Score %" />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {seasonHistory.map(s => (
                  <div key={s.season} className="flex items-center justify-between text-sm">
                    <span style={{ color: "var(--muted)" }}>{s.season}</span>
                    <div className="flex items-center gap-3">
                      <span style={{ color: "var(--text)" }}>{s.avg}% avg</span>
                      <span className="font-bold" style={{ color: "var(--navy-950)" }}>Rank #{s.rank}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* About */}
            <div className="card p-5">
              <h3 className="font-bold text-sm mb-4" style={{ color: "var(--text)" }}>School Details</h3>
              <div className="space-y-3 text-sm">
                {[
                  { label: "Full Name", value: school.name },
                  { label: "LGA", value: school.lga },
                  { label: "Best Subject", value: school.bestSubject },
                  { label: "Total Candidates", value: school.candidates },
                  { label: "State Rank", value: `#${school.rank}` },
                ].map(item => (
                  <div key={item.label} className="flex justify-between gap-2">
                    <span style={{ color: "var(--muted)" }}>{item.label}</span>
                    <span className="font-medium" style={{ color: "var(--text)" }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Medal breakdown */}
            <div className="card p-5">
              <h3 className="font-bold text-sm mb-4" style={{ color: "var(--text)" }}>Medal Tally</h3>
              <div className="space-y-4">
                {[
                  { label: "Gold Medals", count: school.gold, medal: 0, color: "#b8860b" },
                  { label: "Silver Medals", count: school.silver, medal: 1, color: "#6b7280" },
                  { label: "Bronze Medals", count: school.bronze, medal: 2, color: "#92400e" },
                ].map(m => (
                  <div key={m.label} className="flex items-center gap-3">
                    <div className="relative w-8 h-8 flex-shrink-0">
                      <Image src={medals[m.medal]} alt={m.label} fill className="object-contain" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span style={{ color: "var(--muted)" }}>{m.label}</span>
                        <span className="font-bold" style={{ color: m.color }}>{m.count}</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                        <div className="h-full rounded-full" style={{ width: `${Math.min((m.count / 15) * 100, 100)}%`, background: m.color }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "Students" && (
          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
              <h3 className="font-bold" style={{ color: "var(--text)" }}>Top Students from {school.name.split(",")[0]}</h3>
            </div>
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {schoolStudents.map((s, i) => (
                <div key={s.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
                  {i < 3 ? (
                    <span className="relative inline-flex w-8 h-8 flex-shrink-0">
                      <Image src={medals[i]} alt={`rank ${i + 1}`} fill className="object-contain" />
                    </span>
                  ) : (
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ background: "var(--surface)", color: "var(--muted)" }}>{i + 1}</span>
                  )}
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 flex-shrink-0" style={{ borderColor: "var(--border)" }}>
                    <Image src={s.portrait} alt={s.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold" style={{ color: "var(--text)" }}>{s.name}</div>
                    <div className="text-sm" style={{ color: "var(--muted)" }}>{s.lga} LGA</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award size={14} style={{ color: "var(--gold-500)" }} />
                    <span className="text-lg font-bold" style={{ color: "var(--navy-950)" }}>{s.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "Performance" && (
          <div className="space-y-5">
            <div className="card p-5">
              <h3 className="font-bold text-sm mb-4" style={{ color: "var(--text)" }}>Subject Breakdown</h3>
              <div className="space-y-4">
                {subjectPerf.map((s, i) => (
                  <div key={s.subject}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium" style={{ color: "var(--text)" }}>{s.subject}</span>
                      <span className="font-bold" style={{ color: "var(--navy-950)" }}>{s.score}%</span>
                    </div>
                    <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                      <div className="h-full rounded-full transition-all" style={{
                        width: `${s.score}%`,
                        background: ["var(--blue-600)", "var(--green-600)", "#7c3aed", "var(--gold-500)", "#f97316"][i]
                      }} />
                    </div>
                    <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                      {s.score >= 80 ? "Excellent" : s.score >= 70 ? "Good" : "Needs improvement"} · vs. state avg {[76.4, 74.2, 72.8, 70.1, 68.9][i]}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: "State Rank", value: `#${school.rank}`, sub: "Out of 127 schools" },
                { label: "LGA Rank", value: "#1", sub: `In ${school.lga}` },
                { label: "Avg Score", value: `${school.avgScore}%`, sub: `State avg: 74.2%` },
              ].map(s => (
                <div key={s.label} className="card p-5 text-center">
                  <div className="text-3xl font-bold mb-1" style={{ color: "var(--navy-950)" }}>{s.value}</div>
                  <div className="text-sm font-medium" style={{ color: "var(--text)" }}>{s.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-start">
          <Link href="/schools" className="btn-secondary px-4 py-2 text-sm">← All Schools</Link>
        </div>
      </div>
    </PageShell>
  );
}

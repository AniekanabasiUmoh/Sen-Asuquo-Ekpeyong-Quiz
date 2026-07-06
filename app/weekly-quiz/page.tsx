"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { currentQuiz, upcomingQuizzes, completedQuizzes, topStudents, schools } from "@/lib/mockData";
import { Clock, Users, BookOpen, Trophy, Award } from "lucide-react";

const medals = ["/assets/medals/rank_gold_1.png", "/assets/medals/rank_silver_2.png", "/assets/medals/rank_bronze_3.png"];
const weeklyLeaderboard = schools.slice(0, 6).map((s, i) => ({ ...s, weekScore: [1842, 1756, 1643, 1521, 1488, 1402][i] }));

export default function WeeklyQuizPage() {
  const [activeTab, setActiveTab] = useState("Active");
  const [lbTab, setLbTab] = useState("Schools");

  return (
    <PageShell>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Weekly Quiz</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>Compete weekly and climb the leaderboard — winners rewarded every week</p>
        </div>

        {/* Current quiz hero */}
        <div className="rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--navy-950) 0%, #0d2a6e 100%)" }}>
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-5" style={{ background: "white", transform: "translate(30%, -30%)" }} />
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="text-xs font-bold tracking-widest text-white/60 mb-2">{currentQuiz.week} — CURRENTLY ACTIVE</div>
              <h2 className="text-2xl font-bold mb-1">{currentQuiz.title}</h2>
              <p className="text-white/70 text-sm">{currentQuiz.subject} • {currentQuiz.totalQuestions} Questions • {currentQuiz.participants.toLocaleString()} participants</p>
            </div>
            <div className="flex gap-3">
              {[
                { label: "DAYS", value: currentQuiz.endsIn.days },
                { label: "HOURS", value: currentQuiz.endsIn.hours },
                { label: "MINUTES", value: currentQuiz.endsIn.minutes },
              ].map(t => (
                <div key={t.label} className="text-center px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.1)" }}>
                  <div className="text-2xl font-bold">{String(t.value).padStart(2, "0")}</div>
                  <div className="text-xs text-white/60 tracking-widest mt-0.5">{t.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 relative z-10">
            <Link href="/exam-portal/1/take" className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90" style={{ background: "var(--gold-500)", color: "var(--navy-950)" }}>
              Start Quiz Now →
            </Link>
            <button className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-white/20 text-white hover:bg-white/10 transition-colors">
              View Instructions
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Participants", value: currentQuiz.participants.toLocaleString(), icon: <Users size={18} />, color: "var(--blue-600)" },
            { label: "Questions", value: currentQuiz.totalQuestions, icon: <BookOpen size={18} />, color: "var(--green-600)" },
            { label: "Avg Score", value: `${currentQuiz.avgScore}%`, icon: <Trophy size={18} />, color: "var(--gold-500)" },
            { label: "Time Left", value: `${currentQuiz.endsIn.days}d ${currentQuiz.endsIn.hours}h`, icon: <Clock size={18} />, color: "#f97316" },
          ].map(s => (
            <div key={s.label} className="card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}18`, color: s.color }}>
                {s.icon}
              </div>
              <div>
                <div className="text-xs" style={{ color: "var(--muted)" }}>{s.label}</div>
                <div className="text-lg font-bold" style={{ color: "var(--navy-950)" }}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quiz tabs */}
          <div className="lg:col-span-2 card p-6">
            <div className="flex items-center gap-2 mb-5">
              {["Active", "Upcoming", "Completed"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
                  style={activeTab === tab ? { background: "var(--navy-950)", color: "#fff" } : { color: "var(--muted)", background: "var(--surface)" }}
                >{tab}</button>
              ))}
            </div>

            {activeTab === "Active" && (
              <div className="card p-5 border-l-4" style={{ borderLeftColor: "var(--green-600)" }}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-bold text-base" style={{ color: "var(--text)" }}>{currentQuiz.title}</div>
                    <div className="text-sm mt-1" style={{ color: "var(--muted)" }}>{currentQuiz.subject} • {currentQuiz.totalQuestions} Questions</div>
                    <div className="flex items-center gap-1.5 mt-3 text-xs" style={{ color: "var(--muted)" }}>
                      <Clock size={12} /> Ends in {currentQuiz.endsIn.days}d {currentQuiz.endsIn.hours}h {currentQuiz.endsIn.minutes}m
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0" style={{ background: "rgba(46,175,93,0.1)", color: "var(--green-600)" }}>Live</span>
                </div>
                <Link href="/exam-portal/1/take" className="btn-primary w-full mt-4 py-2.5 text-sm text-center block">
                  Take Quiz Now →
                </Link>
              </div>
            )}

            {activeTab === "Upcoming" && (
              <div className="space-y-3">
                {upcomingQuizzes.map(q => (
                  <div key={q.id} className="p-4 rounded-xl border hover:border-blue-300 transition-colors" style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-sm" style={{ color: "var(--text)" }}>{q.title}</div>
                        <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>{q.date} • {q.time} • {q.duration}</div>
                        <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>{q.participants.toLocaleString()} expected participants</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0" style={{ background: "rgba(47,107,255,0.08)", color: "var(--blue-600)" }}>Soon</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "Completed" && (
              <div className="space-y-3">
                {completedQuizzes.map(q => (
                  <div key={q.id} className="p-4 rounded-xl border" style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-sm" style={{ color: "var(--text)" }}>{q.title}</div>
                        <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>{q.date} • {q.participants.toLocaleString()} participants</div>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs font-semibold" style={{ color: "var(--green-600)" }}>Your score: {q.score}%</span>
                          <span className="text-xs" style={{ color: "var(--muted)" }}>Rank #{q.rank}</span>
                        </div>
                      </div>
                      <div className="text-center flex-shrink-0">
                        <div className="text-2xl font-bold" style={{ color: "var(--navy-950)" }}>{q.score}%</div>
                        <div className="text-xs" style={{ color: "var(--muted)" }}>#{q.rank}</div>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden mt-3" style={{ background: "var(--border)" }}>
                      <div className="h-full rounded-full" style={{ width: `${q.score}%`, background: "var(--green-600)" }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Weekly leaderboard */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              {["Schools", "Students"].map(t => (
                <button key={t} onClick={() => setLbTab(t)}
                  className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                  style={lbTab === t ? { background: "var(--navy-950)", color: "#fff" } : { color: "var(--muted)", background: "var(--surface)" }}
                >{t}</button>
              ))}
            </div>

            {lbTab === "Schools" && (
              <div className="space-y-3">
                {weeklyLeaderboard.map((school, i) => (
                  <div key={school.id} className="flex items-center gap-3">
                    {i < 3 ? (
                      <span className="relative inline-flex w-7 h-7 flex-shrink-0">
                        <Image src={medals[i]} alt={`rank ${i + 1}`} fill className="object-contain" />
                      </span>
                    ) : (
                      <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "var(--surface)", color: "var(--muted)" }}>{i + 1}</span>
                    )}
                    <div className="relative w-7 h-7 rounded-lg overflow-hidden border flex-shrink-0" style={{ borderColor: "var(--border)" }}>
                      <Image src={school.crest} alt={school.name} fill className="object-contain p-0.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate" style={{ color: "var(--text)" }}>{school.name.split(",")[0]}</div>
                    </div>
                    <div className="text-xs font-bold flex-shrink-0" style={{ color: "var(--navy-950)" }}>{school.weekScore.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}

            {lbTab === "Students" && (
              <div className="space-y-3">
                {topStudents.slice(0, 6).map((s, i) => (
                  <div key={s.id} className="flex items-center gap-3">
                    {i < 3 ? (
                      <span className="relative inline-flex w-7 h-7 flex-shrink-0">
                        <Image src={medals[i]} alt={`rank ${i + 1}`} fill className="object-contain" />
                      </span>
                    ) : (
                      <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "var(--surface)", color: "var(--muted)" }}>{i + 1}</span>
                    )}
                    <div className="relative w-7 h-7 rounded-full overflow-hidden border flex-shrink-0" style={{ borderColor: "var(--border)" }}>
                      <Image src={s.portrait} alt={s.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate" style={{ color: "var(--text)" }}>{s.name}</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold" style={{ color: "var(--navy-950)" }}>
                      <Award size={10} style={{ color: "var(--gold-500)" }} /> {s.score}%
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 pt-4 border-t text-center" style={{ borderColor: "var(--border)" }}>
              <div className="text-xs font-medium mb-1" style={{ color: "var(--muted)" }}>Leaderboard resets Sunday</div>
              <div className="text-xs font-bold" style={{ color: "var(--blue-600)" }}>Winners rewarded every week</div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

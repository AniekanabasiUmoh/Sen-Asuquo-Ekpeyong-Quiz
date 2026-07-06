"use client";

import { useState } from "react";
import Image from "next/image";
import PageShell from "@/components/PageShell";
import { candidateResult, topStudents, achievements, completedQuizzes, exams } from "@/lib/mockData";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Award, BookOpen, ClipboardList, User } from "lucide-react";

const pieColors = ["#2f6bff", "#2eaf5d", "#f4b400", "#7c3aed", "#f97316"];
const profileTabs = ["Candidate", "School", "Coordinator"];
const contentTabs = ["Overview", "Performance", "Quizzes", "Exams", "Achievements"];

const schoolProfile = {
  name: "Government Secondary School, Calabar",
  lga: "Calabar Municipal",
  rank: 1,
  avgScore: 82.4,
  candidates: 245,
  crest: "/assets/school-crests/government_secondary_school_calabar.png",
};

const teacherProfile = {
  name: "Mrs. Ngozi Bassey",
  subject: "Mathematics",
  school: "Government Secondary School, Calabar",
  students: 48,
  avgStudentScore: 79.2,
  portrait: "/assets/portraits/participant_1.png",
};

export default function ProfilePage() {
  const [profileType, setProfileType] = useState("Candidate");
  const [contentTab, setContentTab] = useState("Overview");
  const c = candidateResult;

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Profile type tabs */}
        <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: "var(--border)" }}>
          {profileTabs.map(tab => (
            <button key={tab} onClick={() => { setProfileType(tab); setContentTab("Overview"); }}
              className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={profileType === tab ? { background: "#fff", color: "var(--text)", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" } : { color: "var(--muted)" }}
            >{tab}</button>
          ))}
        </div>

        {/* ── CANDIDATE PROFILE ── */}
        {profileType === "Candidate" && (
          <>
            <div className="card p-6">
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <div className="relative flex-shrink-0">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2" style={{ borderColor: "var(--border)" }}>
                    <Image src={c.portrait} alt={c.name} fill className="object-cover" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white" style={{ background: "var(--green-600)" }} />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>{c.name}</h2>
                      <div className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>{c.school}</div>
                      <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>ID: {c.candidateId} · {c.lga}</div>
                    </div>
                    <button className="btn-primary px-4 py-1.5 text-sm">Edit Profile</button>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-4">
                    {[
                      { icon: <Award size={14} />, label: `Rank #${c.rank}`, color: "var(--gold-500)" },
                      { icon: <BookOpen size={14} />, label: "5 Subjects", color: "var(--blue-600)" },
                      { icon: <ClipboardList size={14} />, label: "3 Exams Taken", color: "var(--green-600)" },
                      { icon: <User size={14} />, label: c.season, color: "var(--muted)" },
                    ].map(item => (
                      <div key={item.label} className="flex items-center gap-1.5 text-xs font-medium" style={{ color: item.color }}>
                        {item.icon} {item.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-1 p-1 rounded-xl w-fit overflow-x-auto" style={{ background: "var(--border)" }}>
              {contentTabs.map(tab => (
                <button key={tab} onClick={() => setContentTab(tab)}
                  className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap"
                  style={contentTab === tab ? { background: "#fff", color: "var(--text)", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" } : { color: "var(--muted)" }}
                >{tab}</button>
              ))}
            </div>

            {contentTab === "Overview" && (
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="card p-5">
                  <h3 className="font-bold text-sm mb-4" style={{ color: "var(--text)" }}>About</h3>
                  <div className="space-y-3 text-sm">
                    {[
                      { label: "School", value: c.school },
                      { label: "LGA", value: c.lga },
                      { label: "Season", value: c.season },
                      { label: "Candidate ID", value: c.candidateId },
                      { label: "Overall Grade", value: c.grade },
                      { label: "Rank", value: `#${c.rank} Statewide` },
                    ].map(item => (
                      <div key={item.label} className="flex justify-between gap-2">
                        <span style={{ color: "var(--muted)" }}>{item.label}</span>
                        <span className="font-medium text-right" style={{ color: "var(--text)" }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card p-5">
                  <h3 className="font-bold text-sm mb-4" style={{ color: "var(--text)" }}>Subject Strengths</h3>
                  <div className="flex justify-center">
                    <PieChart width={150} height={150}>
                      <Pie data={c.subjects.map(s => ({ name: s.name, value: s.score }))} cx={75} cy={75} innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                        {c.subjects.map((_, i) => <Cell key={i} fill={pieColors[i]} />)}
                      </Pie>
                    </PieChart>
                  </div>
                  <div className="space-y-1.5 mt-2">
                    {c.subjects.map((s, i) => (
                      <div key={s.name} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: pieColors[i] }} />
                        <span className="text-xs flex-1" style={{ color: "var(--muted)" }}>{s.name}</span>
                        <span className="text-xs font-bold" style={{ color: "var(--text)" }}>{s.score}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card p-5">
                  <h3 className="font-bold text-sm mb-4" style={{ color: "var(--text)" }}>Season Summary</h3>
                  <div className="space-y-4">
                    {[
                      { label: "Total Score", value: `${c.totalScore}/${c.maxScore}`, pct: c.percentage },
                      { label: "Mathematics", value: `${c.subjects[0].score}/100`, pct: c.subjects[0].score },
                      { label: "English", value: `${c.subjects[1].score}/100`, pct: c.subjects[1].score },
                      { label: "Biology", value: `${c.subjects[2].score}/100`, pct: c.subjects[2].score },
                    ].map(item => (
                      <div key={item.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span style={{ color: "var(--muted)" }}>{item.label}</span>
                          <span className="font-semibold" style={{ color: "var(--text)" }}>{item.value}</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                          <div className="h-full rounded-full" style={{ width: `${item.pct}%`, background: "var(--blue-600)" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {contentTab === "Performance" && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {c.subjects.map((sub, i) => (
                  <div key={sub.name} className="card p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden border flex-shrink-0" style={{ borderColor: "var(--border)" }}>
                        <Image src={["/assets/icons/math.png", "/assets/icons/english.png", "/assets/icons/biology.png", "/assets/icons/physics.png", "/assets/icons/chemistry.png"][i]} alt={sub.name} fill className="object-contain p-1" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm" style={{ color: "var(--text)" }}>{sub.name}</div>
                        <div className="text-xs" style={{ color: "var(--muted)" }}>Grade {sub.grade}</div>
                      </div>
                    </div>
                    <div className="text-3xl font-bold mb-1" style={{ color: "var(--navy-950)" }}>{sub.score}<span className="text-base font-normal text-gray-400">/100</span></div>
                    <div className="h-2 rounded-full overflow-hidden mt-2" style={{ background: "var(--border)" }}>
                      <div className="h-full rounded-full" style={{ width: `${sub.score}%`, background: pieColors[i] }} />
                    </div>
                    <div className="text-xs mt-2" style={{ color: "var(--muted)" }}>Top {100 - sub.percentile + 1}% statewide</div>
                  </div>
                ))}
              </div>
            )}

            {contentTab === "Quizzes" && (
              <div className="space-y-3">
                {completedQuizzes.map(q => (
                  <div key={q.id} className="card p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-semibold text-sm" style={{ color: "var(--text)" }}>{q.title}</div>
                        <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>{q.date} · {q.participants.toLocaleString()} participants</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-2xl font-bold" style={{ color: q.score >= 90 ? "var(--green-600)" : "var(--blue-600)" }}>{q.score}%</div>
                        <div className="text-xs" style={{ color: "var(--muted)" }}>Rank #{q.rank}</div>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden mt-3" style={{ background: "var(--border)" }}>
                      <div className="h-full rounded-full" style={{ width: `${q.score}%`, background: "var(--blue-600)" }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {contentTab === "Exams" && (
              <div className="space-y-3">
                {exams.filter(e => e.status === "completed").map(exam => (
                  <div key={exam.id} className="card p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-semibold text-sm" style={{ color: "var(--text)" }}>{exam.title}</div>
                        <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>{exam.date} · {exam.duration} · {exam.participants.toLocaleString()} candidates</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-2xl font-bold" style={{ color: "var(--green-600)" }}>{exam.score}%</div>
                        <div className="text-xs px-2 py-0.5 rounded-full mt-1 font-semibold" style={{ background: "rgba(46,175,93,0.1)", color: "var(--green-600)" }}>AI Marked</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {contentTab === "Achievements" && (
              <div className="grid sm:grid-cols-2 gap-4">
                {achievements.map(a => (
                  <div key={a.id} className="card p-5 flex items-center gap-4" style={!a.earned ? { opacity: 0.5 } : {}}>
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image src={a.icon} alt={a.title} fill className="object-contain" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm mb-0.5" style={{ color: "var(--text)" }}>{a.title}</div>
                      <div className="text-xs mb-1" style={{ color: "var(--muted)" }}>{a.description}</div>
                      {a.earned
                        ? <div className="text-xs font-semibold" style={{ color: "var(--green-600)" }}>✓ Earned {a.date}</div>
                        : <div className="text-xs" style={{ color: "var(--muted)" }}>Not yet earned</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Peers */}
            <div className="card p-5">
              <h3 className="font-bold text-sm mb-4" style={{ color: "var(--text)" }}>Recent Peers</h3>
              <div className="flex flex-wrap gap-3">
                {topStudents.map(s => (
                  <div key={s.id} className="flex items-center gap-2 px-3 py-2 rounded-xl border hover:border-blue-300 transition-colors cursor-pointer" style={{ borderColor: "var(--border)" }}>
                    <div className="relative w-7 h-7 rounded-full overflow-hidden border" style={{ borderColor: "var(--border)" }}>
                      <Image src={s.portrait} alt={s.name} fill className="object-cover" />
                    </div>
                    <span className="text-xs font-medium" style={{ color: "var(--text)" }}>{s.name.split(" ")[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── SCHOOL PROFILE ── */}
        {profileType === "School" && (
          <div className="space-y-5">
            <div className="card p-6 flex flex-col sm:flex-row gap-5 items-start">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0" style={{ borderColor: "var(--border)" }}>
                <Image src={schoolProfile.crest} alt={schoolProfile.name} fill className="object-contain p-1.5" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>{schoolProfile.name}</h2>
                <div className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>{schoolProfile.lga} LGA</div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {[
                    { label: "State Rank", value: `#${schoolProfile.rank}` },
                    { label: "Avg Score", value: `${schoolProfile.avgScore}%` },
                    { label: "Candidates", value: schoolProfile.candidates },
                  ].map(s => (
                    <div key={s.label} className="p-3 rounded-xl text-center" style={{ background: "var(--surface)" }}>
                      <div className="text-xl font-bold" style={{ color: "var(--navy-950)" }}>{s.value}</div>
                      <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card p-5">
              <h3 className="font-bold text-sm mb-4" style={{ color: "var(--text)" }}>Top Students</h3>
              <div className="space-y-3">
                {topStudents.slice(0, 5).map((s, i) => (
                  <div key={s.id} className="flex items-center gap-3">
                    <span className="text-xs font-bold w-5 text-right flex-shrink-0" style={{ color: "var(--muted)" }}>#{i + 1}</span>
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border flex-shrink-0" style={{ borderColor: "var(--border)" }}>
                      <Image src={s.portrait} alt={s.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>{s.name}</div>
                    </div>
                    <div className="text-sm font-bold" style={{ color: "var(--navy-950)" }}>{s.score}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── COORDINATOR PROFILE ── */}
        {profileType === "Coordinator" && (
          <div className="space-y-5">
            <div className="card p-6 flex flex-col sm:flex-row gap-5 items-start">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0" style={{ borderColor: "var(--border)" }}>
                <Image src={teacherProfile.portrait} alt={teacherProfile.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>{teacherProfile.name}</h2>
                <div className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>{teacherProfile.subject} Coordinator · {teacherProfile.school}</div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {[
                    { label: "Students", value: teacherProfile.students },
                    { label: "Class Avg", value: `${teacherProfile.avgStudentScore}%` },
                    { label: "State Avg", value: "74.2%" },
                  ].map(s => (
                    <div key={s.label} className="p-3 rounded-xl text-center" style={{ background: "var(--surface)" }}>
                      <div className="text-xl font-bold" style={{ color: "var(--navy-950)" }}>{s.value}</div>
                      <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card p-5">
              <h3 className="font-bold text-sm mb-4" style={{ color: "var(--text)" }}>Top Students Under {teacherProfile.name.split(" ")[1]}</h3>
              <div className="space-y-3">
                {topStudents.slice(0, 5).map((s, i) => (
                  <div key={s.id} className="flex items-center gap-3">
                    <span className="text-xs font-bold w-5 text-right" style={{ color: "var(--muted)" }}>#{i + 1}</span>
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border" style={{ borderColor: "var(--border)" }}>
                      <Image src={s.portrait} alt={s.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>{s.name}</div>
                      <div className="text-xs" style={{ color: "var(--muted)" }}>{s.school.split(",")[0]}</div>
                    </div>
                    <div className="text-sm font-bold" style={{ color: "var(--navy-950)" }}>{s.score}%</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-5">
              <h3 className="font-bold text-sm mb-3" style={{ color: "var(--text)" }}>Class Performance vs. State Average</h3>
              <div className="space-y-3">
                {[
                  { label: "Class Average", value: teacherProfile.avgStudentScore, color: "var(--blue-600)" },
                  { label: "State Average", value: 74.2, color: "var(--muted)" },
                ].map(b => (
                  <div key={b.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: "var(--muted)" }}>{b.label}</span>
                      <span className="font-bold" style={{ color: b.color }}>{b.value}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                      <div className="h-full rounded-full" style={{ width: `${b.value}%`, background: b.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </PageShell>
  );
}

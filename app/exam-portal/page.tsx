"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { exams } from "@/lib/mockData";
import { Clock, Users, CheckCircle, AlertCircle, CalendarClock, ChevronRight, X, Camera, Wifi, UserCheck, Loader2 } from "lucide-react";

type ExamStatus = "available" | "upcoming" | "completed";

const statusStyle: Record<ExamStatus, { bg: string; color: string; label: string }> = {
  available: { bg: "rgba(46,175,93,0.1)", color: "#2eaf5d", label: "Available" },
  upcoming: { bg: "rgba(47,107,255,0.08)", color: "#2f6bff", label: "Upcoming" },
  completed: { bg: "rgba(107,120,144,0.1)", color: "#6b7890", label: "Completed" },
};

function DiagnosticModal({ exam, onClose }: { exam: typeof exams[0]; onClose: () => void }) {
  const [webcamChecked, setWebcamChecked] = useState<"checking" | "success">("checking");
  const [networkChecked, setNetworkChecked] = useState<"pending" | "checking" | "success">("pending");
  const [tokenChecked, setTokenChecked] = useState<"pending" | "checking" | "success">("pending");

  useEffect(() => {
    // Stage 1: Webcam check
    const t1 = setTimeout(() => {
      setWebcamChecked("success");
      setNetworkChecked("checking");
    }, 600);

    // Stage 2: Network latency check
    const t2 = setTimeout(() => {
      setNetworkChecked("success");
      setTokenChecked("checking");
    }, 1300);

    // Stage 3: Token validation
    const t3 = setTimeout(() => {
      setTokenChecked("success");
    }, 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const allReady = webcamChecked === "success" && networkChecked === "success" && tokenChecked === "success";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md card p-6 animate-scaleIn bg-white" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-slate-800">CBT Diagnostic Checks</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"><X size={16} className="text-slate-500" /></button>
        </div>

        <div className="p-4 rounded-xl mb-4 bg-slate-50 border border-slate-100">
          <div className="font-bold text-sm text-slate-800">{exam.title}</div>
          <div className="text-xs text-slate-500 mt-0.5">{exam.subject} · {exam.duration} · {exam.questions} questions</div>
        </div>

        {/* Diagnostics checks checklist */}
        <div className="space-y-3 mb-5 border-y py-4 my-4 border-slate-100">
          {/* Webcam check */}
          <div className="flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 text-slate-600"><Camera size={14} /></div>
              <span className="text-slate-700">Web Camera Access Check</span>
            </div>
            <div>
              {webcamChecked === "checking" ? (
                <span className="flex items-center gap-1 text-blue-600"><Loader2 size={13} className="animate-spin" /> Verifying...</span>
              ) : (
                <span className="text-green-600 font-bold">✅ System Ready</span>
              )}
            </div>
          </div>

          {/* Network check */}
          <div className="flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 text-slate-600"><Wifi size={14} /></div>
              <span className="text-slate-700">Network Latency (CBT Sync)</span>
            </div>
            <div>
              {networkChecked === "pending" && <span className="text-slate-400">Waiting...</span>}
              {networkChecked === "checking" && (
                <span className="flex items-center gap-1 text-blue-600"><Loader2 size={13} className="animate-spin" /> Testing ping...</span>
              )}
              {networkChecked === "success" && <span className="text-green-600 font-bold">✅ Excellent (24ms)</span>}
            </div>
          </div>

          {/* Token check */}
          <div className="flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 text-slate-600"><UserCheck size={14} /></div>
              <span className="text-slate-700">Candidate Token Verification</span>
            </div>
            <div>
              {tokenChecked === "pending" && <span className="text-slate-400">Waiting...</span>}
              {tokenChecked === "checking" && (
                <span className="flex items-center gap-1 text-blue-600"><Loader2 size={13} className="animate-spin" /> Matching ID...</span>
              )}
              {tokenChecked === "success" && <span className="text-green-600 font-bold">✅ ID Verified</span>}
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl mb-5 text-xs bg-amber-50/50 border border-amber-200 text-amber-800 leading-relaxed">
          ⚠ Once started, full-screen lock mode is enforced and the countdown timer cannot be paused.
        </div>

        <div className="flex gap-3">
          <Link 
            href={allReady ? `/exam-portal/${exam.id}/take` : "#"} 
            onClick={(e) => { if(!allReady) e.preventDefault(); }}
            className={`flex-1 py-3 text-xs font-bold text-center rounded-xl transition-all duration-200 ${
              allReady 
                ? "bg-slate-900 text-white hover:opacity-90 cursor-pointer shadow-md" 
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            {allReady ? "Begin Examination →" : "Performing Checks..."}
          </Link>
          <button onClick={onClose} className="flex-1 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ExamPortalPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedExam, setSelectedExam] = useState<number | null>(null);
  const [confirmExam, setConfirmExam] = useState<typeof exams[0] | null>(null);

  const filtered = activeTab === "All" ? exams : exams.filter(e => e.status === activeTab.toLowerCase());

  return (
    <PageShell>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Exam Portal</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>Access, review and take your scheduled examinations</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Available", value: exams.filter(e => e.status === "available").length, icon: <CheckCircle size={18} />, color: "#2eaf5d" },
            { label: "Upcoming", value: exams.filter(e => e.status === "upcoming").length, icon: <CalendarClock size={18} />, color: "#2f6bff" },
            { label: "Completed", value: exams.filter(e => e.status === "completed").length, icon: <AlertCircle size={18} />, color: "#6b7890" },
            { label: "Avg Score", value: "90%", icon: <CheckCircle size={18} />, color: "#f4b400" },
          ].map(s => (
            <div key={s.label} className="card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}18`, color: s.color }}>
                {s.icon}
              </div>
              <div>
                <div className="text-xs" style={{ color: "var(--muted)" }}>{s.label}</div>
                <div className="text-2xl font-bold" style={{ color: "var(--navy-950)" }}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Exam list */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: "var(--border)" }}>
              {["All", "Available", "Upcoming", "Completed"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                  style={activeTab === tab ? { background: "#fff", color: "var(--text)", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" } : { color: "var(--muted)" }}
                >{tab}</button>
              ))}
            </div>

            {filtered.map(exam => {
              const style = statusStyle[exam.status as ExamStatus];
              const isSelected = selectedExam === exam.id;
              return (
                <div key={exam.id}
                  className="card p-5 cursor-pointer transition-all"
                  style={isSelected ? { borderColor: "var(--blue-600)", borderWidth: 2 } : {}}
                  onClick={() => setSelectedExam(isSelected ? null : exam.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold" style={{ color: "var(--text)" }}>{exam.title}</h3>
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: style.bg, color: style.color }}>{style.label}</span>
                      </div>
                      <div className="text-xs" style={{ color: "var(--muted)" }}>{exam.subject}</div>
                      <div className="flex flex-wrap gap-4 mt-3 text-xs" style={{ color: "var(--muted)" }}>
                        <span className="flex items-center gap-1"><CalendarClock size={12} /> {exam.date}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {exam.duration}</span>
                        <span className="flex items-center gap-1"><Users size={12} /> {exam.participants.toLocaleString()} participants</span>
                        {exam.status === "completed" && exam.score && (
                          <span className="flex items-center gap-1 font-semibold" style={{ color: "var(--green-600)" }}>
                            <CheckCircle size={12} /> Score: {exam.score}%
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight size={16} style={{ color: "var(--muted)", transform: isSelected ? "rotate(90deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
                  </div>

                  {isSelected && exam.status === "available" && (
                    <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                      <h4 className="font-semibold text-sm mb-3" style={{ color: "var(--text)" }}>Exam Instructions</h4>
                      <ul className="space-y-1.5 text-xs mb-4" style={{ color: "var(--muted)" }}>
                        {(exam.instructions ?? []).map((inst, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold" style={{ background: "var(--surface)", color: "var(--text)" }}>{i + 1}</span>
                            {inst}
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={e => { e.stopPropagation(); setConfirmExam(exam); }}
                        className="btn-primary w-full py-2.5 text-sm"
                      >
                        Start Exam →
                      </button>
                    </div>
                  )}

                  {isSelected && exam.status === "completed" && (
                    <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                      <div className="flex items-center gap-3">
                        <div className="text-3xl font-bold" style={{ color: "var(--green-600)" }}>{exam.score}%</div>
                        <div>
                          <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>Exam Completed</div>
                          <div className="text-xs" style={{ color: "var(--muted)" }}>Grade {exam.score && exam.score >= 80 ? "A" : exam.score && exam.score >= 65 ? "B" : "C"} · AI Marked</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Side cards */}
          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="font-bold text-sm mb-4" style={{ color: "var(--text)" }}>Recent Performance</h3>
              <div className="space-y-3">
                {exams.filter(e => e.status === "completed").map(exam => (
                  <div key={exam.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--surface)" }}>
                      <div className="relative w-6 h-6">
                        <Image src={exam.score && exam.score >= 90 ? "/assets/medals/rank_gold_1.png" : "/assets/medals/rank_bronze_3.png"} alt="result" fill className="object-contain" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate" style={{ color: "var(--text)" }}>{exam.title}</div>
                      <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{exam.date}</div>
                    </div>
                    <div className="font-bold text-sm flex-shrink-0" style={{ color: exam.score && exam.score >= 80 ? "var(--green-600)" : "#f97316" }}>
                      {exam.score}%
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--muted)" }}>Average</span>
                  <span className="font-bold" style={{ color: "var(--navy-950)" }}>90%</span>
                </div>
              </div>
            </div>

            <div className="card p-5" style={{ background: "var(--navy-950)" }}>
              <div className="text-white/60 text-xs mb-1">Need help?</div>
              <h3 className="font-bold text-white mb-2">Contact Support</h3>
              <p className="text-white/60 text-xs mb-4">Reach out to your school coordinator or the portal support team for exam-related queries.</p>
              <button className="w-full py-2 rounded-xl text-sm font-semibold" style={{ background: "rgba(255,255,255,0.12)", color: "#fff" }}>
                Get Support
              </button>
            </div>

            <div className="card p-5">
              <h3 className="font-bold text-sm mb-3" style={{ color: "var(--text)" }}>Important Notes</h3>
              <ul className="space-y-2 text-xs" style={{ color: "var(--muted)" }}>
                <li className="flex items-start gap-2"><AlertCircle size={12} className="flex-shrink-0 mt-0.5" style={{ color: "#f97316" }} />Exams must be taken within the specified window.</li>
                <li className="flex items-start gap-2"><AlertCircle size={12} className="flex-shrink-0 mt-0.5" style={{ color: "#f97316" }} />Technical issues should be reported immediately.</li>
                <li className="flex items-start gap-2"><AlertCircle size={12} className="flex-shrink-0 mt-0.5" style={{ color: "#f97316" }} />Malpractice leads to immediate disqualification.</li>
                <li className="flex items-start gap-2"><AlertCircle size={12} className="flex-shrink-0 mt-0.5" style={{ color: "#f97316" }} />Scripts are AI-marked for fairness and speed.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation & Diagnostics Modal */}
      {confirmExam && (
        <DiagnosticModal exam={confirmExam} onClose={() => setConfirmExam(null)} />
      )}
    </PageShell>
  );
}

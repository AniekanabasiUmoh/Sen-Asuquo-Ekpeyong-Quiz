"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { quizQuestions, exams } from "@/lib/mockData";
import { Clock, ChevronLeft, ChevronRight, Flag, CheckCircle, AlertCircle, X } from "lucide-react";

type Phase = "instructions" | "exam" | "submitting" | "results";

export default function TakeExamPage({ params }: { params: { id: string } }) {
  const exam = exams.find(e => e.id === Number(params.id)) ?? exams[0];
  const questions = quizQuestions;
  const totalTime = 15 * 60; // 15 minutes demo timer

  const [phase, setPhase] = useState<Phase>("instructions");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [aiProgress, setAiProgress] = useState(0);
  const [score, setScore] = useState(0);

  const handleSubmit = useCallback(() => {
    setPhase("submitting");
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct) correct++;
    });
    setScore(Math.round((correct / questions.length) * 100));

    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 8 + 3;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => setPhase("results"), 600);
      }
      setAiProgress(Math.min(Math.round(p), 100));
    }, 180);
  }, [answers, questions]);

  useEffect(() => {
    if (phase !== "exam") return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    const t = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft, handleSubmit]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const answered = Object.keys(answers).length;
  const pct = Math.round((answered / questions.length) * 100);
  const timePct = (timeLeft / totalTime) * 100;
  const timeColor = timePct > 50 ? "var(--green-600)" : timePct > 20 ? "var(--gold-500)" : "#ef4444";

  // ── Instructions screen ──────────────────────────────────────────
  if (phase === "instructions") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "var(--surface)" }}>
        <div className="w-full max-w-xl">
          <div className="card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(47,107,255,0.1)" }}>
                <ClipboardIcon />
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>{exam.title}</h1>
                <div className="text-sm" style={{ color: "var(--muted)" }}>{exam.subject} · {exam.duration} · {questions.length} Questions</div>
              </div>
            </div>

            <div className="p-4 rounded-xl mb-6" style={{ background: "rgba(244,180,0,0.08)", border: "1px solid rgba(244,180,0,0.2)" }}>
              <div className="flex items-center gap-2 mb-2 text-sm font-semibold" style={{ color: "#b8860b" }}>
                <AlertCircle size={14} /> Important — Read Before Starting
              </div>
              <ul className="space-y-2">
                {(exam.instructions && exam.instructions.length > 0 ? exam.instructions : [
                  "Once started, the exam timer cannot be paused.",
                  "All answers are automatically saved as you proceed.",
                  "You may flag questions to review before submission.",
                  "Submit before the timer expires.",
                  "Ensure you have a stable internet connection.",
                ]).map((inst, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--text)" }}>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5" style={{ background: "rgba(244,180,0,0.2)", color: "#b8860b" }}>{i + 1}</span>
                    {inst}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: "Questions", value: questions.length },
                { label: "Duration", value: exam.duration },
                { label: "Subject", value: exam.subject },
              ].map(s => (
                <div key={s.label} className="p-3 rounded-xl text-center" style={{ background: "var(--surface)" }}>
                  <div className="text-lg font-bold" style={{ color: "var(--navy-950)" }}>{s.value}</div>
                  <div className="text-xs" style={{ color: "var(--muted)" }}>{s.label}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setPhase("exam")}
              className="btn-primary w-full py-3 text-base font-semibold"
            >
              Begin Exam →
            </button>
            <Link href="/exam-portal" className="block text-center text-sm mt-3" style={{ color: "var(--muted)" }}>
              ← Back to Exam Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── AI Marking screen ──────────────────────────────────────────
  if (phase === "submitting") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(135deg, #020d20 0%, #061c47 100%)" }}>
        {/* Inject CSS scanner animations */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes laser-sweep {
            0% { top: 0%; }
            50% { top: 100%; }
            100% { top: 0%; }
          }
          .laser-line {
            animation: laser-sweep 2s infinite ease-in-out;
          }
        `}} />

        <div className="w-full max-w-md text-center">
          <div className="card p-10 relative overflow-hidden" 
               style={{ 
                 background: "rgba(255, 255, 255, 0.03)", 
                 borderColor: "rgba(255, 255, 255, 0.08)", 
                 backdropFilter: "blur(16px)",
                 boxShadow: "0 25px 50px rgba(0, 0, 0, 0.4)" 
               }}>
            
            {/* Immersive Script scanning graphic */}
            <div className="relative w-40 h-40 mx-auto mb-6 border border-white/10 rounded-2xl bg-white/5 p-4 flex items-center justify-center overflow-hidden">
              <div className="relative w-full h-full opacity-60">
                <Image src="/assets/illustrations/ai_marking_illustration.png" alt="AI Marking" fill className="object-contain" />
              </div>
              {/* Pulsing neon laser line */}
              <div className="laser-line absolute left-0 right-0 h-0.5 bg-green-400 shadow-[0_0_12px_#4ade80] pointer-events-none" />
            </div>

            <h2 className="text-xl font-bold mb-2 text-white flex items-center justify-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
              AI Vision Script Analysis
            </h2>
            <p className="text-xs mb-6 text-white/50 max-w-xs mx-auto">
              Our vision engine is extracting your MCQ entries and cross-referencing answers against the state key...
            </p>

            {/* Custom high-end progress indicator */}
            <div className="h-2 rounded-full overflow-hidden mb-3 bg-white/10">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${aiProgress}%`, background: "linear-gradient(90deg, #4ade80, #3b82f6)" }}
              />
            </div>
            <div className="text-sm font-semibold text-green-400">{aiProgress}% processing</div>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {["Extracting options", "Cross-referencing key", "Computing percentile", "Compiling profile"].map((step, i) => (
                <span key={step} className="text-[10px] px-3 py-1 rounded-full font-bold tracking-wider transition-all border"
                  style={aiProgress > i * 25
                    ? { background: "rgba(74,222,128,0.1)", color: "#4ade80", borderColor: "rgba(74,222,128,0.2)" }
                    : { background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.3)", borderColor: "rgba(255,255,255,0.05)" }}>
                  {aiProgress > i * 25 ? "✓ " : ""}{step}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Results screen ──────────────────────────────────────────
  if (phase === "results") {
    const grade = score >= 80 ? "A" : score >= 65 ? "B" : score >= 50 ? "C" : score >= 40 ? "D" : "F";
    const gradeColor = score >= 80 ? "var(--green-600)" : score >= 65 ? "var(--blue-600)" : score >= 50 ? "var(--gold-500)" : "#ef4444";
    const correct = questions.filter(q => answers[q.id] === q.correct).length;

    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "var(--surface)" }}>
        <div className="w-full max-w-lg">
          <div className="card overflow-hidden">
            <div className="p-8 text-center text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--navy-950) 0%, #0d2a6e 100%)" }}>
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-5" style={{ background: "white", transform: "translate(30%, -30%)" }} />
              <div className="relative z-10">
                <div className="text-white/60 text-xs font-bold tracking-widest mb-3">EXAM COMPLETE</div>
                <div className="text-7xl font-bold mb-2" style={{ color: gradeColor }}>{score}%</div>
                <div className="text-2xl font-bold mb-1">Grade {grade}</div>
                <div className="text-white/60 text-sm">{exam.title}</div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Correct", value: correct, color: "var(--green-600)" },
                  { label: "Wrong", value: questions.length - correct - (questions.length - answered), color: "#ef4444" },
                  { label: "Unanswered", value: questions.length - answered, color: "var(--muted)" },
                ].map(s => (
                  <div key={s.label} className="p-3 rounded-xl text-center" style={{ background: "var(--surface)" }}>
                    <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl" style={{ background: "rgba(46,175,93,0.06)", border: "1px solid rgba(46,175,93,0.15)" }}>
                <div className="flex items-center gap-2 text-sm font-semibold mb-1" style={{ color: "var(--green-600)" }}>
                  <CheckCircle size={14} /> AI Marking Complete
                </div>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  Your script has been processed and verified. Results are now published to the portal.
                </p>
              </div>

              <div className="flex gap-3">
                <Link href="/results" className="btn-primary flex-1 py-2.5 text-sm text-center">View Full Results</Link>
                <Link href="/exam-portal" className="btn-secondary flex-1 py-2.5 text-sm text-center">Back to Portal</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Exam screen ──────────────────────────────────────────
  const q = questions[current];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--surface)" }}>
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-white border-b shadow-sm" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="relative w-6 h-6">
              <Image src="/assets/brand/logo_state_quiz.png" alt="logo" fill className="object-contain" />
            </div>
            <span className="font-bold text-sm hidden sm:block" style={{ color: "var(--navy-950)" }}>Sen. Asuquo Ekpenyong Quiz</span>
          </div>

          <div className="flex-1 mx-4">
            <div className="flex items-center justify-between text-xs mb-1" style={{ color: "var(--muted)" }}>
              <span>{answered}/{questions.length} answered</span>
              <span>{pct}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: "var(--blue-600)" }} />
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold flex-shrink-0" style={{ background: `${timeColor}12`, color: timeColor }}>
            <Clock size={14} />
            {formatTime(timeLeft)}
          </div>

          <button
            onClick={handleSubmit}
            className="px-3 py-1.5 rounded-xl text-sm font-semibold text-white flex-shrink-0"
            style={{ background: "var(--navy-950)" }}
          >
            Submit
          </button>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Question */}
          <div className="lg:col-span-3 space-y-5">
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "rgba(47,107,255,0.08)", color: "var(--blue-600)" }}>
                  Question {current + 1} of {questions.length}
                </span>
                {flagged.has(q.id) && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "rgba(244,180,0,0.1)", color: "#b8860b" }}>
                    Flagged
                  </span>
                )}
              </div>

              <p className="text-lg font-semibold leading-relaxed mb-6" style={{ color: "var(--text)" }}>
                {q.question}
              </p>

              <div className="space-y-3">
                {q.options.map((opt, i) => {
                  const selected = answers[q.id] === i;
                  return (
                    <button
                      key={i}
                      onClick={() => setAnswers(prev => ({ ...prev, [q.id]: i }))}
                      className="w-full text-left px-4 py-3.5 rounded-xl border text-sm font-medium transition-all"
                      style={selected
                        ? { borderColor: "var(--blue-600)", background: "rgba(47,107,255,0.06)", color: "var(--blue-600)" }
                        : { borderColor: "var(--border)", color: "var(--text)", background: "white" }
                      }
                    >
                      <span className="inline-flex w-6 h-6 rounded-full items-center justify-center text-xs font-bold mr-3 flex-shrink-0"
                        style={selected
                          ? { background: "var(--blue-600)", color: "white" }
                          : { background: "var(--surface)", color: "var(--muted)" }
                        }>
                        {["A", "B", "C", "D"][i]}
                      </span>
                      {opt.replace(/^[A-D]\. /, "")}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrent(Math.max(0, current - 1))}
                disabled={current === 0}
                className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium border disabled:opacity-40 transition-colors hover:bg-gray-50"
                style={{ borderColor: "var(--border)", color: "var(--text)" }}
              >
                <ChevronLeft size={16} /> Previous
              </button>

              <button
                onClick={() => setFlagged(prev => {
                  const next = new Set(prev);
                  next.has(q.id) ? next.delete(q.id) : next.add(q.id);
                  return next;
                })}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-colors"
                style={flagged.has(q.id)
                  ? { borderColor: "var(--gold-500)", color: "#b8860b", background: "rgba(244,180,0,0.08)" }
                  : { borderColor: "var(--border)", color: "var(--muted)" }
                }
              >
                <Flag size={14} /> {flagged.has(q.id) ? "Unflag" : "Flag"}
              </button>

              {current < questions.length - 1 ? (
                <button
                  onClick={() => setCurrent(Math.min(questions.length - 1, current + 1))}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium border transition-colors hover:bg-gray-50"
                  style={{ borderColor: "var(--border)", color: "var(--text)" }}
                >
                  Next <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="btn-primary px-5 py-2 text-sm"
                >
                  Submit Exam
                </button>
              )}
            </div>
          </div>

          {/* Question navigator */}
          <div className="card p-4 h-fit sticky top-20">
            <h4 className="text-xs font-bold mb-3" style={{ color: "var(--muted)" }}>QUESTION NAVIGATOR</h4>
            <div className="grid grid-cols-4 gap-1.5 mb-4">
              {questions.map((q2, i) => {
                const isCurrent = i === current;
                const isAnswered = answers[q2.id] !== undefined;
                const isFlagged = flagged.has(q2.id);
                return (
                  <button
                    key={q2.id}
                    onClick={() => setCurrent(i)}
                    className="w-full aspect-square rounded-lg text-xs font-bold transition-all"
                    style={isCurrent
                      ? { background: "var(--navy-950)", color: "white" }
                      : isFlagged
                      ? { background: "rgba(244,180,0,0.15)", color: "#b8860b", border: "1px solid rgba(244,180,0,0.4)" }
                      : isAnswered
                      ? { background: "rgba(46,175,93,0.12)", color: "var(--green-600)" }
                      : { background: "var(--surface)", color: "var(--muted)", border: "1px solid var(--border)" }
                    }
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
            <div className="space-y-1.5">
              {[
                { color: "var(--navy-950)", label: "Current" },
                { color: "var(--green-600)", label: "Answered" },
                { color: "#b8860b", label: "Flagged" },
                { color: "var(--muted)", label: "Unanswered" },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-2 text-[10px]" style={{ color: "var(--muted)" }}>
                  <div className="w-3 h-3 rounded" style={{ background: l.color }} />
                  {l.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClipboardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--blue-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  );
}

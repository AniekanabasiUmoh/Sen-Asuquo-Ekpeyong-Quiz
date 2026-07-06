"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Award, School, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useRole, UserRole } from "@/lib/RoleContext";

const schoolsLeaderboard = [
  { rank: 1, school: "Govt. Secondary School, Calabar", lga: "Calabar Municipal", score: "9,852" },
  { rank: 2, school: "Hope Waddell Training Inst.", lga: "Calabar Municipal", score: "9,245" },
  { rank: 3, school: "Ayade Model Secondary School", lga: "Yala", score: "8,764" },
  { rank: 4, school: "Saint Patrick's College", lga: "Calabar South", score: "8,231" },
  { rank: 5, school: "Holy Child Secondary School", lga: "Calabar Municipal", score: "7,985" },
];

const onlineLeaderboard = [
  { rank: 1, name: "Ekpenyong Akpan", school: "Govt. Sec. School, Calabar", points: "1,250", avatar: "/assets/portraits/student_ekpenyong_akpan.png" },
  { rank: 2, name: "Bassey Edet", school: "Hope Waddell Training Inst.", points: "1,180", avatar: "/assets/portraits/student_bassey_edet.png" },
  { rank: 3, name: "Asuquo Bassey", school: "Ayade Model Sec. School", points: "1,090", avatar: "/assets/portraits/student_asuquo_bassey.png" },
  { rank: 4, name: "Mary E. Offiong", school: "Saint Patrick's College", points: "980", avatar: "/assets/portraits/student_mary_effiong.png" },
  { rank: 5, name: "Imoh Essien", school: "Holy Child Secondary School", points: "890", avatar: "/assets/portraits/student_imoh_essien.png" },
];

function RankBadge({ rank }: { rank: number }) {
  const medals = ["/assets/medals/rank_gold_1.png", "/assets/medals/rank_silver_2.png", "/assets/medals/rank_bronze_3.png"];
  if (rank <= 3) {
    return (
      <span className="relative inline-flex w-7 h-7">
        <Image src={medals[rank - 1]} alt={`rank ${rank}`} fill className="object-contain" />
      </span>
    );
  }
  return (
    <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "var(--surface)", color: "var(--muted)" }}>
      {rank}
    </span>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { setRole, setPortalSelected } = useRole();
  const [showMessage, setShowMessage] = useState(false);
  const [showPortalModal, setShowPortalModal] = useState(false);

  const handlePortalSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setPortalSelected(true);
    setShowPortalModal(false);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-14 pb-20 lg:pt-20 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-5" style={{ color: "var(--navy-950)" }}>
              Excellence in Knowledge.<br />
              <span style={{ color: "var(--blue-600)" }}>Pride in Performance.</span>
            </h1>
            <p className="text-base mb-8 leading-relaxed" style={{ color: "var(--muted)" }}>
              Compete, prove yourself, and win scholarships and cash prizes — the biggest academic competition in Cross River State, championed by Senator Asuquo Ekpenyong.
            </p>
            <div className="flex flex-wrap gap-3 mb-3">
              <button
                onClick={() => setShowPortalModal(true)}
                className="btn-primary px-8 py-3.5 text-sm inline-block font-semibold transition-all shadow-md hover:shadow-lg hover:scale-[1.01]"
              >
                Academic Portal
              </button>
            </div>
          </div>

          <div className="relative pt-6 pr-6">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: "4/3" }}>
              <Image src="/assets/hero/hero_classroom_students.png" alt="Students in classroom" fill className="object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(255,255,255,0.05) 0%, transparent 50%)" }} />
            </div>
          </div>
        </div>
      </section>

      {/* Senator section (Moved to right below hero section) */}
      <section className="py-16" style={{ background: "var(--surface)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-3xl overflow-hidden" style={{ background: "var(--navy-950)" }}>
            <div className="grid lg:grid-cols-5">
              {/* Portrait side */}
              <div className="lg:col-span-2 relative w-full h-80 sm:h-[400px] lg:h-auto lg:min-h-0">
                <Image
                  src="/assets/portraits/senator_asuquo_ekpenyong_portrait.png"
                  alt="Senator Asuquo Ekpenyong"
                  fill
                  className="object-cover object-top"
                />
                 <div className="absolute inset-0 hidden lg:block" style={{ background: "linear-gradient(to right, transparent 60%, var(--navy-950) 100%)" }} />
                 <div className="absolute inset-0 lg:hidden" style={{ background: "linear-gradient(to top, var(--navy-950) 0%, transparent 15%)" }} />
              </div>

              {/* Text side */}
              <div className="lg:col-span-3 p-8 lg:p-12 flex flex-col justify-center lg:min-h-[440px]">
                <div className="text-xs font-bold tracking-widest mb-4" style={{ color: "var(--gold-500)" }}>A MESSAGE FROM THE SPONSOR</div>
                <h3 className="text-3xl lg:text-4xl font-bold text-white mb-1">Senator Asuquo<br />Ekpenyong</h3>
                <div className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.45)" }}>Senator, Cross River South · Founding Sponsor</div>

                <div className="relative">
                  <div className="absolute -top-1 -left-2 text-5xl font-serif leading-none" style={{ color: "var(--gold-500)", opacity: 0.4 }}>"</div>
                  <p className="text-base leading-relaxed pl-5" style={{ color: "rgba(255,255,255,0.85)" }}>
                    Education is the greatest investment we can make in our future. This quiz competition is designed to inspire brilliance, reward excellence, and build the leaders who will transform Cross River State and Nigeria.
                  </p>
                  <div className="absolute -bottom-4 right-0 text-5xl font-serif leading-none" style={{ color: "var(--gold-500)", opacity: 0.4 }}>"</div>
                </div>


              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prizes */}
      <section className="py-20 relative overflow-hidden" style={{ background: "white" }}>
        {/* Subtle grid background overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold" style={{ color: "var(--navy-950)", letterSpacing: "-0.5px" }}>What You're Competing For</h2>
            <p className="text-sm mt-3 max-w-xl mx-auto" style={{ color: "var(--muted)" }}>Top performers in every category walk away with life-changing rewards, academic scholarships, and institutional resources.</p>
          </div>

          {/* Grand prize — hero row */}
          <div className="rounded-3xl overflow-hidden mb-6 border transition-all duration-300 hover:shadow-2xl" 
               style={{ 
                 background: "linear-gradient(135deg, #020d20 0%, #061c47 50%, #171101 100%)", 
                 borderColor: "rgba(244,180,0,0.35)",
                 boxShadow: "0 20px 40px rgba(3, 26, 74, 0.12)"
               }}>
            <div className="grid lg:grid-cols-2 items-center">
              <div className="flex items-center justify-center p-8 lg:p-12 relative">
                {/* Gold radial background glow */}
                <div className="absolute w-60 h-60 rounded-full blur-3xl opacity-20" style={{ background: "var(--gold-500)" }} />
                <div className="relative w-48 h-48 lg:w-72 lg:h-72 drop-shadow-[0_15px_30px_rgba(244,180,0,0.3)] transition-transform duration-500 hover:scale-105">
                  <Image src="/assets/prizes/grand_cash_prize.png" alt="Grand Cash Prize" fill className="object-contain" />
                </div>
              </div>
              <div className="px-8 pb-10 lg:py-12 lg:pl-0 lg:pr-12">
                <div className="text-4xl lg:text-5.5xl font-extrabold text-white mb-2 leading-none" style={{ letterSpacing: "-1px" }}>₦25,000,000</div>
                <div className="text-sm font-bold mb-4" style={{ color: "var(--gold-500)" }}>Grand Cash Prize & Academic Trust</div>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.7)" }}>
                  Awarded to the single highest-scoring candidate statewide across all participating schools and local government areas in Cross River South.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboards */}
      <section className="max-w-7xl mx-auto px-6 py-16" style={{ background: "var(--surface)" }}>
        <div className="text-center mb-10">
          <div className="text-xs font-bold tracking-widest mb-2" style={{ color: "var(--blue-600)" }}>RANKINGS</div>
          <h2 className="text-2xl lg:text-3xl font-bold" style={{ color: "var(--navy-950)" }}>Current Leaderboards</h2>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Schools */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-sm tracking-widest" style={{ color: "var(--navy-950)" }}>SCHOOLS LEADERBOARD</h3>
              <Link href="/leaderboard" className="text-sm font-medium" style={{ color: "var(--blue-600)" }}>View Full →</Link>
            </div>
            <div className="border-b pb-2 mb-2 grid grid-cols-12 text-xs font-semibold" style={{ color: "var(--muted)", borderColor: "var(--border)" }}>
              <span className="col-span-1">#</span>
              <span className="col-span-6">School</span>
              <span className="col-span-3">LGA</span>
              <span className="col-span-2 text-right">Points</span>
            </div>
            {schoolsLeaderboard.map((row) => (
              <div key={row.rank} className="grid grid-cols-12 items-center py-2.5 border-b last:border-0" style={{ borderColor: "var(--surface)" }}>
                <div className="col-span-1"><RankBadge rank={row.rank} /></div>
                <div className="col-span-6 text-sm font-medium pr-2" style={{ color: "var(--text)" }}>{row.school}</div>
                <div className="col-span-3 text-xs" style={{ color: "var(--muted)" }}>{row.lga}</div>
                <div className="col-span-2 text-sm font-bold text-right" style={{ color: "var(--navy-950)" }}>{row.score}</div>
              </div>
            ))}
            <Link href="/leaderboard" className="btn-primary w-full flex items-center justify-center mt-5 py-2.5 text-sm">
              View Full Schools Leaderboard
            </Link>
          </div>

          {/* Students */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-sm tracking-widest" style={{ color: "var(--navy-950)" }}>TOP STUDENTS THIS WEEK</h3>
              <Link href="/leaderboard" className="text-sm font-medium" style={{ color: "var(--blue-600)" }}>View Full →</Link>
            </div>
            <div className="border-b pb-2 mb-2 grid grid-cols-12 text-xs font-semibold" style={{ color: "var(--muted)", borderColor: "var(--border)" }}>
              <span className="col-span-1">#</span>
              <span className="col-span-5">Candidate</span>
              <span className="col-span-4">School</span>
              <span className="col-span-2 text-right">Points</span>
            </div>
            {onlineLeaderboard.map((row) => (
              <div key={row.rank} className="grid grid-cols-12 items-center py-2.5 border-b last:border-0" style={{ borderColor: "var(--surface)" }}>
                <div className="col-span-1"><RankBadge rank={row.rank} /></div>
                <div className="col-span-5 flex items-center gap-2 min-w-0">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border" style={{ borderColor: "var(--border)" }}>
                    <Image src={row.avatar} alt={row.name} fill className="object-cover" />
                  </div>
                  <span className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>{row.name}</span>
                </div>
                <div className="col-span-4 text-xs truncate" style={{ color: "var(--muted)" }}>{row.school}</div>
                <div className="col-span-2 text-sm font-bold text-right" style={{ color: "var(--navy-950)" }}>{row.points}</div>
              </div>
            ))}
            <Link href="/leaderboard" className="btn-primary w-full flex items-center justify-center mt-5 py-2.5 text-sm">
              View Full Student Leaderboard
            </Link>
          </div>
        </div>
      </section>

      {/* Senator full message modal */}
      {showMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setShowMessage(false)}>
          <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()} style={{ background: "var(--navy-950)" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
              <div>
                <div className="text-xs font-bold tracking-widest" style={{ color: "var(--gold-500)" }}>MESSAGE FROM THE SPONSOR</div>
                <div className="text-white font-semibold mt-0.5">Senator Asuquo Ekpenyong</div>
              </div>
              <button onClick={() => setShowMessage(false)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors" style={{ color: "rgba(255,255,255,0.6)" }}>
                <X size={16} />
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
              <p>
                Fellow citizens of Cross River South, and indeed all of Cross River State — I bring you greetings and deep gratitude.
              </p>
              <p>
                Education is the single most powerful instrument we have for transforming the lives of our young people. It is with this conviction that I established the Senator Asuquo Ekpenyong Quiz Competition — a platform designed to identify, celebrate and reward academic brilliance across our state.
              </p>
              <p>
                This competition is not just about prizes. It is about instilling in every student the belief that their effort and dedication will be recognised. It is about building the generation of thinkers, innovators and leaders that Cross River State — and Nigeria — needs.
              </p>
              <p>
                I urge every student to participate, every school to encourage their candidates, and every parent to support their children. The future belongs to the prepared mind.
              </p>
              <p className="font-semibold" style={{ color: "var(--gold-500)" }}>
                Together, let us build an educated, competitive and prosperous Cross River State.
              </p>
            </div>
            <div className="px-6 py-4 border-t flex items-center justify-between" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
              <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Senator, Cross River South · 10th Senate</div>
              <button onClick={() => setShowMessage(false)} className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ background: "var(--gold-500)", color: "var(--navy-950)" }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Academic Portal Selector Modal */}
      {showPortalModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowPortalModal(false)}>
          <div className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col animate-fadeIn max-h-[90vh]" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: "#e8edf5" }}>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Select Academic Portal</h3>
                <p className="text-xs text-slate-500 mt-0.5">Choose your role or workspace to continue to the portal</p>
              </div>
              <button
                onClick={() => setShowPortalModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 grid md:grid-cols-3 gap-4 overflow-y-auto flex-1">
              {/* Student Option */}
              <button
                onClick={() => handlePortalSelect("student")}
                className="group p-5 rounded-2xl border text-left flex flex-col items-start gap-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-blue-300 hover:bg-blue-50/20"
                style={{ borderColor: "#e8edf5" }}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <Award size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-900">Student Portal</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Access weekly quizzes, view your score sheet, track certificates, and see student leaderboard rankings.
                  </p>
                </div>
              </button>

              {/* School Coordinator Option */}
              <button
                onClick={() => handlePortalSelect("school")}
                className="group p-5 rounded-2xl border text-left flex flex-col items-start gap-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-amber-300 hover:bg-amber-50/20"
                style={{ borderColor: "#e8edf5" }}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 transition-colors group-hover:bg-amber-500 group-hover:text-white">
                  <School size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm group-hover:text-amber-900">School Coordinator</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Register students, view school-wide analytics, submit offline scores, and track your school's standing.
                  </p>
                </div>
              </button>

              {/* Admin Option */}
              <button
                onClick={() => handlePortalSelect("admin")}
                className="group p-5 rounded-2xl border text-left flex flex-col items-start gap-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-indigo-300 hover:bg-indigo-50/20"
                style={{ borderColor: "#e8edf5" }}
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                  <Shield size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm group-hover:text-indigo-900">State Admin Portal</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Manage participants across all 18 LGAs, schedule online quizzes, review analytics, and generate reports.
                  </p>
                </div>
              </button>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t flex justify-end" style={{ borderColor: "#e8edf5" }}>
              <button
                onClick={() => setShowPortalModal(false)}
                className="px-4 py-2 bg-white border rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                style={{ borderColor: "#e8edf5" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t" style={{ borderColor: "#e8edf5", background: "#fff" }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="relative w-8 h-8">
                  <Image src="/assets/brand/logo_state_quiz.png" alt="logo" fill className="object-contain" />
                </div>
                <span className="font-bold text-sm" style={{ color: "var(--navy-950)" }}>SEN. ASUQUO EKPENYONG QUIZ</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                A state-level education initiative promoting academic excellence in Cross River State, Nigeria.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3" style={{ color: "var(--text)" }}>Quick Links</h4>
              <ul className="space-y-2">
                {[
                  { label: "Home", href: "/" },
                  { label: "Results", href: "/results" },
                  { label: "Leaderboard", href: "/leaderboard" },
                  { label: "Schools", href: "/schools" },
                  { label: "Weekly Quiz", href: "/weekly-quiz" },
                  { label: "Exam Portal", href: "/exam-portal" },
                ].map(l => (
                  <li key={l.label}><Link href={l.href} className="text-xs hover:underline" style={{ color: "var(--muted)" }}>{l.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3" style={{ color: "var(--text)" }}>Resources</h4>
              <ul className="space-y-2">
                {["Guidelines", "FAQs", "Downloads", "News & Updates"].map(l => (
                  <li key={l}><a href="#" className="text-xs hover:underline" style={{ color: "var(--muted)" }}>{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3" style={{ color: "var(--text)" }}>Contact Us</h4>
              <div className="space-y-1.5 text-xs" style={{ color: "var(--muted)" }}>
                <p>State Secretariat, Calabar,</p>
                <p>Cross River State, Nigeria</p>
                <p>+234 800 123 4567</p>
                <p>info@ekpenyongquiz.cr.gov.ng</p>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-2 text-xs" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
            <span>© 2025/2026 Sen. Asuquo Ekpenyong Quiz Competition. All rights reserved.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:underline">Privacy Policy</a>
              <a href="#" className="hover:underline">Terms of Use</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

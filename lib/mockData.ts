export const schools = [
  { id: 1, name: "Government Secondary School, Calabar", lga: "Calabar Municipal", candidates: 245, avgScore: 82.4, bestSubject: "Mathematics", rank: 1, gold: 12, silver: 8, bronze: 5, trend: "up", crest: "/assets/school-crests/government_secondary_school_calabar.png" },
  { id: 2, name: "Hope Waddell Training Institution", lga: "Calabar Municipal", candidates: 198, avgScore: 79.8, bestSubject: "English", rank: 2, gold: 10, silver: 9, bronze: 6, trend: "up", crest: "/assets/school-crests/hope_waddell_training_institution.png" },
  { id: 3, name: "Ayade Model Secondary School", lga: "Yala", candidates: 176, avgScore: 77.2, bestSubject: "Biology", rank: 3, gold: 8, silver: 7, bronze: 9, trend: "up", crest: "/assets/school-crests/ayade_model_secondary_school.png" },
  { id: 4, name: "Saint Patrick's College, Calabar", lga: "Calabar South", candidates: 165, avgScore: 75.5, bestSubject: "Physics", rank: 4, gold: 7, silver: 6, bronze: 8, trend: "down", crest: "/assets/school-crests/saint_patricks_college_calabar.png" },
  { id: 5, name: "Holy Child Secondary School", lga: "Calabar Municipal", candidates: 152, avgScore: 74.1, bestSubject: "Chemistry", rank: 5, gold: 6, silver: 8, bronze: 7, trend: "up", crest: "/assets/school-crests/holy_child_secondary_school.png" },
  { id: 6, name: "Federal Government College, Ogoja", lga: "Ogoja", candidates: 148, avgScore: 72.9, bestSubject: "Mathematics", rank: 6, gold: 5, silver: 7, bronze: 6, trend: "same", crest: "/assets/school-crests/federal_government_college_ogoja.png" },
  { id: 7, name: "Comprehensive Secondary School, Ikom", lga: "Ikom", candidates: 135, avgScore: 71.3, bestSubject: "English", rank: 7, gold: 5, silver: 5, bronze: 8, trend: "down", crest: "/assets/school-crests/comprehensive_secondary_school_ikom.png" },
  { id: 8, name: "Community Secondary School, Ikot Ansa", lga: "Calabar South", candidates: 128, avgScore: 69.7, bestSubject: "Biology", rank: 8, gold: 4, silver: 6, bronze: 7, trend: "up", crest: "/assets/school-crests/community_secondary_school_ikot_ansa.png" },
  { id: 9, name: "Wellington Bassey College", lga: "Calabar Municipal", candidates: 121, avgScore: 68.5, bestSubject: "Chemistry", rank: 9, gold: 3, silver: 5, bronze: 6, trend: "same", crest: "/assets/school-crests/wellington_bassey_college.png" },
  { id: 10, name: "Bethel Baptist High School", lga: "Calabar South", candidates: 115, avgScore: 67.2, bestSubject: "Physics", rank: 10, gold: 3, silver: 4, bronze: 5, trend: "up", crest: "/assets/school-crests/bethel_baptist_high_school.png" },
];

export const topStudents = [
  { id: 1, name: "Ekpenyong Akpan", school: "Government Secondary School, Calabar", lga: "Calabar Municipal", score: 94.4, rank: 1, movement: 0, portrait: "/assets/portraits/student_ekpenyong_akpan.png" },
  { id: 2, name: "Bassey Edet", school: "Hope Waddell Training Institution", lga: "Calabar Municipal", score: 91.2, rank: 2, movement: 1, portrait: "/assets/portraits/student_bassey_edet.png" },
  { id: 3, name: "Asuquo Bassey", school: "Ayade Model Secondary School", lga: "Yala", score: 89.7, rank: 3, movement: -1, portrait: "/assets/portraits/student_asuquo_bassey.png" },
  { id: 4, name: "Mary E. Offiong", school: "Saint Patrick's College, Calabar", lga: "Calabar South", score: 87.3, rank: 4, movement: 2, portrait: "/assets/portraits/student_mary_effiong.png" },
  { id: 5, name: "Imoh Essien", school: "Holy Child Secondary School", lga: "Calabar Municipal", score: 85.9, rank: 5, movement: 0, portrait: "/assets/portraits/student_imoh_essien.png" },
  { id: 6, name: "Grace Okon", school: "Federal Government College, Ogoja", lga: "Ogoja", score: 84.2, rank: 6, movement: 3, portrait: "/assets/portraits/participant_1.png" },
  { id: 7, name: "David Effiom", school: "Comprehensive Secondary School, Ikom", lga: "Ikom", score: 82.8, rank: 7, movement: -2, portrait: "/assets/portraits/participant_2.png" },
  { id: 8, name: "Blessing Archibong", school: "Holy Child Secondary School", lga: "Calabar Municipal", score: 81.5, rank: 8, movement: 1, portrait: "/assets/portraits/participant_3.png" },
  { id: 9, name: "Paul Inyang", school: "Wellington Bassey College", lga: "Calabar Municipal", score: 80.1, rank: 9, movement: 0, portrait: "/assets/portraits/participant_4.png" },
  { id: 10, name: "Ndifreke Etim", school: "Bethel Baptist High School", lga: "Calabar South", score: 79.4, rank: 10, movement: -1, portrait: "/assets/portraits/participant_5.png" },
];

export const allLGAs = [
  { lga: "Calabar Municipal", schools: 18, candidates: 842, avgScore: 78.4, rank: 1, trend: "up" },
  { lga: "Calabar South", schools: 14, candidates: 621, avgScore: 74.2, rank: 2, trend: "up" },
  { lga: "Ogoja", schools: 9, candidates: 398, avgScore: 71.8, rank: 3, trend: "same" },
  { lga: "Ikom", schools: 8, candidates: 356, avgScore: 69.5, rank: 4, trend: "down" },
  { lga: "Ayade", schools: 7, candidates: 284, avgScore: 68.1, rank: 5, trend: "up" },
  { lga: "Boki", schools: 6, candidates: 241, avgScore: 66.4, rank: 6, trend: "up" },
  { lga: "Etung", schools: 5, candidates: 198, avgScore: 65.2, rank: 7, trend: "same" },
  { lga: "Obubra", schools: 7, candidates: 312, avgScore: 64.8, rank: 8, trend: "down" },
  { lga: "Akpabuyo", schools: 8, candidates: 329, avgScore: 63.5, rank: 9, trend: "up" },
  { lga: "Bakassi", schools: 4, candidates: 142, avgScore: 62.1, rank: 10, trend: "same" },
  { lga: "Biase", schools: 6, candidates: 223, avgScore: 61.7, rank: 11, trend: "up" },
  { lga: "Obudu", schools: 5, candidates: 189, avgScore: 60.3, rank: 12, trend: "down" },
  { lga: "Oban", schools: 4, candidates: 154, avgScore: 59.8, rank: 13, trend: "same" },
  { lga: "Odukpani", schools: 6, candidates: 212, avgScore: 58.9, rank: 14, trend: "up" },
  { lga: "Yakurr", schools: 5, candidates: 178, avgScore: 57.4, rank: 15, trend: "down" },
  { lga: "Yala", schools: 4, candidates: 145, avgScore: 56.8, rank: 16, trend: "same" },
  { lga: "Bekwarra", schools: 3, candidates: 112, avgScore: 55.2, rank: 17, trend: "up" },
  { lga: "Ugep", schools: 3, candidates: 98, avgScore: 53.9, rank: 18, trend: "down" },
];

export const topLGAs = allLGAs.slice(0, 5);

export const topSubjects = [
  { subject: "Mathematics", avgScore: 76.4, participants: 1842, icon: "/assets/icons/math.png" },
  { subject: "English Language", avgScore: 74.2, participants: 1842, icon: "/assets/icons/english.png" },
  { subject: "Biology", avgScore: 72.8, participants: 1842, icon: "/assets/icons/biology.png" },
  { subject: "Physics", avgScore: 70.1, participants: 1421, icon: "/assets/icons/physics.png" },
  { subject: "Chemistry", avgScore: 68.9, participants: 1421, icon: "/assets/icons/chemistry.png" },
];

export const candidateResult = {
  name: "Ekpenyong Akpan",
  school: "Government Secondary School, Calabar",
  lga: "Calabar Municipal",
  candidateId: "CRS/2025-26/00142",
  season: "2025/2026 Season 1",
  rank: 1,
  totalScore: 472,
  maxScore: 500,
  percentage: 94.4,
  grade: "A",
  portrait: "/assets/portraits/candidate_main_ekpenyong_akpan.png",
  subjects: [
    { name: "Mathematics", score: 98, max: 100, grade: "A", percentile: 99 },
    { name: "English Language", score: 95, max: 100, grade: "A", percentile: 97 },
    { name: "Biology", score: 94, max: 100, grade: "A", percentile: 96 },
    { name: "Physics", score: 92, max: 100, grade: "A", percentile: 94 },
    { name: "Chemistry", score: 93, max: 100, grade: "A", percentile: 95 },
  ],
  scoreTrend: [
    { week: "Wk 1", score: 81 },
    { week: "Wk 2", score: 85 },
    { week: "Wk 3", score: 88 },
    { week: "Wk 4", score: 90 },
    { week: "Wk 5", score: 92 },
    { week: "Wk 6", score: 94 },
  ],
};

export const upcomingQuizzes = [
  { id: 1, title: "Advanced Mathematics Quiz", date: "July 12, 2026", time: "10:00 AM", duration: "15 min", participants: 1240, subject: "Mathematics" },
  { id: 2, title: "English Comprehension Challenge", date: "July 15, 2026", time: "2:00 PM", duration: "15 min", participants: 980, subject: "English" },
  { id: 3, title: "Science & Technology Bowl", date: "July 19, 2026", time: "11:00 AM", duration: "15 min", participants: 750, subject: "Sciences" },
];

export const completedQuizzes = [
  { id: 101, title: "Week 23 — Science Quiz", date: "June 28, 2026", subject: "Sciences", score: 88, rank: 4, participants: 1620 },
  { id: 102, title: "Week 22 — English Language", date: "June 21, 2026", subject: "English", score: 92, rank: 2, participants: 1788 },
  { id: 103, title: "Week 21 — Mathematics", date: "June 14, 2026", subject: "Mathematics", score: 95, rank: 1, participants: 1812 },
];

export const currentQuiz = {
  title: "Weekly Mathematics Challenge",
  subject: "Mathematics",
  week: "Week 24",
  endsIn: { days: 2, hours: 14, minutes: 32 },
  participants: 1842,
  totalQuestions: 40,
  avgScore: 76.4,
};

export const quizQuestions = [
  {
    id: 1,
    question: "If f(x) = 3x² + 2x - 5, what is f(3)?",
    options: ["A. 28", "B. 30", "C. 34", "D. 22"],
    correct: 0,
  },
  {
    id: 2,
    question: "Solve for x: 2x + 7 = 19",
    options: ["A. x = 5", "B. x = 6", "C. x = 7", "D. x = 4"],
    correct: 1,
  },
  {
    id: 3,
    question: "What is the value of sin(90°)?",
    options: ["A. 0", "B. √2/2", "C. 1", "D. -1"],
    correct: 2,
  },
  {
    id: 4,
    question: "A circle has radius 7 cm. What is its area? (π ≈ 22/7)",
    options: ["A. 154 cm²", "B. 44 cm²", "C. 49 cm²", "D. 22 cm²"],
    correct: 0,
  },
  {
    id: 5,
    question: "Which of the following is a prime number?",
    options: ["A. 27", "B. 51", "C. 91", "D. 97"],
    correct: 3,
  },
  {
    id: 6,
    question: "Simplify: (x³ × x²) ÷ x⁴",
    options: ["A. x", "B. x²", "C. x³", "D. x⁰"],
    correct: 0,
  },
  {
    id: 7,
    question: "What is the LCM of 12 and 18?",
    options: ["A. 6", "B. 24", "C. 36", "D. 72"],
    correct: 2,
  },
  {
    id: 8,
    question: "If a right-angled triangle has legs 3 and 4, what is the hypotenuse?",
    options: ["A. 5", "B. 6", "C. 7", "D. 12"],
    correct: 0,
  },
];

export const exams = [
  { id: 1, title: "State Qualifying Examination", subject: "All Subjects", date: "July 20, 2026", duration: "15 min", status: "available", participants: 4250, questions: 8, instructions: ["This exam covers all 5 core subjects.", "Read each question carefully before answering.", "Answers cannot be changed after submission.", "All answers are automatically saved.", "Ensure stable internet before starting."] },
  { id: 2, title: "Mathematics Olympiad — Preliminary", subject: "Mathematics", date: "July 25, 2026", duration: "15 min", status: "available", participants: 2100, questions: 8, instructions: ["This is a Mathematics-only paper.", "Calculators are NOT permitted.", "Show all working in calculations.", "Each question carries equal marks.", "Timer begins as soon as you click Start."] },
  { id: 3, title: "Science Championship — Round 1", subject: "Sciences", date: "July 28, 2026", duration: "15 min", status: "upcoming", participants: 1800, questions: 8, instructions: [] },
  { id: 4, title: "English Language Proficiency Test", subject: "English", date: "June 30, 2026", duration: "15 min", status: "completed", participants: 3900, score: 88, questions: 8, instructions: [] },
  { id: 5, title: "General Knowledge Quiz", subject: "Mixed", date: "June 15, 2026", duration: "15 min", status: "completed", participants: 5100, score: 92, questions: 8, instructions: [] },
];

export const recentActivity = [
  { id: 1, type: "result", message: "Bassey Edet completed Mathematics Olympiad — scored 91%", time: "2 min ago", avatar: "/assets/portraits/student_bassey_edet.png" },
  { id: 2, type: "quiz", message: "Week 24 quiz now active — 1,842 participants joined", time: "14 min ago", avatar: null },
  { id: 3, type: "result", message: "Mary E. Offiong's result for English Test just published", time: "1 hr ago", avatar: "/assets/portraits/student_mary_effiong.png" },
  { id: 4, type: "school", message: "Hope Waddell climbed to rank #2 in Schools leaderboard", time: "3 hr ago", avatar: null },
  { id: 5, type: "result", message: "Imoh Essien scored 85.9% — Top 5 statewide", time: "5 hr ago", avatar: "/assets/portraits/student_imoh_essien.png" },
  { id: 6, type: "quiz", message: "Week 23 results published — 1,620 candidates graded", time: "Yesterday", avatar: null },
];

export const dashboardStats = {
  totalCandidates: 4218,
  totalSchools: 127,
  lgasCovered: 18,
  avgScore: 74.2,
  weeklyParticipants: 1842,
  examsTaken: 9150,
  prizesAwarded: 3,
  activeQuizzes: 1,
};

export const scoreDistribution = [
  { grade: "A (80–100%)", count: 412, color: "#2eaf5d" },
  { grade: "B (65–79%)", count: 891, color: "#2f6bff" },
  { grade: "C (50–64%)", count: 1124, color: "#f4b400" },
  { grade: "D (40–49%)", count: 623, color: "#f97316" },
  { grade: "F (0–39%)", count: 168, color: "#ef4444" },
];

export const achievements = [
  { id: 1, title: "First Quiz", description: "Completed your first weekly quiz", earned: true, date: "June 7, 2026", icon: "/assets/achievements/badge_first_quiz.png" },
  { id: 2, title: "Top Scorer", description: "Ranked #1 in a weekly quiz", earned: true, date: "June 14, 2026", icon: "/assets/achievements/badge_top_scorer.png" },
  { id: 3, title: "5-Week Streak", description: "Completed 5 consecutive weekly quizzes", earned: true, date: "July 5, 2026", icon: "/assets/achievements/badge_five_week_streak.png" },
  { id: 4, title: "School Champion", description: "Top scorer at your school", earned: false, date: null, icon: "/assets/achievements/badge_school_champion.png" },
];

import { StudyNote } from "../types";

export type Language = "en" | "bn";

export interface TranslationSchema {
  // Navigation & General
  brandName: string;
  selectLanguage: string;
  signOut: string;
  registeredStudent: string;
  adminNotice: string;
  workspaceGlow: string;
  stableSystem: string;
  devPlatform: string;
  backToLibrary: string;

  // Welcome Page
  welcomeSubtitle: string;
  welcomeTitlePrefix: string;
  welcomeTitleAccent: string;
  welcomeStartButton: string;
  secureSessionNotice: string;
  mathSubject: string;
  aiSummaries: string;
  quizPrep: string;

  // Registration Page
  regTitle: string;
  regSubtitle: string;
  regFullNameLabel: string;
  regFullNamePlaceholder: string;
  regEmailLabel: string;
  regEmailPlaceholder: string;
  regAgeLabel: string;
  regAgePlaceholder: string;
  regInstitutionLabel: string;
  regInstitutionPlaceholder: string;
  regGradeLabel: string;
  regGradeMiddle: string;
  regGradeHigh: string;
  regGradeUndergrad: string;
  regSubjectLabel: string;
  regSubjectMath: string;
  regSubmitButton: string;

  // Dashboard Page
  dashWelcome: string;
  dashIntro: string;
  dashQuickStats: string;
  dashStudyMin: string;
  dashNotesSaved: string;
  dashDoubtsResolved: string;
  dashQuizzesCleared: string;
  dashProgressTitle: string;
  dashProgressLevel: string;
  dashDailyAdviceTitle: string;
  dashDailyAdviceText: string;
  dashMinutesSpent: string;

  // Notes Manager Page
  notesLibraryTitle: string;
  notesWriteBtn: string;
  notesTitleInputLabel: string;
  notesTitlePlaceholder: string;
  notesContentInputLabel: string;
  notesContentPlaceholder: string;
  notesSubmitNewNote: string;
  notesCancelBtn: string;
  notesWriteNoteHeader: string;
  notesTagsLabel: string;
  notesTagsPlaceholder: string;
  notesSelectNoteFirst: string;
  notesClickToRead: string;
  notesEnterCustomNote: string;

  // Notes Tabs
  tabRead: string;
  tabSummary: string;
  tabFlashcards: string;
  tabQuiz: string;

  // Tab Details
  summaryEmpty: string;
  summaryPointCount: string;
  flashcardFlipHint: string;
  flashcardPrevBtn: string;
  flashcardNextBtn: string;
  flashcardCompleteState: string;
  quizHeader: string;
  quizSelectOption: string;
  quizCheckAnswer: string;
  quizCorrect: string;
  quizIncorrect: string;
  quizResultScore: string;
  quizRetry: string;

  // Support Chat Page
  chatHeaderTitle: string;
  chatActiveAgent: string;
  chatAssistantHint: string;
  chatAdminActiveBadge: string;
  chatInputPlaceholder: string;
  chatSendBtn: string;
  chatWelcomeMessage: string;
}

export const TRANSLATIONS: Record<Language, TranslationSchema> = {
  en: {
    brandName: "STUDY HUB",
    selectLanguage: "Language / ভাষা",
    signOut: "Sign Out",
    registeredStudent: "Registered Student",
    adminNotice: "Registered Administrator Mode",
    workspaceGlow: "Enter Academic Workspace",
    stableSystem: "System Active",
    devPlatform: "Official Academic Portal",
    backToLibrary: "Back to Library",

    // Welcome Page
    welcomeSubtitle: "Comprehensive Learning & Academic Excellence",
    welcomeTitlePrefix: "Empowering Your Academic Journey With ",
    welcomeTitleAccent: "STUDY HUB",
    welcomeStartButton: "Enter Academic Workspace",
    secureSessionNotice: "🔒 Verified and secure educational workspace",
    mathSubject: "Mathematics",
    aiSummaries: "Chapter Summaries",
    quizPrep: "Practice & Revision",

    // Registration Page
    regTitle: "Student Registration",
    regSubtitle: "Please provide your details below to activate your student workspace.",
    regFullNameLabel: "Full Name *",
    regFullNamePlaceholder: "Enter your full name",
    regEmailLabel: "Email Address *",
    regEmailPlaceholder: "name@example.com",
    regAgeLabel: "Age *",
    regAgePlaceholder: "Enter your age",
    regInstitutionLabel: "School / College / Institute *",
    regInstitutionPlaceholder: "Enter your institution name",
    regGradeLabel: "Academic Stream / Grade",
    regGradeMiddle: "Secondary (Classes 6-8)",
    regGradeHigh: "Higher Secondary (Classes 9-12)",
    regGradeUndergrad: "Polytechnic / Diploma / College",
    regSubjectLabel: "Preferred Subject Focus",
    regSubjectMath: "Core Academic Studies",
    regSubmitButton: "Access My Workspace",

    // Dashboard Page
    dashWelcome: "Welcome back, ",
    dashIntro: "Here is your study overview and concept learning summary for today.",
    dashQuickStats: "Your Learning Overview",
    dashStudyMin: "Study Minutes",
    dashNotesSaved: "Notes Saved",
    dashDoubtsResolved: "Doubts Clarified",
    dashQuizzesCleared: "Quizzes Practiced",
    dashProgressTitle: "Syllabus Progress",
    dashProgressLevel: "Level",
    dashDailyAdviceTitle: "💡 Daily Study Advice",
    dashDailyAdviceText: "Consistency is key in exams! Practicing core concepts and reviewing solved question papers daily solidifies conceptual clarity and problem-solving speed.",
    dashMinutesSpent: "min spent",

    // Notes Manager Page
    notesLibraryTitle: "Study Notes Library",
    notesWriteBtn: "Write Study Note",
    notesTitleInputLabel: "Study Note Title",
    notesTitlePlaceholder: "e.g., Understanding Differential Equations",
    notesContentInputLabel: "Detailed Theory & Formula Content",
    notesContentPlaceholder: "Write your detailed definitions, formulas, or theorems here...",
    notesSubmitNewNote: "Save Study Note",
    notesCancelBtn: "Cancel",
    notesWriteNoteHeader: "Write a New Study Note",
    notesTagsLabel: "Tags (comma separated)",
    notesTagsPlaceholder: "e.g., Mathematics, Physics, Chemistry",
    notesSelectNoteFirst: "Select a Study Note to Begin",
    notesClickToRead: "Choose a curated study note from the left panel to review flashcards and key concept points.",
    notesEnterCustomNote: "You can also write your own study notes, and the platform will organize key takeaways for easy exam revision!",

    // Notes Tabs
    tabRead: "Read Full Note",
    tabSummary: "Key Summary",
    tabFlashcards: "Revision Flashcards",
    tabQuiz: "Concept Quiz",

    // Tab Details
    summaryEmpty: "No key summary points added yet.",
    summaryPointCount: "Core concept summary points:",
    flashcardFlipHint: "💡 Click the card above to flip and reveal the answer!",
    flashcardPrevBtn: "Previous",
    flashcardNextBtn: "Next",
    flashcardCompleteState: "🎉 Great job! You have reviewed all flashcards for this topic.",
    quizHeader: "Test Your Concept Understanding",
    quizSelectOption: "Select your answer:",
    quizCheckAnswer: "Check Solution",
    quizCorrect: "Correct! 🎉",
    quizIncorrect: "Incorrect. Try again!",
    quizResultScore: "Quiz Completed! Your Score is:",
    quizRetry: "Restart Quiz",

    // Support Chat Page
    chatHeaderTitle: "Direct Teacher & Admin Support",
    chatActiveAgent: "Connected with Teachers",
    chatAssistantHint: "Message directly to teachers or admin for academic queries and guidance.",
    chatAdminActiveBadge: "Faculty Active",
    chatInputPlaceholder: "Type your academic question or doubt here...",
    chatSendBtn: "Send",
    chatWelcomeMessage: "Hello! Welcome to the Direct Academic Support Portal. Ask any question to teachers or admin, and we will guide you step by step."
  },
  bn: {
    brandName: "স্টাডি হাব",
    selectLanguage: "ভাষা / Language",
    signOut: "লগ আউট",
    registeredStudent: "নিবন্ধিত শিক্ষার্থী",
    adminNotice: "নিবন্ধিত প্রশাসক মোড",
    workspaceGlow: "শিক্ষা কার্যক্ষেত্রে প্রবেশ করুন",
    stableSystem: "সিস্টেম সক্রিয়",
    devPlatform: "অফিসিয়াল একাডেমি পোর্টাল",
    backToLibrary: "লাইব্রেরিতে ফিরে যান",

    // Welcome Page
    welcomeSubtitle: "আধুনিক শিক্ষা ও বোর্ড পরীক্ষার সেরা প্রস্তুতি",
    welcomeTitlePrefix: "পড়াশোনায় এগিয়ে থাকুন ",
    welcomeTitleAccent: "স্টাডি হাব-এর সাথে",
    welcomeStartButton: "শিক্ষা পোর্টালে প্রবেশ করুন",
    secureSessionNotice: "🔒 নিরাপদ ও অফিশিয়াল শিক্ষা প্ল্যাটফর্ম",
    mathSubject: "বিজ্ঞান ও গণিত",
    aiSummaries: "অধ্যায় সংক্ষেপ",
    quizPrep: "অনুশীলন ও রিভিশন",

    // Registration Page
    regTitle: "শিক্ষার্থী রেজিস্ট্রেশন",
    regSubtitle: "আপনার স্টুডেন্ট অ্যাকাউন্ট চালু করতে নিচের প্রয়োজনীয় তথ্যগুলো পূরণ করুন।",
    regFullNameLabel: "সম্পূর্ণ নাম *",
    regFullNamePlaceholder: "আপনার পুরো নাম লিখুন",
    regEmailLabel: "ইমেইল ঠিকানা *",
    regEmailPlaceholder: "name@example.com",
    regAgeLabel: "বয়স *",
    regAgePlaceholder: "আপনার বয়স লিখুন",
    regInstitutionLabel: "বিদ্যালয় / কলেজ / ইনস্টিটিউটের নাম *",
    regInstitutionPlaceholder: "আপনার শিক্ষা প্রতিষ্ঠানের নাম লিখুন",
    regGradeLabel: "বর্তমান শ্রেণি বা বিভাগ",
    regGradeMiddle: "মাধ্যমিক স্তর (ষষ্ঠ - দশম শ্রেণি)",
    regGradeHigh: "উচ্চমাধ্যমিক (একাদশ - দ্বাদশ শ্রেণি)",
    regGradeUndergrad: "পলিটেকনিক / ডিপ্লোমা / কলেজ",
    regSubjectLabel: "পড়াশোনার প্রধান বিভাগ",
    regSubjectMath: "সাধারণ ও কারিগরি শিক্ষা",
    regSubmitButton: "আমার পোর্টালে প্রবেশ করুন",

    // Dashboard Page
    dashWelcome: "স্বাগতম, ",
    dashIntro: "আজকের পড়াশোনার সারসংক্ষেপ ও রুটিন নিচে দেওয়া হলো।",
    dashQuickStats: "আপনার পড়াশোনার হিসাব",
    dashStudyMin: "অধ্যয়নের সময় (মিনিট)",
    dashNotesSaved: "সংরক্ষিত নোটস",
    dashDoubtsResolved: "সমাধানকৃত সংশয়",
    dashQuizzesCleared: "অনুশীলন সম্পন্ন",
    dashProgressTitle: "সিলেবাস সমাপ্তির অগ্রগতি",
    dashProgressLevel: "ধাপ",
    dashDailyAdviceTitle: "💡 শিক্ষকের দৈনিক পরামর্শ",
    dashDailyAdviceText: "পরীক্ষায় ভালো ফলের মূল চাবিকাঠি হলো নিয়মিত রিভিশন ও বিগত বছরের প্রশ্ন সমাধান করা। প্রতিদিন অন্তত এক ঘণ্টা গুরুত্বপূর্ণ সূত্র ও কনসেপ্টগুলো খাতায় লিখে অভ্যাস করুন।",
    dashMinutesSpent: "মিনিট ব্যয়িত",

    // Notes Manager Page
    notesLibraryTitle: "স্টাডি নোটস লাইব্রেরি",
    notesWriteBtn: "নতুন নোট লিখুন",
    notesTitleInputLabel: "নোটের বিষয় বা শিরোনাম",
    notesTitlePlaceholder: "যেমন: তাপগতিবিদ্যার প্রথম সূত্র ও উদাহরণ",
    notesContentInputLabel: "তত্ত্ব, সূত্র ও বিস্তারিত ব্যাখ্যা",
    notesContentPlaceholder: "আপনার ক্লাসের লেকচার, বইয়ের সূত্র বা নোট এখানে গুছিয়ে লিখুন...",
    notesSubmitNewNote: "নোট সংরক্ষণ করুন",
    notesCancelBtn: "বাতিল করুন",
    notesWriteNoteHeader: "নতুন স্টাডি নোট তৈরি",
    notesTagsLabel: "বিষয় / ট্যাগ (কমা দিয়ে আলাদা করুন)",
    notesTagsPlaceholder: "যেমন: গণিত, পদার্থবিদ্যা, রসায়ন",
    notesSelectNoteFirst: "পড়ার জন্য লাইব্রেরি থেকে একটি নোট বেছে নিন",
    notesClickToRead: "বাম প্যানেলের লাইব্রেরি থেকে যেকোনো স্টাডি নোট বেছে নিয়ে গুরুত্বপূর্ণ পয়েন্ট ও রিভিশন ফ্ল্যাশকার্ড পর্যালোচনা করুন।",
    notesEnterCustomNote: "প্রয়োজনীয় ক্লাসনোট গুছিয়ে রাখুন যা পরীক্ষার আগে দ্রুত রিভিশন দিতে সাহায্য করবে!",

    // Notes Tabs
    tabRead: "সম্পূর্ণ নোট পড়ুন",
    tabSummary: "মূল সারসংক্ষেপ",
    tabFlashcards: "রিভিশন ফ্ল্যাশকার্ড",
    tabQuiz: "কনসেপ্ট কুইজ",

    // Tab Details
    summaryEmpty: "এই নোটের জন্য কোনো সারসংক্ষেপ পয়েন্ট যোগ করা হয়নি।",
    summaryPointCount: "অধ্যায়ের মূল পয়েন্টসমূহ:",
    flashcardFlipHint: "💡 উত্তর দেখতে কার্ডটিতে ক্লিক করে উল্টে নিন!",
    flashcardPrevBtn: "পূর্ববর্তী",
    flashcardNextBtn: "পরবর্তী",
    flashcardCompleteState: "🎉 চমৎকার! আপনি এই টপিকের সবগুলো রিভিশন কার্ড সম্পন্ন করেছেন।",
    quizHeader: "অধ্যায়ের ধারণা যাচাই পরীক্ষা",
    quizSelectOption: "সঠিক উত্তর নির্বাচন করুন:",
    quizCheckAnswer: "উত্তর যাচাই করুন",
    quizCorrect: "সঠিক উত্তর! 🎉",
    quizIncorrect: "ভুল উত্তর। আবার চেষ্টা করুন!",
    quizResultScore: "অনুশীলন সম্পন্ন হয়েছে! আপনার প্রাপ্ত নম্বর:",
    quizRetry: "পুনরায় পরীক্ষা দিন",

    // Support Chat Page
    chatHeaderTitle: "শিক্ষক ও অ্যাডমিন সহায়তা ডেস্ক",
    chatActiveAgent: "শিক্ষকদের সাথে সরাসরি যুক্ত",
    chatAssistantHint: "যেকোনো অ্যাকাডেমিক জিজ্ঞাসা বা বিষয়ের সহায়তার জন্য মেসেজ পাঠান।",
    chatAdminActiveBadge: "শিক্ষক সক্রিয়",
    chatInputPlaceholder: "আপনার পড়াশোনার প্রশ্ন বা সমস্যা এখানে লিখুন...",
    chatSendBtn: "পাঠান",
    chatWelcomeMessage: "নমস্কার! স্টাডি হাব অফিশিয়াল সহায়তা কেন্দ্রে স্বাগতম। আপনার যেকোনো পড়াশোনার প্রশ্ন এখানে লিখুন, শিক্ষকগণ আপনাকে বুঝিয়ে দেবেন।"
  }
};

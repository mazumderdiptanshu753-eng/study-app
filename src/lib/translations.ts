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
    stableSystem: "SYS_STABLE_UP",
    devPlatform: "DEV_PLATFORM",
    backToLibrary: "Back to Library",

    // Welcome Page
    welcomeSubtitle: "Empowering Your Mathematics Studies",
    welcomeTitlePrefix: "Master Mathematics With ",
    welcomeTitleAccent: "STUDY HUB",
    welcomeStartButton: "Enter Academic Workspace",
    secureSessionNotice: "🔒 Standard local and secure session storage",
    mathSubject: "Mathematics",
    aiSummaries: "AI Summaries",
    quizPrep: "Quiz Prep",

    // Registration Page
    regTitle: "Create Account & Register",
    regSubtitle: "Please provide your details below to activate your personal workspace.",
    regFullNameLabel: "Full Name *",
    regFullNamePlaceholder: "Enter your full name",
    regEmailLabel: "Email Address *",
    regEmailPlaceholder: "name@example.com",
    regAgeLabel: "Age *",
    regAgePlaceholder: "Enter your age",
    regInstitutionLabel: "School/College Name *",
    regInstitutionPlaceholder: "Enter your institution name",
    regGradeLabel: "Academic Grade Level",
    regGradeMiddle: "Middle School (Classes 6-8)",
    regGradeHigh: "High School (Classes 9-12)",
    regGradeUndergrad: "Undergraduate / College",
    regSubjectLabel: "Preferred Learning Focus",
    regSubjectMath: "Advanced Mathematics",
    regSubmitButton: "Access My Workspace",

    // Dashboard Page
    dashWelcome: "Welcome back, ",
    dashIntro: "Here is your mathematical concept learning summary for today.",
    dashQuickStats: "Your Core Metrics",
    dashStudyMin: "Study Minutes",
    dashNotesSaved: "Notes Saved",
    dashDoubtsResolved: "Doubts Resolved",
    dashQuizzesCleared: "Quizzes Cleared",
    dashProgressTitle: "Syllabus Mastery Progress",
    dashProgressLevel: "Level",
    dashDailyAdviceTitle: "💡 Daily Learning Insight",
    dashDailyAdviceText: "Consistency is key in mathematics! Solving even 1-2 integration or linear algebra practice problems daily stimulates geometric intuition and logical memory paths.",
    dashMinutesSpent: "min spent",

    // Notes Manager Page
    notesLibraryTitle: "Mathematics Study Library",
    notesWriteBtn: "Write Custom Note",
    notesTitleInputLabel: "Study Note Title",
    notesTitlePlaceholder: "e.g., Understanding Fourier Transforms",
    notesContentInputLabel: "Detailed Theory Content",
    notesContentPlaceholder: "Type your detailed mathematical definitions, formulas, or theorems here...",
    notesSubmitNewNote: "Compile & Save Note",
    notesCancelBtn: "Cancel",
    notesWriteNoteHeader: "Write a New Study Note",
    notesTagsLabel: "Tags (comma separated)",
    notesTagsPlaceholder: "e.g., Geometry, Calculus, Proofs",
    notesSelectNoteFirst: "Select a Study Note to Begin",
    notesClickToRead: "Choose a curated mathematical concept from the library left panel to generate flashcards and AI study notes instantly.",
    notesEnterCustomNote: "You can also write your own mathematical notes, and the platform will automatically parse key summaries for interactive retention!",

    // Notes Tabs
    tabRead: "Read Concept",
    tabSummary: "AI Bullet Summary",
    tabFlashcards: "Interactive Flashcards",
    tabQuiz: "Quiz Practice",

    // Tab Details
    summaryEmpty: "No dynamic summaries generated yet. Add summary points to view.",
    summaryPointCount: "Core summary bullet points generated:",
    flashcardFlipHint: "💡 Click the card above to flip and reveal the answer!",
    flashcardPrevBtn: "Previous",
    flashcardNextBtn: "Next",
    flashcardCompleteState: "🎉 Excellent job! You've reviewed all flashcards for this concept.",
    quizHeader: "Test Your Concept Understanding",
    quizSelectOption: "Select your answer:",
    quizCheckAnswer: "Check Solution",
    quizCorrect: "Correct! 🎉",
    quizIncorrect: "Incorrect. Try again!",
    quizResultScore: "Quiz Completed! Your Score is:",
    quizRetry: "Restart Quiz",

    // Support Chat Page
    chatHeaderTitle: "Academic Support Center",
    chatActiveAgent: "Connected with Support Bot & Admins",
    chatAssistantHint: "Ask the administrators for assistance, feature support, or custom study feedback.",
    chatAdminActiveBadge: "Admin Active",
    chatInputPlaceholder: "Type a study doubt or support request here...",
    chatSendBtn: "Send",
    chatWelcomeMessage: "Hello! Welcome to the STUDY HUB Support Portal. Ask any academic questions or request help, and our support assistant and system administrators will help you immediately."
  },
  bn: {
    brandName: "স্টাডি হাব",
    selectLanguage: "ভাষা / Language",
    signOut: "লগ আউট",
    registeredStudent: "নিবন্ধিত শিক্ষার্থী",
    adminNotice: "নিবন্ধিত প্রশাসক মোড",
    workspaceGlow: "শিক্ষা কার্যক্ষেত্রে প্রবেশ করুন",
    stableSystem: "সিস্টেম সক্রিয়",
    devPlatform: "ডেভ প্লাটফর্ম",
    backToLibrary: "লাইব্রেরিতে ফিরে যান",

    // Welcome Page
    welcomeSubtitle: "আপনার গণিত শিক্ষাকে সহজ ও সমৃদ্ধ করুন",
    welcomeTitlePrefix: "গণিত শিখুন সহজে ",
    welcomeTitleAccent: "স্টাডি হাব-এর সাথে",
    welcomeStartButton: "শিক্ষা কার্যক্ষেত্রে প্রবেশ করুন",
    secureSessionNotice: "🔒 স্ট্যান্ডার্ড লোকাল এবং নিরাপদ সেশন স্টোরেজ",
    mathSubject: "গণিতশাস্ত্র",
    aiSummaries: "এআই সারাংশ",
    quizPrep: "কুইজ প্রস্তুতি",

    // Registration Page
    regTitle: "অ্যাকাউন্ট তৈরি করুন ও রেজিস্টার করুন",
    regSubtitle: "আপনার ব্যক্তিগত শিক্ষাক্ষেত্র সক্রিয় করতে নিচে আপনার বিবরণ প্রদান করুন।",
    regFullNameLabel: "সম্পূর্ণ নাম *",
    regFullNamePlaceholder: "আপনার পুরো নাম লিখুন",
    regEmailLabel: "ইমেল ঠিকানা *",
    regEmailPlaceholder: "name@example.com",
    regAgeLabel: "বয়স *",
    regAgePlaceholder: "আপনার বয়স লিখুন",
    regInstitutionLabel: "স্কুল/কলেজের নাম *",
    regInstitutionPlaceholder: "আপনার প্রতিষ্ঠানের নাম লিখুন",
    regGradeLabel: "শিক্ষাগত গ্রেড লেভেল",
    regGradeMiddle: "মিডল স্কুল (ষষ্ঠ - অষ্টম শ্রেণী)",
    regGradeHigh: "হাই স্কুল (নবম - দ্বাদশ শ্রেণী)",
    regGradeUndergrad: "স্নাতক / কলেজ লেভেল",
    regSubjectLabel: "পছন্দের লার্নিং ফোকাস",
    regSubjectMath: "উচ্চতর গণিতশাস্ত্র (Advanced Math)",
    regSubmitButton: "আমার ড্যাশবোর্ডে প্রবেশ করুন",

    // Dashboard Page
    dashWelcome: "স্বাগতম, ",
    dashIntro: "আজকের জন্য আপনার গাণিতিক ধারণার শিক্ষার সংক্ষিপ্ত সারাংশ নিচে দেওয়া হলো।",
    dashQuickStats: "আপনার মূল কর্মদক্ষতা",
    dashStudyMin: "অধ্যয়নের সময় (মিনিট)",
    dashNotesSaved: "সংরক্ষিত নোটস",
    dashDoubtsResolved: "সমাধানকৃত সন্দেহ",
    dashQuizzesCleared: "সম্পন্ন কুইজ",
    dashProgressTitle: "সিলেবাস আয়ত্তের অগ্রগতি",
    dashProgressLevel: "ধাপ",
    dashDailyAdviceTitle: "💡 দৈনিক শিক্ষার পরামর্শ",
    dashDailyAdviceText: "গণিত শেখার মূল চাবিকাঠি হলো ধারাবাহিকতা! প্রতিদিন মাত্র ১-২টি ইন্টিগ্রেশন বা রৈখিক বীজগণিতের (linear algebra) সমস্যা সমাধান করলে আপনার গাণিতিক অন্তর্দৃষ্টি এবং যৌক্তিক স্মৃতিশক্তি বৃদ্ধি পাবে।",
    dashMinutesSpent: "মিনিট ব্যয়িত",

    // Notes Manager Page
    notesLibraryTitle: "গণিত অধ্যয়ন লাইব্রেরি",
    notesWriteBtn: "নতুন নোট লিখুন",
    notesTitleInputLabel: "অধ্যয়ন নোটের শিরোনাম",
    notesTitlePlaceholder: "যেমন: ফুরিয়ার ট্রান্সফর্মের সহজ ব্যাখ্যা",
    notesContentInputLabel: "বিস্তারিত তত্ত্ব ও সূত্রসমূহ",
    notesContentPlaceholder: "আপনার বিস্তারিত গাণিতিক সংজ্ঞা, সূত্র বা উপপাদ্য এখানে লিখুন...",
    notesSubmitNewNote: "সংকলন ও নোট সংরক্ষণ করুন",
    notesCancelBtn: "বাতিল করুন",
    notesWriteNoteHeader: "একটি নতুন অধ্যয়ন নোট লিখুন",
    notesTagsLabel: "ট্যাগসমূহ (কমা দিয়ে আলাদা করুন)",
    notesTagsPlaceholder: "যেমন: জ্যামিতি, ক্যালকুলাস, উপপাদ্য",
    notesSelectNoteFirst: "শুরু করতে একটি অধ্যয়ন নোট নির্বাচন করুন",
    notesClickToRead: "বাম প্যানেলের লাইব্রেরি থেকে একটি কিউরেটেড গাণিতিক ধারণা নির্বাচন করুন যাতে তাত্ক্ষণিকভাবে ফ্ল্যাশকার্ড, এআই অধ্যয়ন নোট এবং কুইজ তৈরি করা যায়।",
    notesEnterCustomNote: "আপনি আপনার নিজের গাণিতিক নোটও লিখতে পারেন, এবং সিস্টেম স্বয়ংক্রিয়ভাবে ইন্টারেক্টিভ অনুশীলনের জন্য গুরুত্বপূর্ণ সারাংশ তৈরি করবে!",

    // Notes Tabs
    tabRead: "ধারণা পাঠ করুন",
    tabSummary: "এআই সারাংশ পয়েন্ট",
    tabFlashcards: "ইন্টারেক্টিভ ফ্ল্যাশকার্ড",
    tabQuiz: "কুইজ অনুশীলন",

    // Tab Details
    summaryEmpty: "কোনো গতিশীল সারাংশ তৈরি করা হয়নি। দেখতে আরও তথ্য যোগ করুন।",
    summaryPointCount: "উৎপন্ন মূল সারাংশ পয়েন্টসমূহ:",
    flashcardFlipHint: "💡 উত্তর দেখতে উপরের কার্ডটিতে ক্লিক করে উল্টে দিন!",
    flashcardPrevBtn: "পূর্ববর্তী",
    flashcardNextBtn: "পরবর্তী",
    flashcardCompleteState: "🎉 চমৎকার কাজ! আপনি এই ধারণার সমস্ত ফ্ল্যাশকার্ড পর্যালোচনা করেছেন।",
    quizHeader: "আপনার ধারণা বোঝার পরীক্ষা করুন",
    quizSelectOption: "আপনার উত্তর নির্বাচন করুন:",
    quizCheckAnswer: "উত্তর যাচাই করুন",
    quizCorrect: "সঠিক উত্তর! 🎉",
    quizIncorrect: "ভুল উত্তর। আবার চেষ্টা করুন!",
    quizResultScore: "কুইজ সম্পন্ন হয়েছে! আপনার স্কোর হলো:",
    quizRetry: "কুইজ পুনরায় শুরু করুন",

    // Support Chat Page
    chatHeaderTitle: "শিক্ষায়তনিক সহায়তা কেন্দ্র",
    chatActiveAgent: "সহায়তা বট এবং প্রশাসকদের সাথে সংযুক্ত",
    chatAssistantHint: "সহায়তা, নতুন বৈশিষ্ট্য বা কাস্টম অধ্যয়নের মতামতের জন্য প্রশাসকদের জিজ্ঞাসা করুন।",
    chatAdminActiveBadge: "প্রশাসক সক্রিয়",
    chatInputPlaceholder: "আপনার প্রশ্ন বা সহায়তার অনুরোধ এখানে লিখুন...",
    chatSendBtn: "পাঠান",
    chatWelcomeMessage: "হ্যালো! স্টাডি হাব সহায়তা পোর্টালে আপনাকে স্বাগতম। যেকোনো শিক্ষাগত প্রশ্ন জিজ্ঞাসা করুন বা সাহায্যের অনুরোধ করুন, এবং আমাদের সহকারী বট এবং সিস্টেম প্রশাসকেরা আপনাকে অবিলম্বে সহায়তা করবে।"
  }
};

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  GraduationCap, 
  BookOpen, 
  Search, 
  Copy, 
  Check, 
  Award, 
  FileText, 
  Calculator, 
  ChevronRight, 
  Download, 
  Heart, 
  Sparkles, 
  Star, 
  Eye, 
  BookMarked,
  Layers,
  FileCheck,
  Zap,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  Printer,
  X,
  ArrowLeft,
  Trash2,
  Upload
} from "lucide-react";
import { Language } from "../lib/translations";
import { ThemeConfig } from "../lib/themes";
import { db } from "../lib/firebase";
import { collection, doc, addDoc, getDocs, deleteDoc, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { class9Subjects } from "../data/class9Data";
import { class10Subjects } from "../data/class10Data";
import { StudentProfile, BoardPrepPaper } from "../types";

interface SchoolSectionProps {
  lang: Language;
  theme: ThemeConfig;
  onNavigate?: (tab: string) => void;
  profile?: StudentProfile | null;
}

// Static database of School Notes, PYQs, Syllabi, suggestions, and formulas
interface ChapterNote {
  id: string;
  chapterNameEn: string;
  chapterNameBn: string;
  summaryEn: string;
  summaryBn: string;
  keyPointsEn: string[];
  keyPointsBn: string[];
}

interface SubjectData {
  id: string;
  nameEn: string;
  nameBn: string;
  icon: string;
  chapters: ChapterNote[];
}

interface PYQData {
  id: string;
  subjectEn: string;
  subjectBn: string;
  year: number;
  board: string;
  questions: {
    qEn: string;
    qBn: string;
    marks: number;
    answerEn?: string;
    answerBn?: string;
  }[];
}

interface SyllabusTopic {
  topicEn: string;
  topicBn: string;
  marks: number;
  chapters: string[];
}

interface SuggestionItem {
  id: string;
  subjectEn: string;
  subjectBn: string;
  type: "short" | "long" | "mcq";
  qEn: string;
  qBn: string;
  importance: "high" | "very-high" | "critical";
  hintEn?: string;
  hintBn?: string;
}

interface FormulaItem {
  id: string;
  subject: "math" | "physics" | "chemistry";
  topicEn: string;
  topicBn: string;
  nameEn: string;
  nameBn: string;
  formula: string;
  explanationEn: string;
  explanationBn: string;
  exampleEn?: string;
  exampleBn?: string;
}

// SAMPLE DATA
const SUBJECTS_DATA: Record<string, SubjectData[]> = {
  "9": class9Subjects,
  "10": class10Subjects,
  "11": [
    {
      id: "math",
      nameEn: "Mathematics",
      nameBn: "গণিত",
      icon: "📐",
      chapters: [
        {
          id: "sets",
          chapterNameEn: "Sets and Functions",
          chapterNameBn: "সেট তত্ত্ব ও অপেক্ষক",
          summaryEn: "Study of sets, representations, subsets, power sets, Venn diagrams, operations on sets, and mapping functions.",
          summaryBn: "সেটের ধারণা, উপস্থাপন পদ্ধতি, উপসেট, পাওয়ার সেট, ভেন চিত্র, সেটের প্রক্রিয়া এবং অপেক্ষকের ম্যাপিং।",
          keyPointsEn: [
            "A set is a well-defined collection of distinct objects.",
            "De Morgan's Laws: (A ∪ B)' = A' ∩ B' and (A ∩ B)' = A' ∪ B'",
            "Functions map elements from domain to co-domain uniquely."
          ],
          keyPointsBn: [
            "সেট হল সুনির্দিষ্টভাবে সংজ্ঞায়িত ভিন্ন ভিন্ন বস্তুর সংকলন।",
            "ডি মর্গ্যানের সূত্র: (A ∪ B)' = A' ∩ B' এবং (A ∩ B)' = A' ∪ B'",
            "অপেক্ষক ডোমেন থেকে কো-ডোমেনে প্রতিটি উপাদানকে অনন্যভাবে ম্যাপ করে।"
          ]
        },
        {
          id: "complex-numbers",
          chapterNameEn: "Complex Numbers",
          chapterNameBn: "জটিল সংখ্যা",
          summaryEn: "Understanding imaginary numbers, standard form a + ib, conjugates, modulus, and argument.",
          summaryBn: "কাল্পনিক সংখ্যা i = √(-১), জটিল সংখ্যার সাধারণ আকার a + ib, মডুলাস ও অ্যামপ্লিচিউড নির্ণয়।",
          keyPointsEn: [
            "i^2 = -1, i^3 = -i, i^4 = 1.",
            "Modulus of z = a + ib is |z| = √(a^2 + b^2).",
            "Conjugate of z = a + ib is z' = a - ib."
          ],
          keyPointsBn: [
            "i^২ = -১, i^৩ = -i, i^৪ = ১।",
            "z = a + ib জটিল সংখ্যার মডুলাস হল |z| = √(a^২ + b^২)।",
            "z = a + ib জটিল সংখ্যার অনুবন্ধী সংখ্যা হল z' = a - ib।"
          ]
        },
        {
          id: "sequence-series-11",
          chapterNameEn: "Sequence and Series",
          chapterNameBn: "প্রগতি ও শ্রেণী",
          summaryEn: "Arithmetic Progression (AP) and Geometric Progression (GP), finding general terms and sum of n terms.",
          summaryBn: "সমান্তর প্রগতি (AP) এবং গুণোত্তর প্রগতি (GP) এর সাধারণ পদ ও প্রথম n পদের সমষ্টি নির্ণয়।",
          keyPointsEn: [
            "Arithmetic Progression n-th term: t_n = a + (n-1)d. Sum of n terms: S_n = (n/2)[2a + (n-1)d].",
            "Geometric Progression n-th term: t_n = a * r^(n-1). Sum of n terms: S_n = a(r^n - 1)/(r - 1) for r > 1.",
            "Arithmetic Mean (AM) >= Geometric Mean (GM) for positive real numbers."
          ],
          keyPointsBn: [
            "সমান্তর প্রগতির n-তম পদ: t_n = a + (n-১)d; সমষ্টি: S_n = (n/২)[২a + (n-১)d]।",
            "গুণোত্তর প্রগতির n-তম পদ: t_n = a * r^(n-১); সমষ্টি: S_n = a(r^n - ১)/(r - ১) যেখানে r > ১।",
            "ধনাত্মক বাস্তব সংখ্যার ক্ষেত্রে সমান্তরীয় মধ্যক (AM) সর্বদা গুণোত্তরীয় মধ্যক (GM) অপেক্ষা বড় বা সমান।"
          ]
        }
      ]
    },
    {
      id: "physics",
      nameEn: "Physics",
      nameBn: "পদার্থবিদ্যা",
      icon: "🔬",
      chapters: [
        {
          id: "kinematics",
          chapterNameEn: "Kinematics",
          chapterNameBn: "একমাত্রিক গতি",
          summaryEn: "Analysis of motion in a straight line, equations of motion, speed, velocity, acceleration, and relative velocity.",
          summaryBn: "সরলরেখায় গতি, গতির সমীকরণসমূহ, দ্রুতি, বেগ, ত্বরণ এবং আপেক্ষিক বেগের গাণিতিক ব্যাখ্যা।",
          keyPointsEn: [
            "Equations of motion: v = u + at, s = ut + 0.5*at², v² = u² + 2as",
            "Distance is scalar; displacement is vector.",
            "Acceleration is the rate of change of velocity."
          ],
          keyPointsBn: [
            "গতির সমীকরণ: v = u + at, s = ut + ০.৫*at², v² = u² + ২as",
            "অতিক্রান্ত দূরত্ব স্কেলার রাশি; সরণ ভেক্টর রাশি।",
            "সময়ের সাপেক্ষে বেগের পরিবর্তনের হারকেই ত্বরণ বলে।"
          ]
        },
        {
          id: "laws-of-motion",
          chapterNameEn: "Newton's Laws of Motion",
          chapterNameBn: "নিউটনের গতিসূত্রাবলী",
          summaryEn: "Inertia, force, momentum, Newton's three laws of motion, and conservation of linear momentum.",
          summaryBn: "জাড্য ধর্ম, বলের সংজ্ঞা, ভরবেগ, নিউটনের তিনটি গতিসূত্র এবং রৈখিক ভরবেগের সংরক্ষণ সূত্র।",
          keyPointsEn: [
            "First Law: Defines inertia and force. Second Law: F = ma.",
            "Third Law: To every action there is an equal and opposite reaction.",
            "Momentum is product of mass and velocity (p = mv)."
          ],
          keyPointsBn: [
            "প্রথম সূত্র থেকে জাড্য ধর্ম এবং বলের পরিমাপহীন ধারণা পাওয়া যায়। দ্বিতীয় সূত্র: F = ma।",
            "তৃতীয় সূত্র: প্রত্যেক ক্রিয়ারই সমান ও বিপরীত প্রতিক্রিয়া আছে।",
            "ভরবেগ হল ভর ও বেগের গুণফল (p = mv)।"
          ]
        },
        {
          id: "work-energy-power-11",
          chapterNameEn: "Work, Energy and Power",
          chapterNameBn: "কার্য, ক্ষমতা ও শক্তি",
          summaryEn: "Work done by constant/variable force, kinetic and potential energy, work-energy theorem, and conservation of mechanical energy.",
          summaryBn: "স্থির ও পরিবর্তনশীল বল দ্বারা কৃতকার্য, গতিশক্তি ও স্থিতিশক্তির ধারণা, কার্য-শক্তি উপপাদ্য এবং যান্ত্রিক শক্তির সংরক্ষণ সূত্র।",
          keyPointsEn: [
            "Work done W = F * s * cos(θ). Work is zero if force and displacement are perpendicular.",
            "Kinetic Energy K = 0.5 * m * v². Potential Energy U = m * g * h.",
            "Work-Energy Theorem: Work done by all forces equals the change in kinetic energy."
          ],
          keyPointsBn: [
            "কৃতকার্য W = F * s * cos(θ)। বল এবং সরণ পরস্পর লম্ব হলে কৃতকার্য শূন্য হয়।",
            "গতিশক্তি K = ০.৫ * m * v²; স্থিতিশক্তি U = m * g * h।",
            "কার্য-শক্তি উপপাদ্য: সমস্ত বল দ্বারা কৃতকার্য বস্তুর গতিশক্তির পরিবর্তনের সমান।"
          ]
        }
      ]
    },
    {
      id: "chemistry",
      nameEn: "Chemistry",
      nameBn: "রসায়ন",
      icon: "🧪",
      chapters: [
        {
          id: "basic-concepts",
          chapterNameEn: "Basic Concepts of Chemistry",
          chapterNameBn: "রসায়নের প্রাথমিক ধারণা",
          summaryEn: "Mole concept, empirical and molecular formulas, stoichiometry, and limiting reagents.",
          summaryBn: "মোল ধারণা, স্থূল সংকেত ও আণবিক সংকেত এবং রাসায়নিক সমীকরণ সংক্রান্ত গণনা।",
          keyPointsEn: [
            "One mole of any substance contains 6.022 * 10^23 entities (Avogadro's number).",
            "Molar volume of any ideal gas at STP is 22.4 liters.",
            "Empirical formula represents the simplest whole-number ratio of atoms."
          ],
          keyPointsBn: [
            "যেকোনো পদার্থের এক মোলে ৬.০২২ * ১০^২৩ টি কণা থাকে (অ্যাভোগাড্রো সংখ্যা)।",
            "STP-তে যেকোনো আদর্শ গ্যাসের মোলার আয়তন ২২.৪ লিটার।",
            "স্থূল সংকেত অণুর মধ্যে অবস্থিত পরমাণুগুলির সরলতম অনুপাত প্রকাশ করে।"
          ]
        },
        {
          id: "structure-of-atom-11",
          chapterNameEn: "Structure of Atom",
          chapterNameBn: "পরমাণুর গঠন",
          summaryEn: "Discovery of subatomic particles, Bohr's atomic model, dual nature of matter, Heisenberg's uncertainty principle, and quantum numbers.",
          summaryBn: "পরমাণুর উপাদানসমূহ, বোরের পরমাণু মডেল, পদার্থের দ্বৈত সত্তা, হাইজেনবার্গের অনিশ্চয়তা নীতি এবং কোয়ান্টাম সংখ্যার আলোচনা।",
          keyPointsEn: [
            "Bohr's model: Electrons revolve in stationary orbits where angular momentum is mvr = nh / 2π.",
            "Heisenberg's Uncertainty Principle: It is impossible to determine both position and momentum of an electron simultaneously.",
            "Four quantum numbers: Principal (n), Azimuthal (l), Magnetic (m), and Spin (s) define electron states."
          ],
          keyPointsBn: [
            "বোরের মডেল: ইলেকট্রনগুলি নির্দিষ্ট কক্ষপথে ঘোরে যেখানে কৌণিক ভরবেগ mvr = nh / ২π হয়।",
            "হাইজেনবার্গের অনিশ্চয়তা নীতি: ইলেকট্রনের অবস্থান ও ভরবেগ একই সঙ্গে নির্ভুলভাবে নির্ণয় করা অসম্ভব।",
            "চারটি কোয়ান্টাম সংখ্যা: মুখ্য (n), গৌণ (l), চুম্বকীয় (m) ও ঘূর্ণন (s) ইলেকট্রনের শক্তি ও অবস্থান নির্দেশ করে।"
          ]
        }
      ]
    },
    {
      id: "biology",
      nameEn: "Biology",
      nameBn: "জীববিজ্ঞান",
      icon: "🌿",
      chapters: [
        {
          id: "cell-structure",
          chapterNameEn: "Cell: Structure and Functions",
          chapterNameBn: "কোষ: গঠন ও কাজ",
          summaryEn: "Cell theory, prokaryotic vs eukaryotic cells, cell organelles and plasma membrane structure.",
          summaryBn: "কোষ তত্ত্ব, প্রোক্যারিওটিক ও ইউক্যারিওটিক কোষের তুলনা এবং গুরুত্বপূর্ণ কোষ অঙ্গাণুর আলোচনা।",
          keyPointsEn: [
            "Mitochondria is known as the powerhouse of the cell.",
            "Ribosomes are the sites of protein synthesis.",
            "Fluid Mosaic Model of plasma membrane was proposed by Singer and Nicolson."
          ],
          keyPointsBn: [
            "মাইটোকন্ড্রিয়াকে কোষের শক্তিঘর বলা হয়।",
            "রাইবোজোম কোষে প্রোটিন সংশ্লেষের প্রধান স্থান।",
            "প্লাজما পর্দার ফ্লুইড মোজাইক মডেল সিঙ্গার এবং নিকোলসন প্রস্তাব করেন।"
          ]
        },
        {
          id: "plant-kingdom-11",
          chapterNameEn: "Plant Kingdom",
          chapterNameBn: "উদ্ভিদ রাজ্য",
          summaryEn: "Classification of plants: Algae, Bryophytes, Pteridophytes, Gymnosperms, and Angiosperms.",
          summaryBn: "উদ্ভিদ জগতের শ্রেণীবিন্যাস: শৈবাল, ব্রায়োফাইটা বা শ্যাওলা, টেরিডোফাইটা বা ফার্ন, ব্যক্তজীবী ও গুপ্তজীবী উদ্ভিদ।",
          keyPointsEn: [
            "Bryophytes are called amphibians of the plant kingdom because they require water for fertilization.",
            "Pteridophytes are the first terrestrial vascular plants.",
            "Gymnosperms produce naked seeds while Angiosperms produce seeds enclosed within fruits."
          ],
          keyPointsBn: [
            "ব্রায়োফাইটদের উদ্ভিদ রাজ্যের উভচর বলা হয় কারণ তাদের নিষেক প্রক্রিয়ার জন্য জলের প্রয়োজন হয়।",
            "টেরিডোফাইট হল প্রথম স্থলজ সংবহনকলাযুক্ত উদ্ভিদ।",
            "ব্যক্তজীবী উদ্ভিদের বীজ অনাবৃত থাকে এবং গুপ্তজীবী উদ্ভিদের বীজ ফলের মধ্যে আবৃত থাকে।"
          ]
        }
      ]
    },
    {
      id: "english",
      nameEn: "English",
      nameBn: "ইংরেজি",
      icon: "📖",
      chapters: [
        {
          id: "leelas-friend",
          chapterNameEn: "Leela's Friend",
          chapterNameBn: "লীলা'স ফ্রেন্ড",
          summaryEn: "Analysis of R.K. Narayan's short story exploring social differences through Sidda and Leela.",
          summaryBn: "আর. কে. নারায়ণ রচিত গল্পে সিদ্দা ও লীলার নিষ্পাপ বন্ধুত্বের ট্র্যাজেডি এবং সামাজিক বৈষম্য বিশ্লেষণ।",
          keyPointsEn: [
            "Sidda is employed as a servant in Sivasanker's household.",
            "Leela develops deep trust and plays with Sidda daily.",
            "Sidda is falsely accused of stealing Leela's gold chain, exposing class prejudice."
          ],
          keyPointsBn: [
            "সিদ্দা শিবশঙ্করের পরিবারে একজন গৃহভৃত্য হিসেবে কাজে যোগ দেয়।",
            "লীলা সিদ্দার প্রতি গভীর বিশ্বাস ও সখ্যতা গড়ে তোলে।",
            "লীলার সোনার চেন চুরির মিথ্যা অপবাদ সিদ্দার উপর দেওয়া হয়, যা সামাজিক শ্রেণির নির্মম রূপ দেখায়।"
          ]
        },
        {
          id: "meeting-at-night-11",
          chapterNameEn: "Meeting at Night",
          chapterNameBn: "মিটিং অ্যাট নাইট",
          summaryEn: "Analysis of Robert Browning's love poem depicting the speaker's journey across land and sea to meet his beloved.",
          summaryBn: "রবার্ট ব্রাউনিং রচিত প্রেমের কবিতা যেখানে বক্তা সমস্ত বাধা অতিক্রম করে রাতে তার প্রেমিকার সাথে সাক্ষাৎ করতে যান।",
          keyPointsEn: [
            "The poem is divided into two parts: the journey across the sea, and the walk across the beach/fields.",
            "Sensory imagery like 'gray sea', 'yellow half-moon', 'warm slushy scent' enhances the physical experience.",
            "The quiet scratch and the blue spurt of a lighted match symbolize the intense and secret reunion."
          ],
          keyPointsBn: [
            "কবিতাটি দুটি অংশে বিভক্ত: সমুদ্রের উপর দিয়ে প্রথম যাত্রা এবং সমুদ্র সৈকত ও খেতের মধ্য দিয়ে হেঁটে যাওয়া।",
            "ধূসর সমুদ্র, হলদেটে অর্ধচন্দ্র ও উষ্ণ কাদার গন্ধের মতো সংবেদনশীল চিত্রকল্প মানুষের বাস্তব অনুভূতি প্রকাশ করে।",
            "দিয়াশলাই জ্বালানোর নীল আলো এবং মৃদু আওয়াজ প্রেমিক-প্রেমিকার গোপন ও তীব্র মিলনকে প্রতিফলিত করে।"
          ]
        }
      ]
    },
    {
      id: "bengali",
      nameEn: "Bengali",
      nameBn: "বাংলা",
      icon: "✍️",
      chapters: [
        {
          id: "kartar-bhoot",
          chapterNameEn: "Kartar Bhoot",
          chapterNameBn: "কর্তার ভূত",
          summaryEn: "Analysis of Rabindranath Tagore's satirical allegory about blind traditionalism.",
          summaryBn: "রবীন্দ্রনাথ ঠাকুরের রূপকধর্মী গল্প 'কর্তার ভূত'-এর অন্ধ কুসংস্কার এবং জাতীয় মানসিকতার রাজনৈতিক ব্যাখ্যা।",
          keyPointsEn: [
            "The 'Karta' represents absolute traditional authority governing blindly.",
            "Ghostly regimentation paralyzes critical thinking and progress in the country.",
            "Highlights the necessity of independent awakening against blind dogmatism."
          ],
          keyPointsBn: [
            "এখানে 'কর্তা' বলতে অন্ধ অতীত প্রথা ও রক্ষণশীল শাসনকে রূপক হিসেবে দেখানো হয়েছে।",
            "ভূতগ্রস্ত সমাজ স্বাধীন চিন্তা এবং যুক্তিবাদকে অবদমিত করে রাখে।",
            "গল্পের শেষে স্বাধীন চেতনার উন্মেষ ও অন্ধ কুসংস্কারমুক্ত হওয়ার বার্তা দেওয়া হয়েছে।"
          ]
        },
        {
          id: "dakater-ma-11",
          chapterNameEn: "Dakat-er Ma",
          chapterNameBn: "ডাকাতের মা",
          summaryEn: "Analysis of Satinath Bhaduri's social story portraying a mother's perspective on her robber son's life.",
          summaryBn: "সতীনাথ ভাদুড়ী রচিত গল্প যেখানে একজন ডাকাতের মায়ের মানসিকতা, দারিদ্র্য ও মাতৃত্বের এক করুণ চিত্র প্রকাশ পেয়েছে।",
          keyPointsEn: [
            "The mother is accustomed to her son's long absences and the sudden late-night knocks on the door.",
            "Despite being a robber's mother, she has her own morals and is deeply hurt when the police arrest her son.",
            "The story highlights the harsh social reality and poverty of the lower class."
          ],
          keyPointsBn: [
            "মা তার ছেলের দীর্ঘ অনুপস্থিতি ও গভীর রাতে দরজায় কড়া নাড়ার চিরাচরিত অভ্যাসের সাথে পরিচিত।",
            "ডাকাতের মা হওয়া সত্ত্বেও তার মধ্যে নিজস্ব এক নৈতিকতা কাজ করে এবং ছেলের গ্রেফতারি তাকে ব্যথিত করে।",
            "গল্পটিতে নিম্নবিত্ত মানুষের তীব্র অর্থনৈতিক দারিদ্র্য ও সামাজিক অসহায়তার নিখুঁত প্রকাশ ঘটেছে।"
          ]
        }
      ]
    }
  ],
  "12": [
    {
      id: "math",
      nameEn: "Mathematics",
      nameBn: "গণিত",
      icon: "📐",
      chapters: [
        {
          id: "calculus",
          chapterNameEn: "Calculus (Limits & Continuity)",
          chapterNameBn: "কলনবিদ্যা (সীমা ও সন্ততা)",
          summaryEn: "Introduction to limits, continuous functions, differentiability, first principle of derivative, and applications.",
          summaryBn: "সীমা (Limits), সন্ততা (Continuity), অন্তরকলন যোগ্যতা এবং প্রাথমিক সূত্রের সাহায্যে অবকলন করার কৌশল।",
          keyPointsEn: [
            "Limit describes the behavior of a function near a point.",
            "Derivative is the instantaneous rate of change: dy/dx = lim(h->0) [f(x+h) - f(x)] / h",
            "If a function is differentiable at a point, it must be continuous at that point."
          ],
          keyPointsBn: [
            "সীমা (Limit) একটি নির্দিষ্ট বিন্দুর নিকটে অপেক্ষকের আচরণ বর্ণনা করে।",
            "অবকলন হল তাৎক্ষণিক পরিবর্তনের হার: dy/dx = lim(h->০) [f(x+h) - f(x)] / h",
            "কোনো বিন্দুতে অপেক্ষক অন্তরকলনযোগ্য হলে সেটি অবশ্যই ওই বিন্দুতে সন্তত হবে।"
          ]
        },
        {
          id: "matrices",
          chapterNameEn: "Matrices and Determinants",
          chapterNameBn: "ম্যাট্রিক্স এবং ডিটারমিন্যান্ট",
          summaryEn: "Matrix algebra, types of matrices, determinant properties, Cramer's rule, and inverse of a matrix.",
          summaryBn: "ম্যাট্রিক্সের প্রকারভেদ, বিপরীত ম্যাট্রিক্স নির্ণয়, ক্র্যামার নিয়মে সমীকরণ সমাধান এবং ডিটারমিন্যান্টের ধর্মাবলী।",
          keyPointsEn: [
            "Matrix multiplication is non-commutative in general (AB ≠ BA).",
            "A matrix A has an inverse if and only if determinant |A| ≠ 0.",
            "Cramer's Rule is used to solve a system of linear equations using determinants."
          ],
          keyPointsBn: [
            "ম্যাট্রিক্সের গুণ সাধারণত বিনিময় নিয়ম মেনে চলে না (AB ≠ BA)।",
            "একটি ম্যাট্রিক্সের বিপরীত ম্যাট্রিক্স থাকবে যদি এবং কেবল যদি |A| ≠ ০ হয়।",
            "ক্র্যামার নিয়মের সাহায্যে নির্ণায়কের মাধ্যমে সরল সহসমীকরণ সহজে সমাধান করা যায়।"
          ]
        },
        {
          id: "probability-12",
          chapterNameEn: "Probability",
          chapterNameBn: "সম্ভাবনা তত্ত্ব",
          summaryEn: "Conditional probability, multiplication theorem, independent events, Bayes' theorem, and random variables.",
          summaryBn: "শর্তাধীন সম্ভাবনা, গুণের উপপাদ্য, স্বাধীন ঘটনা, বায়েসের উপপাদ্য এবং সমসম্ভব চলক সংক্রান্ত আলোচনা।",
          keyPointsEn: [
            "Conditional Probability: P(A|B) = P(A ∩ B) / P(B) where P(B) ≠ 0.",
            "Bayes' Theorem: Calculates posterior probability of an event given prior evidence.",
            "Total probability must equal 1, and probability values must be between 0 and 1."
          ],
          keyPointsBn: [
            "শর্তাধীন সম্ভাবনা: P(A|B) = P(A ∩ B) / P(B) যেখানে P(B) ≠ ০।",
            "বায়েসের উপপাদ্য (Bayes' Theorem): পূর্ববর্তী প্রমাণের ওপর ভিত্তি করে ঘটনার সম্ভাবনা নির্ণয় করে।",
            "সম্ভাবনার মোট মান সর্বদা ১ হয় এবং যেকোনো ঘটনার সম্ভাবনা ০ থেকে ১ এর মধ্যে থাকে।"
          ]
        }
      ]
    },
    {
      id: "physics",
      nameEn: "Physics",
      nameBn: "পদার্থবিদ্যা",
      icon: "🔬",
      chapters: [
        {
          id: "electrostatics",
          chapterNameEn: "Electrostatics",
          chapterNameBn: "স্থির তড়িৎবিজ্ঞান",
          summaryEn: "Electric charges, Coulomb's Law, Electric Field, Gauss's Theorem, Electric Potential, and Capacitors.",
          summaryBn: "বৈদ্যুতিক আধান, কুলম্বের সূত্র, তড়িৎক্ষেত্র, গাউসের উপপাদ্য, তড়িৎবিভব এবং ধারকের ধারকত্ব আলোচনা।",
          keyPointsEn: [
            "Coulomb's Law: F = k * |q1 * q2| / r²",
            "Electric Field Intensity E = F / q.",
            "Gauss's Theorem: Total electric flux through a closed surface is Φ = Q_enclosed / ε0.",
            "Capacitance of a parallel plate capacitor: C = ε0 * A / d."
          ],
          keyPointsBn: [
            "কুলম্বের সূত্র: F = k * |q১ * q২| / r²",
            "তড়িৎক্ষেত্রের প্রাবল্য E = F / q।",
            "গাউসের উপপাদ্য: আবদ্ধ তলে মোট তড়িৎ ফ্লাক্স Φ = Q_enclosed / ε০।",
            "সমান্তরাল পাত ধারকের ধারকত্ব: C = ε০ * A / d।"
          ]
        },
        {
          id: "current-elec",
          chapterNameEn: "Current Electricity",
          chapterNameBn: "প্রবাহী তড়িৎ",
          summaryEn: "Ohm's Law, drift velocity, Kirchhoff's Laws, Wheatstone Bridge, and Potentiometer.",
          summaryBn: "ওহমের সূত্র, মুক্ত ইলেকট্রনের তাড়ন বেগ, কির্শফের সূত্রসমূহ, হুইটস্টোন ব্রিজ এবং পটেনশিওমিটারের কার্যনীতি।",
          keyPointsEn: [
            "Kirchhoff's Current Law (KCL) is based on conservation of charge.",
            "Kirchhoff's Voltage Law (KVL) is based on conservation of energy.",
            "Wheatstone Bridge balance condition: P/Q = R/S."
          ],
          keyPointsBn: [
            "কির্শফের প্রথম সূত্র (KCL) আধান সংরক্ষণের ওপর ভিত্তি করে প্রতিষ্ঠিত।",
            "কির্শফের দ্বিতীয় সূত্র (KVL) শক্তি সংরক্ষণের ওপর ভিত্তি করে প্রতিষ্ঠিত।",
            "হুইটস্টোন ব্রিজের সাম্যাবস্থার শর্ত হল: P/Q = R/S।"
          ]
        },
        {
          id: "emi-ac-12",
          chapterNameEn: "Electromagnetic Induction & Alternating Current",
          chapterNameBn: "তড়িৎচুম্বকীয় আবেশ ও পরিবর্তী প্রবাহ",
          summaryEn: "Faraday's Laws, Lenz's Law, self and mutual induction, alternating currents, peak and RMS value, LCR series circuit, and resonance.",
          summaryBn: "ফ্যারাডের সূত্রাবলী, লেঞ্জের সূত্র, স্বাবেশ ও পারস্পরিক আবেশ, পরিবর্তী প্রবাহের শীর্ষ ও আর.এম.এস মান, LCR শ্রেণী বর্তনী এবং অনুনাদ।",
          keyPointsEn: [
            "Lenz's Law is a consequence of the law of conservation of energy.",
            "RMS value of alternating current: I_rms = I_0 / √2.",
            "In an LCR series circuit, resonance occurs when inductive reactance equals capacitive reactance (X_L = X_C)."
          ],
          keyPointsBn: [
            "লেঞ্জের সূত্রটি শক্তি সংরক্ষণ সূত্রের একটি প্রত্যক্ষ রূপ বা রূপান্তর মাত্র।",
            "পরিবর্তী প্রবাহের কার্যকর বা RMS মান: I_rms = I_০ / √২।",
            "LCR শ্রেণী বর্তনীতে যখন আবেশকীয় প্রতিঘাত ও ধারকীয় প্রতিঘাত সমান হয় (X_L = X_C), তখন অনুনাদ ঘটে।"
          ]
        }
      ]
    },
    {
      id: "chemistry",
      nameEn: "Chemistry",
      nameBn: "রসায়ন",
      icon: "🧪",
      chapters: [
        {
          id: "solid-state",
          chapterNameEn: "Solid State Chemistry",
          chapterNameBn: "পদার্থের কঠিন অবস্থা",
          summaryEn: "Classification of solids, crystalline lattices, unit cells, closed packing, and defects in solids.",
          summaryBn: "কঠিন পদার্থের শ্রেণীবিন্যাস, কেলাস জালক, একক কোষে পরমাণু সংখ্যা এবং কেলাসের ত্রুটিসমূহ।",
          keyPointsEn: [
            "Types of unit cells: Simple Cubic, Body-Centered (BCC), Face-Centered (FCC).",
            "Bragg's Law: 2d sin θ = nλ.",
            "Schottky defect decreases density of the crystal; Frenkel defect leaves it unchanged."
          ],
          keyPointsBn: [
            "একক কোষের প্রকার: সরল ঘনকাকার, দেহ-কেন্দ্রিক (BCC), পৃষ্ঠ-কেন্দ্রিক (FCC)।",
            "ব্র্যাগের সূত্র: ২d sin θ = nλ।",
            "শটকি ত্রুটির কারণে কেলাসের ঘনত্ব হ্রাস পায়; ফ্রেনকেল ত্রুটিতে ঘনত্ব অপরিবর্তিত থাকে।"
          ]
        },
        {
          id: "solutions-12",
          chapterNameEn: "Solutions",
          chapterNameBn: "দ্রবণ",
          summaryEn: "Types of solutions, concentration expressions, solubility of gases in liquids (Henry's Law), Raoult's Law, and colligative properties.",
          summaryBn: "দ্রবণের প্রকারভেদ, গাঢ়ত্ব প্রকাশের বিভিন্ন একক, তরলে গ্যাসের দ্রাব্যতা (হেনরীর সূত্র), রাউল্টের সূত্র এবং দ্রবণের সংখ্যাগত ধর্মাবলী।",
          keyPointsEn: [
            "Henry's Law: Solubility of a gas in a liquid is directly proportional to its partial pressure.",
            "Raoult's Law for non-volatile solutes: Relative lowering of vapor pressure equals the mole fraction of the solute.",
            "Colligative properties depend only on the number of solute particles, not their nature (e.g., Osmotic pressure, Elevation of boiling point)."
          ],
          keyPointsBn: [
            "হেনরীর সূত্র: তরলে গ্যাসের দ্রাব্যতা গ্যাসটির আংশিক চাপের সাথে সমানুপাতিক।",
            "অনুদায়ী দ্রাবের ক্ষেত্রে রাউল্টের সূত্র: দ্রবণের বাষ্পচাপের আপেক্ষিক অবমনন দ্রাবের মোল ভগ্নাংশের সমান।",
            "দ্রবণের সংখ্যাগত ধর্মাবলি কেবল দ্রবণে উপস্থিত দ্রাব কণার সংখ্যার ওপর নির্ভর করে, দ্রাবের প্রকৃতির ওপর নয় (যেমন- অভিস্রবণ চাপ, স্ফুটনাঙ্কের উন্নয়ন)।"
          ]
        }
      ]
    },
    {
      id: "biology",
      nameEn: "Biology",
      nameBn: "জীববিজ্ঞান",
      icon: "🌿",
      chapters: [
        {
          id: "genetics",
          chapterNameEn: "Genetics and Evolution",
          chapterNameBn: "বংশগতি ও বিবর্তন",
          summaryEn: "Mendelian inheritance, linkage, DNA as genetic material, transcription, and translation.",
          summaryBn: "মেন্ডেলের বংশগতি সূত্র, লিংকেজ, বংশগত বস্তু হিসেবে DNA-র প্রমাণ এবং প্রোটিন সংশ্লেষ প্রক্রিয়া।",
          keyPointsEn: [
            "Mendel's Law of Segregation and Law of Independent Assortment.",
            "DNA replication is semi-conservative, proven by Meselson and Stahl.",
            "Transcription converts DNA to mRNA; Translation converts mRNA to protein."
          ],
          keyPointsBn: [
            "মেন্ডেলের পৃথকীভবন সূত্র এবং স্বাধীন সঞ্চরণ সূত্র।",
            "DNA রেপ্লিকেশন অর্ধ-রক্ষণশীল প্রকৃতির (মেселসন ও স্টাহল পরীক্ষা)।",
            "ট্রান্সক্রিপশনের মাধ্যমে DNA থেকে mRNA তৈরি হয়; ট্রান্সলেশনের মাধ্যমে mRNA থেকে প্রোটিন গঠিত হয়।"
          ]
        },
        {
          id: "human-repro-12",
          chapterNameEn: "Human Reproduction",
          chapterNameBn: "মানুষের জনন",
          summaryEn: "Male and female reproductive systems, gametogenesis, menstrual cycle, fertilization, embryonic development, and parturition.",
          summaryBn: "পুরুষ ও স্ত্রী জননতন্ত্রের গঠন, গ্যামেট উৎপাদন (শুক্রাণু ও ডিম্বাণু উৎপাদন), রজঃচক্র, নিষেক, ভ্রূণের বিকাশ ও সন্তান প্রসব প্রক্রিয়া।",
          keyPointsEn: [
            "Spermatogenesis occurs in the seminiferous tubules; Oogenesis occurs in the ovaries.",
            "Menstrual cycle is regulated by hormones like LH, FSH, Estrogen, and Progesterone.",
            "Fertilization takes place in the ampulla region of the fallopian tube."
          ],
          keyPointsBn: [
            "শুক্রাণু উৎপাদন সেমিনিফেরাস নালিকায় ঘটে এবং ডিম্বাণু উৎপাদন ডিম্বাশয়ে ঘটে।",
            "রজঃচক্র LH, FSH, ইস্ট্রোজেন এবং প্রোজেস্টেরনের মতো হরমোন দ্বারা নিয়ন্ত্রিত হয়।",
            "নিষেক প্রক্রিয়া ডিম্বনালীর অ্যাম্পুলা (Ampulla) অংশে সম্পন্ন হয়।"
          ]
        }
      ]
    },
    {
      id: "english",
      nameEn: "English",
      nameBn: "ইংরেজি",
      icon: "📖",
      chapters: [
        {
          id: "eyes-have-it",
          chapterNameEn: "The Eyes Have It",
          chapterNameBn: "দ্য আইজ হ্যাভ ইট",
          summaryEn: "Analysis of Ruskin Bond's romantic irony regarding two blind passengers in a train compartment.",
          summaryBn: "রাসকিন বন্ড রচিত ট্রেনের কামরায় দুটি অন্ধ সহযাত্রীর কথোপকথনের চমৎকার রোমান্টিক এবং লৌকিক রস বিশ্লেষণ।",
          keyPointsEn: [
            "The narrator tries to hide his blindness from the girl who boards at Rohana.",
            "They share small elegant conversations about Mussoorie and her face.",
            "At the end, the new passenger reveals that the girl was also completely blind."
          ],
          keyPointsBn: [
            "গল্পকথক রোহানা থেকে ট্রেনে ওঠা তরুণীর কাছ থেকে নিজের অন্ধত্ব গোপন করার চেষ্টা করেন।",
            "তাঁরা মুসৌরি ও তরুণীর সুন্দর মুখমণ্ডল নিয়ে চমৎকার সংক্ষিপ্ত মতবিনিময় করেন।",
            "সবশেষে, কামরায় ওঠা নতুন যাত্রীটি প্রকাশ করেন যে সেই তরুণীটিও সম্পূর্ণ অন্ধ ছিলেন।"
          ]
        },
        {
          id: "strong-roots-12",
          chapterNameEn: "Strong Roots",
          chapterNameBn: "স্ট্রং রুটস",
          summaryEn: "Extract from A.P.J. Abdul Kalam's autobiography 'Wings of Fire' describing his early life and his father's spiritual teachings.",
          summaryBn: "এ.পি.জে. আবদুল কালামের আত্মজীবনী 'উইংস অব ফায়ার' থেকে সংগৃহীত অংশ যেখানে তাঁর শৈশব ও বাবার আধ্যাত্মিক শিক্ষার বর্ণনা রয়েছে।",
          keyPointsEn: [
            "Kalam was born into a middle-class Tamil family in the island town of Rameswaram.",
            "His father, Jainulabdeen, possessed great innate wisdom and a true generosity of spirit.",
            "Kalam's father believed that adversity always presents opportunities for introspection."
          ],
          keyPointsBn: [
            "কালাম রামেশ্বরম দ্বীপ শহরের এক মধ্যবিত্ত তামিল পরিবারে জন্মগ্রহণ করেন।",
            "তাঁর পিতা জয়নুল আবেদিনের কোনো আনুষ্ঠানিক শিক্ষা বা সম্পদ না থাকলেও গভীর জ্ঞান ও উদারতা ছিল।",
            "কালামের পিতা বিশ্বাস করতেন যে প্রতিকূলতা সর্বদা মানুষের আত্মদর্শনের সুযোগ তৈরি করে দেয়।"
          ]
        }
      ]
    },
    {
      id: "bengali",
      nameEn: "Bengali",
      nameBn: "বাংলা",
      icon: "✍️",
      chapters: [
        {
          id: "ke-bachay",
          chapterNameEn: "Ke Bachay Ke Bache",
          chapterNameBn: "কে বাঁচায় কে বাঁচে",
          summaryEn: "Analysis of Manik Bandopadhyay's story about Nikhil and Mrityunjay surviving the Bengal Famine of 1943.",
          summaryBn: "মানিক বন্দ্যোপাধ্যায় রচিত পঞ্চাশের মন্বন্তরের পটভূমিতে নিখিল ও মৃত্যুঞ্জয়ের নৈতিক লড়াই ও মনস্তাত্ত্বিক বিপর্যয়।",
          keyPointsEn: [
            "Mrityunjay is deeply shocked to see a starvation death on the street.",
            "He neglects his job and family to feed the poor in gruel kitchens.",
            "Gradually, his humanity leads to self-ruin as he joins the beggars on the pavement."
          ],
          keyPointsBn: [
            "প্রথমবার ফুটপাতে অনাহারে মৃত্যু দেখে মৃত্যুঞ্জয়ের মানসিক ও শারীরিক বিপর্যয় ঘটে।",
            "সে দরিদ্রদের অন্ন দিতে নিজের মাইনে, চাকরি ও সংসার ত্যাগ করে লঙ্গরখানায় ঘুরে বেড়ায়।",
            "অবশেষে সে নিজেই ফুটপাতে ধুলোবালি মেখে ভিক্ষুকদের একজন হয়ে যায়।"
          ]
        },
        {
          id: "bhat-12",
          chapterNameEn: "Bhat",
          chapterNameBn: "ভাত",
          summaryEn: "Analysis of Mahasweta Devi's story depicting a poor peasant Utsav's desperate search for rice (food) in a wealthy household.",
          summaryBn: "মহাশ্বেতা দেবী রচিত গল্পে উৎসব নামক এক হতদরিদ্র মানুষের ভাতের প্রতি তীব্র আকাঙ্ক্ষা এবং ধনী সমাজের নিষ্ঠুরতা চিত্রিত হয়েছে।",
          keyPointsEn: [
            "Utsav loses his family and home in a natural disaster (Matla river flood).",
            "He comes to Kolkata and works in a wealthy household, hoping for a meal of rice.",
            "The story exposes the massive contrast between the food waste of the rich and the absolute starvation of the poor."
          ],
          keyPointsBn: [
            "মাতলা নদীর বন্যায় উৎসব তার ঘরবাড়ি ও পরিবারকে হারিয়ে সর্বস্বান্ত হয়ে পড়ে।",
            "সে কলকাতায় এসে এক ধনী পরিবারে কাঠ কাটার কাজ করতে শুরু করে কেবল এক মুঠো ভাতের আশায়।",
            "ধনী বাড়ির বিপুল অপচয় ও উৎসবের তীব্র ক্ষুধার লড়াইয়ের মাধ্যমে গল্পটিতে কঠোর শ্রেণী বৈষম্য ফুটে উঠেছে।"
          ]
        }
      ]
    }
  ]
};

const PYQS_DATA: Record<string, PYQData[]> = {
  "madhyamik": [
    {
      id: "m-math-2023",
      subjectEn: "Mathematics",
      subjectBn: "গণিত",
      year: 2023,
      board: "WBBSE",
      questions: [
        {
          qEn: "The principal and the total amount in 5 years are in ratio 5:8. Find the annual rate of simple interest.",
          qBn: "৫ বছরে আসল ও সবৃদ্ধিমূলের অনুপাত ৫:৮ হলে, বার্ষিক সরল সুদের হার নির্ণয় করো।",
          marks: 3,
          answerEn: "Let Principal (P) = 5x and Amount (A) = 8x.\nTherefore, Simple Interest (I) = A - P = 8x - 5x = 3x.\nTime (T) = 5 years.\nUsing I = P * R * T / 100:\n3x = (5x * R * 5) / 100\n3 = 25R / 100 => 3 = R / 4 => R = 12%.\nAnswer: 12% per annum.",
          answerBn: "ধরি, আসল (P) = ৫x এবং সবৃদ্ধিমূল (A) = ৮x।\nঅতএব, মোট সুদ (I) = A - P = ৮x - ৫x = ৩x।\nসময় (T) = ৫ বছর।\nসূত্রানুযায়ী: I = P * R * T / ১০০\n৩x = (৫x * R * ৫) / ১০০\n৩ = ২৫R / ১০০ => ৩ = R / ৪ => R = ১২%।\nউত্তর: বার্ষিক সরল সুদের হার ১২%।"
        },
        {
          qEn: "Solve the quadratic equation: 1/(x-3) - 1/(x+5) = 1/6 (x ≠ 3, -5)",
          qBn: "সমাধান করো: ১/(x-৩) - ১/(x+৫) = ১/৬ (x ≠ ৩, -৫)",
          marks: 3,
          answerEn: "Combine fractions:\n[(x+5) - (x-3)] / [(x-3)(x+5)] = 1/6\n8 / (x² + 2x - 15) = 1/6\nCross-multiply:\nx² + 2x - 15 = 48\nx² + 2x - 63 = 0\nFactorize:\n(x + 9)(x - 7) = 0\nTherefore, x = -9 or x = 7.",
          answerBn: "ভগ্নাংশ দুটি বিয়োগ করে পাই:\n[(x+৫) - (x-৩)] / [(x-৩)(x+৫)] = ১/৬\n৮ / (x² + ২x - ১৫) = ১/৬\nকোণাকুণি গুণ করে পাই:\nx² + ২x - ১৫ = ৪৮\nx² + ২x - ৬৩ = ০\nউৎপাদকে বিশ্লেষণ করে পাই:\n(x + ৯)(x - ৭) = ০\nঅতএব, x = -৯ অথবা x = ৭।"
        }
      ]
    }
  ],
  "hs": [
    {
      id: "hs-math-2024",
      subjectEn: "Mathematics",
      subjectBn: "গণিত",
      year: 2024,
      board: "WBCHSE",
      questions: [
        {
          qEn: "Evaluate: integral of (x * e^x) / (1 + x)^2 dx.",
          qBn: "মান নির্ণয় করো: সমাকলন (x * e^x) / (1 + x)^2 dx।",
          marks: 4,
          answerEn: "Rewrite the numerator: x = (x + 1) - 1.\nIntegral = ∫ [e^x * (x+1 - 1) / (x+1)^2] dx = ∫ e^x [1/(x+1) - 1/(x+1)^2] dx.\nSince d/dx [1/(x+1)] = -1/(x+1)^2, this is of the form ∫ e^x [f(x) + f'(x)] dx.\nTherefore, the value of the integral is e^x / (x+1) + C.",
          answerBn: "লবকে সাজিয়ে পাই: x = (x + ১) - ১।\nসমাকলন = ∫ [e^x * (x+১ - ১) / (x+১)^২] dx = ∫ e^x [১/(x+১) - ১/(x+১)^২] dx।\nযেহেতু d/dx [১/(x+১)] = -১/(x+১)^২, এটি ∫ e^x [f(x) + f'(x)] dx আকারের।\nঅতএব, সমাকলনের মান হল e^x / (x+১) + C।"
        }
      ]
    },
    {
      id: "hs-phys-2024",
      subjectEn: "Physics",
      subjectBn: "পদার্থবিদ্যা",
      year: 2024,
      board: "WBCHSE",
      questions: [
        {
          qEn: "State Gauss's Theorem in electrostatics. Apply it to find the electric field intensity due to an infinitely long straight charged wire.",
          qBn: "স্থির তড়িৎবিজ্ঞানে গাউসের উপপাদ্যটি বিবৃত করো। এর সাহায্যে একটি অসীম দৈর্ঘ্যের সুষমভাবে আহিত ঋজু তারের জন্য কোনো বিন্দুতে তড়িৎক্ষেত্র প্রাবল্য নির্ণয় করো।",
          marks: 5,
          answerEn: "1. Gauss's Law: The total electric flux through a closed surface is 1/ε0 times the total charge enclosed by the surface: ∮ E·dA = Q_encl / ε0.\n2. Consider a cylindrical Gaussian surface of radius r and length L coaxial with the charged wire of linear charge density λ.\n3. Total enclosed charge Q = λ * L.\n4. Flux through cylindrical surface = E * (2 * π * r * L).\n5. By Gauss's Law: E * (2 * π * r * L) = λ * L / ε0 => E = λ / (2 * π * ε0 * r).",
          answerBn: "১. গাউসের সূত্র: কোনো বন্ধ তলের মধ্য দিয়ে অতিক্রান্ত মোট তড়িৎ ফ্লাক্স ওই তলের অভ্যন্তরে অবস্থিত মোট আধানের ১/ε০ গুণ: ∮ E·dA = Q_encl / ε০।\n২. r ব্যাসার্ধ এবং L দৈর্ঘ্যের একটি চোঙাকৃতি গাউসীয় তল বিবেচনা করি যা λ রৈখিক আধান ঘনত্বযুক্ত তারটির অক্ষ বরাবর অবস্থিত।\n৩. তল দ্বারা আবদ্ধ মোট আধান Q = λ * L।\n৪. চোঙের বক্রতলের মধ্য দিয়ে অতিক্রান্ত ফ্লাক্স = E * (২ * π * r * L)।\n৫. গাউসের সূত্রানুযায়ী: E * (২ * π * r * L) = λ * L / ε০ => E = λ / (২ * π * ε০ * r)।"
        }
      ]
    },
    {
      id: "hs-phys-2023",
      subjectEn: "Physics",
      subjectBn: "পদার্থবিদ্যা",
      year: 2023,
      board: "WBCHSE",
      questions: [
        {
          qEn: "Derive the formula for the capacitance of a parallel plate capacitor with air dielectric.",
          qBn: "বায়ু মাধ্যমযুক্ত সমান্তরাল পাত ধারকের ধারকত্বের রাশিমালাটি প্রতিষ্ঠা করো।",
          marks: 3,
          answerEn: "1. Let A be plate area, d be distance, +Q and -Q charges.\n2. Electric field between plates E = σ / ε0 = Q / (A * ε0).\n3. Potential difference V = E * d = Q * d / (A * ε0).\n4. Capacitance C = Q / V = ε0 * A / d.",
          answerBn: "১. ধরি, পাতের ক্ষেত্রফল A, পাতদ্বয়ের দূরত্ব d এবং আধান +Q ও -Q।\n২. পাতদ্বয়ের মধ্যবর্তী তড়িৎক্ষেত্র E = σ / ε০ = Q / (A * ε০)।\n৩. বিভব প্রভেদ V = E * d = Q * d / (A * ε০)।\n৪. ধারকত্ব C = Q / V = ε০ * A / d।"
        }
      ]
    },
    {
      id: "hs-math-2023",
      subjectEn: "Mathematics",
      subjectBn: "গণিত",
      year: 2023,
      board: "WBCHSE",
      questions: [
        {
          qEn: "If y = e^(a * sin^-1(x)), prove that (1 - x^2) y_2 - x y_1 - a^2 y = 0.",
          qBn: "যদি y = e^(a * sin^-1(x)) হয়, তবে প্রমাণ করো যে (1 - x^2) y_2 - x y_1 - a^2 y = 0।",
          marks: 4,
          answerEn: "Differentiating both sides with respect to x:\ny_1 = e^(a * sin^-1(x)) * (a / √(1 - x^2)) = a * y / √(1 - x^2).\nSquaring both sides:\ny_1^2 (1 - x^2) = a^2 y^2.\nDifferentiating again with respect to x:\n2 * y_1 * y_2 * (1 - x^2) + y_1^2 * (-2x) = a^2 * 2 * y * y_1.\nDividing both sides by 2 * y_1 (assuming y_1 ≠ 0):\n(1 - x^2) y_2 - x y_1 = a^2 y => (1 - x^2) y_2 - x y_1 - a^2 y = 0. Hence Proved.",
          answerBn: "উভয় পক্ষকে x এর সাপেক্ষে অবকলন করে পাই:\ny_1 = e^(a * sin^-1(x)) * (a / √(১ - x^২)) = a * y / √(১ - x^২)।\nউভয় পক্ষকে বর্গ করে পাই:\ny_1^২ (১ - x^২) = a^২ y^২।\nপুনরায় x এর সাপেক্ষে অবকলন করে পাই:\n২ * y_1 * y_2 * (১ - x^২) + y_1^২ * (-২x) = a^২ * ২ * y * y_1।\nউভয় পক্ষকে ২ * y_1 দিয়ে ভাগ করে পাই (ধরি y_1 ≠ ০):\n(১ - x^২) y_2 - x y_1 = a^২ y => (১ - x^২) y_2 - x y_1 - a^২ y = ০ (প্রমাণিত)।"
        }
      ]
    },
    {
      id: "hs-chem-2022",
      subjectEn: "Chemistry",
      subjectBn: "রসায়ন",
      year: 2022,
      board: "WBCHSE",
      questions: [
        {
          qEn: "State Raoult's law for a solution containing non-volatile solute. What is meant by isotonic solutions?",
          qBn: "অনুদ্বায়ী দ্রাব যুক্ত দ্রবণের ক্ষেত্রে রাউল্টের সূত্রটি বিবৃত করো। আইসোটোনিক দ্রবণ বলতে কী বোঝো?",
          marks: 3,
          answerEn: "1. Raoult's Law: The relative lowering of vapor pressure of a dilute solution containing a non-volatile solute is equal to the mole fraction of the solute in the solution: (P0 - Ps) / P0 = x2.\n2. Isotonic Solutions: Two solutions having the same osmotic pressure at a given temperature are called isotonic solutions. If they are separated by a semipermeable membrane, no osmosis occurs.",
          answerBn: "১. রাউল্টের সূত্র: কোনো অনুদ্বায়ী দ্রাবের লঘু দ্রবণের বাষ্পচাপের আপেক্ষিক অবমনন দ্রবণে উপস্থিত দ্রাবের মোল ভগ্নাংশের সমান: (P০ - Ps) / P০ = x২।\n২. আইসোটোনিক দ্রবণ: নির্দিষ্ট উষ্ণতায় যে দুটি দ্রবণের অভিস্রবণ চাপ সমান হয়, তাদের আইসোটোনিক দ্রবণ বলা হয়। এদের অর্ধভেদ্য পর্দা দিয়ে পৃথক করে রাখলে কোনো অভিস্রবণ ঘটে না।"
        }
      ]
    },
    {
      id: "hs-phys-2022",
      subjectEn: "Physics",
      subjectBn: "পদার্থবিদ্যা",
      year: 2022,
      board: "WBCHSE",
      questions: [
        {
          qEn: "Write down the conditions for sustained interference of light. Why can two independent light sources not produce interference?",
          qBn: "স্থায়ী আলোর ব্যতিচারের শর্তাবলী লেখো। দুটি স্বতন্ত্র আলোক উৎস কেন ব্যতিচার সৃষ্টি করতে পারে না?",
          marks: 3,
          answerEn: "1. Conditions: (a) The two light sources must be coherent (constant phase difference). (b) The sources must emit continuous waves of the same wavelength and amplitude. (c) The distance between sources must be small, and the screen should be far.\n2. Independent sources cannot produce interference because they do not maintain a constant phase difference over time. Light is emitted in random wave packets of duration ~10^-8 s, leading to rapid, random phase shifts.",
          answerBn: "১. শর্তাবলী: (ক) আলোক উৎস দুটি অবশ্যই সুসঙ্গত (ধ্রুবক দশা পার্থক্যযুক্ত) হতে হবে। (খ) উৎস দুটি থেকে একই তরঙ্গদৈর্ঘ্য ও বিস্তারের আলো নির্গত হতে হবে। (গ) উৎস দুটির মধ্যবর্তী দূরত্ব খুব কম এবং পর্দা দূরে থাকতে হবে।\n২. দুটি স্বতন্ত্র আলোক উৎস সুসঙ্গত উৎস হতে পারে না, কারণ তাদের দশা পার্থক্য সময়ের সাথে নিয়ত পরিবর্তিত হয়। পরমাণু থেকে আলো প্রায় ১০^-৮ সেকেন্ড ধরে অত্যন্ত বিশৃঙ্খলভাবে নির্গত হয়।"
        }
      ]
    },
    {
      id: "hs-bio-2021",
      subjectEn: "Biology",
      subjectBn: "জীববিজ্ঞান",
      year: 2021,
      board: "WBCHSE",
      questions: [
        {
          qEn: "Define Linkage. What is the difference between complete and incomplete linkage?",
          qBn: "লিংকেজ (Linkage) এর সংজ্ঞা দাও। সম্পূর্ণ ও অসম্পূর্ণ লিংকেজের মধ্যে পার্থক্য কী?",
          marks: 3,
          answerEn: "1. Linkage: The tendency of genes located on the same chromosome to stay together during inheritance and pass into the gametes as a unit.\n2. Complete Linkage: Linked genes do not show crossing over and are inherited together for generations, preserving parental traits. Incomplete Linkage: Linked genes tend to separate occasionally due to crossing over, producing new recombinant combinations in offspring.",
          answerBn: "১. লিংকেজ: একই ক্রোমোজোমে অবস্থিত জিনগুলির বংশানুসরণের সময় একত্রিত থাকার এবং গ্যামেটে একসাথে স্থানান্তরিত হওয়ার প্রবণতাকে লিংকেজ বলে।\n২. সম্পূর্ণ লিংকেজ: লিংকড জিনগুলির মধ্যে ক্রসিং ওভার ঘটে না এবং জিনগুলি জনু জনু ধরে একসাথে সঞ্চারিত হয়ে হুবহু মাতৃবৈশিষ্ট্য বজায় রাখে। অসম্পূর্ণ লিংকেজ: ক্রসিং ওভার ঘটার ফলে লিংকড জিনগুলি মাঝে মাঝে পৃথক হয়ে যায় এবং অপত্য জীবের মধ্যে নতুন চারিত্রিক রিকম্বিনেশন তৈরি করে।"
        }
      ]
    },
    {
      id: "hs-eng-2021",
      subjectEn: "English",
      subjectBn: "ইংরেজি",
      year: 2021,
      board: "WBCHSE",
      questions: [
        {
          qEn: "Describe the narrator's encounter with the girl in 'The Eyes Have It' and the irony at the end.",
          qBn: "'The Eyes Have It' গল্পে কথকের সাথে তরুণীটির সাক্ষাৎ এবং শেষ মুহূর্তের পরিহাসটি বর্ণনা করো।",
          marks: 5,
          answerEn: "The narrator, who was completely blind, was traveling alone in a train compartment when a girl boarded. He tried to hide his blindness from her by engaging in pleasant conversation, describing Mussoorie, and commenting on her face. The girl also conversed smoothly without revealing her visual status. The ultimate irony is revealed after the girl departs and a new passenger enters, informing the narrator that the girl was completely blind as well. Both characters spent the journey pretending to see, hiding their blindness from each other.",
          answerBn: "সম্পূর্ণ অন্ধ কথক ট্রেনের কামরায় একাকী ভ্রমণ করার সময় একটি মেয়ে কামরায় ওঠে। কথক মেয়েটির কাছে নিজের অন্ধত্ব আড়াল করতে চমৎকার কথোপকথন চালান, মুসৌরির বর্ণনা দেন এবং তার মুখের প্রশংসা করেন। মেয়েটিও নিজের অন্ধত্বের কথা প্রকাশ না করে স্বাভাবিকভাবে কথা বলে চলে। চূড়ান্ত বিদ্রূপ বা পরিহাস প্রকাশ পায় মেয়েটি নেমে যাওয়ার পর, যখন এক নতুন সহযাত্রী এসে কথককে জানান যে মেয়েটিও সম্পূর্ণ অন্ধ ছিলেন। দুজনেই সারা পথ একে অপরের কাছে চোখ থাকার ভান করেছিলেন।"
        }
      ]
    }
  ],
  "cbse10": [
    {
      id: "cbse10-science-2023",
      subjectEn: "Science",
      subjectBn: "বিজ্ঞান",
      year: 2023,
      board: "CBSE Class 10",
      questions: [
        {
          qEn: "Why is a damage signal red? Explain on the basis of scattering of light.",
          qBn: "বিপদের সংকেত লাল কেন হয়? আলোর বিক্ষেপণের ভিত্তিতে ব্যাখ্যা করো।",
          marks: 2,
          answerEn: "Red light has the longest wavelength in the visible spectrum. According to Rayleigh's scattering law, intensity of scattered light is inversely proportional to the fourth power of wavelength. Thus, red light is scattered the least by dust and air molecules, allowing it to travel long distances without much loss, making it highly visible.",
          answerBn: "দৃশ্যমান আলোর বর্ণালীর মধ্যে লাল আলোর তরঙ্গদৈর্ঘ্য সবচেয়ে বেশি। র্যালের বিক্ষেপণ সূত্রানুযায়ী, বিক্ষিপ্ত আলোর তীব্রতা তরঙ্গের দৈর্ঘ্যের চতুর্থ ঘাতের ব্যস্তানুপাতিক। ফলে লাল আলো ধূলিকণা বা বায়ুকণা দ্বারা সবচেয়ে কম বিক্ষিপ্ত হয় এবং দূর থেকেও সহজে চোখে পড়ে।"
        }
      ]
    }
  ]
};

const SYLLABUS_DATA: Record<string, SyllabusTopic[]> = {
  "madhyamik": [
    { topicEn: "Arithmetic (পাটিগণিত)", topicBn: "পাটিগণিত", marks: 10, chapters: ["Simple Interest", "Compound Interest", "Partnership Business"] },
    { topicEn: "Algebra (বীজগণিত)", topicBn: "বীজগণিত", marks: 15, chapters: ["Quadratic Equations", "Ratio & Proportion", "Variation", "Quadratic Surds"] },
    { topicEn: "Geometry (জ্যামিতি)", topicBn: "জ্যামিতি", marks: 20, chapters: ["Theorems related to Circle", "Tangents", "Similarity"] },
    { topicEn: "Trigonometry (ত্রিকোণমিতি)", topicBn: "ত্রিকোণমিতি", marks: 12, chapters: ["Trigonometric Ratios", "Identities", "Heights & Distances"] }
  ],
  "hs": [
    { topicEn: "Electrostatics (স্থির তড়িৎ)", topicBn: "স্থির তড়িৎবিজ্ঞান", marks: 8, chapters: ["Electric Charges and Fields", "Electrostatic Potential and Capacitance"] },
    { topicEn: "Current Electricity (প্রবাহী তড়িৎ)", topicBn: "প্রবাহী তড়িৎ", marks: 7, chapters: ["Ohm's law", "Kirchhoff's Laws", "Potentiometer"] },
    { topicEn: "Magnetic Effects of Current", topicBn: "তড়িৎপ্রবাহের চৌম্বক ক্রিয়া", marks: 8, chapters: ["Biot-Savart Law", "Ampere's Law", "Lorentz Force"] }
  ]
};

const SUGGESTIONS_DATA: SuggestionItem[] = [
  {
    id: "sug-1",
    subjectEn: "Mathematics",
    subjectBn: "গণিত",
    type: "long",
    qEn: "Prove that the angle subtended by an arc of a circle at the centre is double the angle subtended by it at any point on the remaining part of the circle.",
    qBn: "প্রমাণ করো যে, কোনো বৃত্তের একটি বৃত্তচাপের দ্বারা গঠিত সম্মুখ কেন্দ্রস্থ কোণ ওই চাপের দ্বারা গঠিত যেকোনো বৃত্তস্থ কোণের দ্বিগুণ।",
    importance: "critical",
    hintEn: "Draw radius lines and use the exterior angle theorem of triangles.",
    hintBn: "বৃত্তের ব্যাসার্ধ এঁকে ত্রিভুজের বহিঃস্থ কোণ অন্তঃস্থ বিপরীত কোণদ্বয়ের যোগফলের সমান এই উপপাদ্যটি ব্যবহার করো।"
  },
  {
    id: "sug-2",
    subjectEn: "Physical Science",
    subjectBn: "ভৌত বিজ্ঞান",
    type: "short",
    qEn: "Establish the relation: PV = nRT (Ideal Gas Equation).",
    qBn: "সম্পর্কটি প্রতিষ্ঠা করো: PV = nRT (আদর্শ গ্যাস সমীকরণ)।",
    importance: "very-high",
    hintEn: "Combine Boyle's Law, Charles's Law and Avogadro's Law.",
    hintBn: "বয়েলের সূত্র, চার্লসের সূত্র এবং অ্যাভোগাড্রো সূত্রের সমন্বিত রূপ তৈরি করো।"
  }
];

const FORMULAS_DATA: FormulaItem[] = [
  {
    id: "f-1",
    subject: "math",
    topicEn: "Algebra / Quadratic",
    topicBn: "বীজগণিত / দ্বিঘাত সমীকরণ",
    nameEn: "Sridhara Acharya's Roots Formula",
    nameBn: "শ্রীধর আচার্যের বীজ নির্ণয় সূত্র",
    formula: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
    explanationEn: "Used to find the roots of a quadratic equation of the form ax² + bx + c = 0.",
    explanationBn: "ax² + bx + c = ০ সমীকরণের বীজদ্বয় নির্ণয় করার জন্য ব্যবহৃত হয়।",
    exampleEn: "For x² - 5x + 6 = 0, a=1, b=-5, c=6. Roots are x = (5 ± 1)/2 => x = 3 or 2.",
    exampleBn: "x² - ৫x + ৬ = ০ সমীকরণের ক্ষেত্রে, a=১, b=-৫, c=৬। বীজদ্বয় হল ৩ এবং ২।"
  },
  {
    id: "f-2",
    subject: "math",
    topicEn: "Trigonometry",
    topicBn: "ত্রিকোণমিতি",
    nameEn: "Pythagorean Identity",
    nameBn: "ত্রিকোণমিতিক অভেদাবলী",
    formula: "\\sin^2\\theta + \\cos^2\\theta = 1",
    explanationEn: "Fundamental trigonometric identity applicable for any angle theta.",
    explanationBn: "যেকোনো কোণ থিটা (theta)-র জন্য প্রযোজ্য একটি মৌলিক অভেদ।",
    exampleEn: "If sinθ = 3/5, then cos²θ = 1 - 9/25 = 16/25 => cosθ = 4/5.",
    exampleBn: "sinθ = ৩/৫ হলে, cos²θ = ১ - ৯/২৫ = ১৬/২৫ => cosθ = ৪/৫।"
  },
  {
    id: "f-m1",
    subject: "math",
    topicEn: "Arithmetic Progression (AP)",
    topicBn: "সমান্তর প্রগতি",
    nameEn: "n-th Term of an Arithmetic Progression",
    nameBn: "সমান্তর প্রগতির n-তম পদ নির্ণয়",
    formula: "a_n = a + (n - 1)d",
    explanationEn: "Calculates the value of the n-th term in an AP where 'a' is first term and 'd' is common difference.",
    explanationBn: "একটি সমান্তর প্রগতির n-তম পদ নির্ণয় করে, যেখানে 'a' প্রথম পদ এবং 'd' সাধারণ অন্তর।",
    exampleEn: "For AP: 2, 5, 8... a=2, d=3. The 10th term is a_10 = 2 + (10-1)*3 = 29.",
    exampleBn: "প্রগতি: ২, ৫, ৮... এর ক্ষেত্রে a=২, d=৩। ১০-তম পদটি হল a_10 = ২ + (১০-১)*৩ = ২৯।"
  },
  {
    id: "f-m2",
    subject: "math",
    topicEn: "Arithmetic Progression (AP)",
    topicBn: "সমান্তর প্রগতি",
    nameEn: "Sum of n Terms of an AP",
    nameBn: "সমান্তর প্রগতির প্রথম n সংখ্যক পদের সমষ্টি",
    formula: "S_n = \\frac{n}{2} [2a + (n - 1)d]",
    explanationEn: "Finds the sum of the first 'n' terms of an AP with first term 'a' and common difference 'd'.",
    explanationBn: "সমান্তর প্রগতির প্রথম n সংখ্যক পদের যোগফল নির্ণয় করে।",
    exampleEn: "Sum of first 10 terms of 2, 5, 8... S_10 = 5 * [4 + 9*3] = 5 * 31 = 155.",
    exampleBn: "২, ৫, ৮... এর প্রথম ১০টি পদের সমষ্টি S_10 = ৫ * [৪ + ৯*৩] = ১৫৫।"
  },
  {
    id: "f-m3",
    subject: "math",
    topicEn: "Coordinate Geometry",
    topicBn: "স্থানাঙ্ক জ্যামিতি",
    nameEn: "Distance Formula",
    nameBn: "দুই বিন্দুর মধ্যবর্তী দূরত্ব নির্ণয়ের সূত্র",
    formula: "d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}",
    explanationEn: "Calculates the distance 'd' between two points (x1, y1) and (x2, y2) in a Cartesian plane.",
    explanationBn: "কার্তেসীয় তলে (x১, y১) এবং (x২, y২) বিন্দু দুটির মধ্যকার সরলরেখিক দূরত্ব নির্ণয় করে।",
    exampleEn: "Distance between (1, 2) and (4, 6) is √[(4-1)² + (6-2)²] = √[3² + 4²] = √25 = 5.",
    exampleBn: "(১, ২) এবং (৪, ৬) বিন্দুর দূরত্ব √[(৪-১)² + (৬-২)²] = √[৯ + ১৬] = ৫।"
  },
  {
    id: "f-m4",
    subject: "math",
    topicEn: "Mensuration",
    topicBn: "পরিমিতি",
    nameEn: "Area of a Circle",
    nameBn: "বৃত্তের ক্ষেত্রফল",
    formula: "A = \\pi r^2",
    explanationEn: "Calculates the flat space area enclosed by a circle of radius 'r'.",
    explanationBn: "r ব্যাসার্ধবিশিষ্ট একটি বৃত্তের ক্ষেত্রফল নির্ণয় করে।",
    exampleEn: "For radius r = 7 cm, Area = (22/7) * 7 * 7 = 154 cm².",
    exampleBn: "ব্যাসার্ধ r = ৭ সেমি হলে, ক্ষেত্রফল = (২২/৭) * ৭ * ৭ = ১৫৪ বর্গ সেমি।"
  },
  {
    id: "f-m5",
    subject: "math",
    topicEn: "Mensuration",
    topicBn: "পরিমিতি",
    nameEn: "Surface Area of a Sphere",
    nameBn: "গোলকের সমগ্রতলের ক্ষেত্রফল",
    formula: "A = 4\\pi r^2",
    explanationEn: "Calculates the total outer surface area of a solid or hollow sphere of radius 'r'.",
    explanationBn: "r ব্যাসার্ধের একটি গোলকের বাইরের মোট তলের ক্ষেত্রফল নির্ণয় করে।",
    exampleEn: "For radius r = 7 cm, Surface Area = 4 * (22/7) * 49 = 616 cm².",
    exampleBn: "ব্যাসার্ধ r = ৭ সেমি হলে, সমগ্রতলের ক্ষেত্রফল = ৪ * (২২/৭) * ৪৯ = ৬১৬ বর্গ সেমি।"
  },
  {
    id: "f-m6",
    subject: "math",
    topicEn: "Mensuration",
    topicBn: "পরিমিতি",
    nameEn: "Volume of a Sphere",
    nameBn: "গোলকের আয়তন",
    formula: "V = \\frac{4}{3}\\pi r^3",
    explanationEn: "Calculates the volume of three-dimensional space enclosed by a sphere of radius 'r'.",
    explanationBn: "r ব্যাসার্ধবিশিষ্ট একটি গোলক দ্বারা পরিবেষ্টিত ত্রিমাত্রিক আয়তন নির্ণয় করে।",
    exampleEn: "For radius r = 3 cm, Volume = (4/3) * π * 27 = 36π cm³ ≈ 113.1 cm³.",
    exampleBn: "ব্যাসার্ধ r = ৩ সেমি হলে, আয়তন = (৪/৩) * π * ২৭ = ৩৬π ঘন সেমি।"
  },
  {
    id: "f-m7",
    subject: "math",
    topicEn: "Mensuration",
    topicBn: "পরিমিতি",
    nameEn: "Volume of a Cylinder",
    nameBn: "লম্ব বৃত্তাকার চোঙের আয়তন",
    formula: "V = \\pi r^2 h",
    explanationEn: "Finds the volume of a right circular cylinder with base radius 'r' and vertical height 'h'.",
    explanationBn: "r ভূমির ব্যাসার্ধ এবং h উচ্চতাবিশিষ্ট লম্ব বৃত্তাকার চোঙের আয়তন নির্ণয় করে।",
    exampleEn: "For r = 7 cm and h = 10 cm, Volume = (22/7) * 49 * 10 = 1540 cm³.",
    exampleBn: "r = ৭ সেমি এবং h = ১০ সেমি হলে, চোঙের আয়তন = (২২/৭) * ৪৯ * ১০ = ১৫৪০ ঘন সেমি।"
  },
  {
    id: "f-m8",
    subject: "math",
    topicEn: "Trigonometry",
    topicBn: "ত্রিকোণমিতি",
    nameEn: "Double Angle Formula for Sine",
    nameBn: "সাইন-এর দ্বিগুণ কোণের সূত্র",
    formula: "\\sin(2\\theta) = 2\\sin\\theta\\cos\\theta",
    explanationEn: "Trigonometric formula expressing sine of twice an angle in terms of single angle functions.",
    explanationBn: "যেকোনো কোণের দ্বিগুণ পরিমাপের সাইন মানকে সাধারণ কোণের সাহায্যে প্রকাশ করার সূত্র।",
    exampleEn: "If θ = 30°, sin(60°) = 2*sin(30°)*cos(30°) = 2*(1/2)*(√3/2) = √3/2.",
    exampleBn: "θ = ৩০° হলে, sin(৬০°) = ২*sin(৩০°)*cos(৩০°) = ২*(১/২)*(√৩/২) = √৩/২।"
  },
  {
    id: "f-m9",
    subject: "math",
    topicEn: "Trigonometry",
    topicBn: "ত্রিকোণমিতি",
    nameEn: "Double Angle Formula for Cosine",
    nameBn: "কোসাইন-এর দ্বিগুণ কোণের সূত্র",
    formula: "\\cos(2\\theta) = \\cos^2\\theta - \\sin^2\\theta",
    explanationEn: "Expresses cosine of double angle, also written as 2cos²θ - 1 or 1 - 2sin²θ.",
    explanationBn: "দ্বিগুণ কোণের কোসাইন মান বের করার সূত্র (অন্য রূপ: ২cos²θ - ১ অথবা ১ - ২sin²θ)।",
    exampleEn: "If θ = 45°, cos(90°) = cos²(45°) - sin²(45°) = (1/2) - (1/2) = 0.",
    exampleBn: "θ = ৪৫° হলে, cos(৯০°) = cos²(৪৫°) - sin²(৪৫°) = ০।"
  },
  {
    id: "f-m10",
    subject: "math",
    topicEn: "Algebra / Quadratic",
    topicBn: "বীজগণিত / দ্বিঘাত সমীকরণ",
    nameEn: "Discriminant of a Quadratic",
    nameBn: "দ্বিঘাত সমীকরণের নিরূপক",
    formula: "D = b^2 - 4ac",
    explanationEn: "Determines the nature of the roots of a quadratic equation. If D > 0 (real & distinct), D = 0 (real & equal), D < 0 (imaginary).",
    explanationBn: "বীজদ্বয়ের প্রকৃতি নির্ধারণ করে। D > ০ হলে বীজদ্বয় বাস্তব ও অসমান, D = ০ হলে বাস্তব ও সমান এবং D < ০ হলে অবাস্তব।",
    exampleEn: "For x² - 4x + 4 = 0, D = (-4)² - 4(1)(4) = 16 - 16 = 0 (Roots are real and equal).",
    exampleBn: "x² - ৪x + ৪ = ০ সমীকরণে D = ১৬ - ১৬ = ০, অর্থাৎ বীজদ্বয় বাস্তব ও সমান।"
  },
  {
    id: "f-m11",
    subject: "math",
    topicEn: "Coordinate Geometry",
    topicBn: "স্থানাঙ্ক জ্যামিতি",
    nameEn: "Section Formula (Internal)",
    nameBn: "বিভক্তকরণ সূত্র (অন্তর্বিভক্ত)",
    formula: "P(x,y) = \\left( \\frac{m_1 x_2 + m_2 x_1}{m_1 + m_2}, \\frac{m_1 y_2 + m_2 y_1}{m_1 + m_2} \\right)",
    explanationEn: "Finds the coordinates of a point P which divides the line segment joining (x1, y1) and (x2, y2) internally in the ratio m1:m2.",
    explanationBn: "দুটি বিন্দুর সংযোজক রেখাকে m১:m২ অনুপাতে অন্তর্বিভক্তকারী বিন্দুর স্থানাঙ্ক নির্ণয় করে।",
    exampleEn: "Point dividing line joining (1,1) and (3,3) in 1:1 (midpoint) is ((1+3)/2, (1+3)/2) = (2,2).",
    exampleBn: "(১,১) ও (৩,৩) বিন্দুর মধ্যবিন্দু (অনুপাত ১:১) হল ((১+৩)/২, (১+৩)/২) = (২,২)।"
  },
  {
    id: "f-3",
    subject: "physics",
    topicEn: "Electrostatics",
    topicBn: "স্থির তড়িৎবিজ্ঞান",
    nameEn: "Coulomb's Law of Electrostatics",
    nameBn: "কুলম্বের সূত্র",
    formula: "F = \\frac{1}{4\\pi\\varepsilon_0} \\frac{q_1 q_2}{r^2}",
    explanationEn: "Calculates electrostatic force between two stationary point charges q1 and q2 separated by distance r in vacuum.",
    explanationBn: "শূন্যস্থানে r দূরত্বে অবস্থিত দুটি স্থির বিন্দু আধান q১ ও q২-এর মধ্যকার আকর্ষণ বা বিকর্ষণ বলের মান নির্ণয় করে।",
    exampleEn: "Doubling the distance r decreases the force F to one-fourth (1/4) of its original value.",
    exampleBn: "পাতদ্বয়ের দূরত্ব দ্বিগুণ করলে স্থির তড়িৎ আকর্ষণ বল পূর্বের মানের এক-চতুর্থাংশ (১/৪) হয়ে যায়।"
  },
  {
    id: "f-4",
    subject: "physics",
    topicEn: "Modern Physics",
    topicBn: "আধুনিক পদার্থবিদ্যা",
    nameEn: "Einstein's Mass-Energy Equivalence",
    nameBn: "আইনস্টাইনের ভর-শক্তি সমতুল্যতা",
    formula: "E = mc^2",
    explanationEn: "States that mass (m) can be converted into equivalent energy (E) where c is the speed of light.",
    explanationBn: "ভর (m) এবং শক্তি (E) এর পারস্পরিক রূপান্তর নির্দেশ করে, যেখানে c আলোর গতিবেগ নির্দেশ করে।",
    exampleEn: "Even a small amount of matter contains a huge amount of bound energy.",
    exampleBn: "সামান্যতম ভরের রূপান্তরও বিপুল পরিমাণ শক্তি উৎপন্ন করতে পারে।"
  },
  {
    id: "f-p1",
    subject: "physics",
    topicEn: "Current Electricity",
    topicBn: "চলতড়িৎ",
    nameEn: "Ohm's Law",
    nameBn: "ওহমের সূত্র",
    formula: "V = IR",
    explanationEn: "States that potential difference (V) across a conductor is directly proportional to current (I) flowing through it, where R is resistance.",
    explanationBn: "পরিবাহীর দুই প্রান্তের বিভব প্রভেদ (V) এবং এর মধ্য দিয়ে প্রবাহিত তড়িৎ প্রবাহের (I) সম্পর্ক স্থাপন করে, যেখানে R পরিবাহীর রোধ।",
    exampleEn: "If V = 10V and R = 5Ω, the current I = 10/5 = 2 Ampere.",
    exampleBn: "বিভব প্রভেদ V = ১০V এবং রোধ R = ৫Ω হলে, প্রবাহমাত্রা I = ১০/৫ = ২ অ্যাম্পিয়ার।"
  },
  {
    id: "f-p2",
    subject: "physics",
    topicEn: "Optics / Light",
    topicBn: "আলো / আলোকবিজ্ঞান",
    nameEn: "Snell's Law of Refraction",
    nameBn: "প্রতিসরণের স্নেলের সূত্র",
    formula: "\\mu = \\frac{\\sin i}{\\sin r}",
    explanationEn: "Relates the angle of incidence (i) and angle of refraction (r) when light passes from one medium to another, where mu is refractive index.",
    explanationBn: "আলোকের প্রতিসরণের ক্ষেত্রে আপতন কোণ (i) এবং প্রতিসরণ কোণ (r) এর সাইন-এর অনুপাত স্থির (প্রতিসরাঙ্ক μ) থাকে।",
    exampleEn: "For light entering water from air, refractive index μ ≈ 1.33.",
    exampleBn: "বায়ু থেকে জলে আলো প্রবেশ করলে প্রতিসরাঙ্ক μ ≈ ১.৩৩।"
  },
  {
    id: "f-p3",
    subject: "physics",
    topicEn: "Mechanics / Motion",
    topicBn: "গতি ও বল",
    nameEn: "Newton's Second Law of Motion",
    nameBn: "নিউটনের দ্বিতীয় গতিসূত্র",
    formula: "F = ma",
    explanationEn: "The force (F) applied to an object is equal to its mass (m) multiplied by its acceleration (a).",
    explanationBn: "কোনো বস্তুর ওপর প্রযুক্ত বল (F) তার ভর (m) এবং ত্বরণের (a) গুণфলের সমান হয়।",
    exampleEn: "A force of 10 N acting on a 2 kg mass produces an acceleration of 10/2 = 5 m/s².",
    exampleBn: "২ কেজি ভরের ওপর ১০ N বল প্রয়োগ করলে ত্বরণ হবে ১০/২ = ৫ মি/সেকেন্ড²।"
  },
  {
    id: "f-5",
    subject: "chemistry",
    topicEn: "Acids and Bases",
    topicBn: "অম্ল ও ক্ষারক",
    nameEn: "pH Value formula",
    nameBn: "pH স্কেলের গাণিতিক রূপ",
    formula: "\\text{pH} = -\\log_{10}[H^+]",
    explanationEn: "Measures the acidity or basicity of a solution based on hydrogen ion concentration [H+] in moles/liter.",
    explanationBn: "হাইড্রোজেন আয়নের ঘনত্বের ঋণাত্মক লগারিদম দিয়ে দ্রবণের অম্লতা বা ক্ষারত্ব নির্দেশ করে।",
    exampleEn: "Pure water has [H+] = 10^-7 M, so pH = -log(10^-7) = 7.",
    exampleBn: "বিশুদ্ধ জলের [H+] = ১০^-৭ M, অতএব pH = ৭।"
  },
  {
    id: "f-6",
    subject: "chemistry",
    topicEn: "Gases",
    topicBn: "গ্যাসীয় অবস্থা",
    nameEn: "Ideal Gas Law",
    nameBn: "আদর্শ গ্যাস সমীকরণ",
    formula: "PV = nRT",
    explanationEn: "Equation of state of a hypothetical ideal gas, relating pressure (P), volume (V), amount of substance (n), and absolute temperature (T).",
    explanationBn: "আদর্শ গ্যাসের চাপ (P), আয়তন (V), মোল সংখ্যা (n) এবং পরম তাপমাত্রা (T) এর সম্পর্ক স্থাপনকারী সমীকরণ।",
    exampleEn: "R is the universal gas constant (8.314 J/mol·K).",
    exampleBn: "R হল সার্বজনীন গ্যাস ধ্রুবক (৮.৩১৪ J/mol·K)।"
  },
  {
    id: "f-c1",
    subject: "chemistry",
    topicEn: "Solutions / Molarity",
    topicBn: "দ্রবণ / মোলারিটি",
    nameEn: "Molarity Formula",
    nameBn: "মোলারিটি নির্ণয়ের সূত্র",
    formula: "M = \\frac{n}{V}",
    explanationEn: "Calculates the molarity (M) of a solution, which is the number of moles of solute (n) dissolved per liter of solution (V).",
    explanationBn: "দ্রবণের মোলারিটি (M) নির্ণয় করে, যা প্রতি লিটার দ্রবণে দ্রবীভূত দ্রাবের মোল সংখ্যা নির্দেশ করে।",
    exampleEn: "If 2 moles of solute are dissolved in 4 liters of solution, Molarity = 2 / 4 = 0.5 M.",
    exampleBn: "২ মোল দ্রাব ৪ লিটার দ্রবণে দ্রবীভূত থাকলে মোলারিটি = ২ / ৪ = ০.৫ M।"
  }
];

function RenderMath({ id, formula }: { id: string; formula: string }) {
  switch (id) {
    case "f-1": // Sridhara Acharya
      return (
        <div className="flex items-center justify-center gap-1 font-sans text-emerald-400 text-xs sm:text-sm select-none py-1 overflow-x-auto w-full scrollbar-none">
          <span className="font-extrabold text-slate-300">x =</span>
          <div className="flex flex-col items-center">
            <span className="px-1.5 border-b border-emerald-500/30 pb-0.5 font-bold text-center select-all whitespace-nowrap">
              -b &plusmn; &radic;(b&sup2; - 4ac)
            </span>
            <span className="pt-0.5 font-bold text-center select-all">2a</span>
          </div>
        </div>
      );
    case "f-2": // Pythagorean Identity
      return (
        <div className="flex items-center justify-center gap-1 font-sans text-emerald-400 text-xs sm:text-sm select-all py-1.5">
          <span className="font-bold">sin&sup2;&theta; + cos&sup2;&theta; = 1</span>
        </div>
      );
    case "f-m1": // n-th Term of AP
      return (
        <div className="flex items-center justify-center gap-1 font-sans text-emerald-400 text-xs sm:text-sm select-all py-1.5">
          <span className="font-bold">a<sub>n</sub> = a + (n - 1)d</span>
        </div>
      );
    case "f-m2": // Sum of AP
      return (
        <div className="flex items-center justify-center gap-1 font-sans text-emerald-400 text-xs sm:text-sm select-none py-1 overflow-x-auto w-full scrollbar-none">
          <span className="font-extrabold text-slate-300">S<sub>n</sub> =</span>
          <div className="flex flex-col items-center">
            <span className="px-1.5 border-b border-emerald-500/30 pb-0.5 font-bold text-center select-all">n</span>
            <span className="pt-0.5 font-bold text-center select-all">2</span>
          </div>
          <span className="font-bold text-emerald-400 ml-1">[ 2a + (n - 1)d ]</span>
        </div>
      );
    case "f-m3": // Distance Formula
      return (
        <div className="flex items-center justify-center gap-1 font-sans text-emerald-400 text-xs sm:text-sm select-all py-1.5">
          <span className="font-bold">d = &radic;((x<sub>2</sub> - x<sub>1</sub>)&sup2; + (y<sub>2</sub> - y<sub>1</sub>)&sup2;)</span>
        </div>
      );
    case "f-m4": // Area of Circle
      return (
        <div className="flex items-center justify-center gap-1 font-sans text-emerald-400 text-xs sm:text-sm select-all py-1.5">
          <span className="font-bold">A = &pi;r&sup2;</span>
        </div>
      );
    case "f-m5": // Surface Area of Sphere
      return (
        <div className="flex items-center justify-center gap-1 font-sans text-emerald-400 text-xs sm:text-sm select-all py-1.5">
          <span className="font-bold">A = 4&pi;r&sup2;</span>
        </div>
      );
    case "f-m6": // Volume of Sphere
      return (
        <div className="flex items-center justify-center gap-1 font-sans text-emerald-400 text-xs sm:text-sm select-none py-1 overflow-x-auto w-full scrollbar-none">
          <span className="font-extrabold text-slate-300">V =</span>
          <div className="flex flex-col items-center">
            <span className="px-1.5 border-b border-emerald-500/30 pb-0.5 font-bold text-center select-all">4</span>
            <span className="pt-0.5 font-bold text-center select-all">3</span>
          </div>
          <span className="font-bold text-emerald-400 ml-1">&pi;r&sup3;</span>
        </div>
      );
    case "f-m7": // Volume of Cylinder
      return (
        <div className="flex items-center justify-center gap-1 font-sans text-emerald-400 text-xs sm:text-sm select-all py-1.5">
          <span className="font-bold">V = &pi;r&sup2;h</span>
        </div>
      );
    case "f-m8": // Double angle sin
      return (
        <div className="flex items-center justify-center gap-1 font-sans text-emerald-400 text-xs sm:text-sm select-all py-1.5">
          <span className="font-bold">sin(2&theta;) = 2 sin&theta; cos&theta;</span>
        </div>
      );
    case "f-m9": // Double angle cos
      return (
        <div className="flex items-center justify-center gap-1 font-sans text-emerald-400 text-xs sm:text-sm select-all py-1.5">
          <span className="font-bold">cos(2&theta;) = cos&sup2;&theta; - sin&sup2;&theta;</span>
        </div>
      );
    case "f-m10": // Discriminant
      return (
        <div className="flex items-center justify-center gap-1 font-sans text-emerald-400 text-xs sm:text-sm select-all py-1.5">
          <span className="font-bold">D = b&sup2; - 4ac</span>
        </div>
      );
    case "f-m11": // Section Formula
      return (
        <div className="flex items-center justify-center gap-1.5 font-sans text-emerald-400 text-xs sm:text-sm select-none py-1 overflow-x-auto w-full scrollbar-none">
          <span className="font-extrabold text-slate-300">P(x, y) = (</span>
          <div className="flex flex-col items-center">
            <span className="px-1 border-b border-emerald-500/30 pb-0.5 font-bold text-center select-all">m<sub>1</sub>x<sub>2</sub> + m<sub>2</sub>x<sub>1</sub></span>
            <span className="pt-0.5 font-bold text-center select-all">m<sub>1</sub> + m<sub>2</sub></span>
          </div>
          <span className="text-slate-500 font-bold">,</span>
          <div className="flex flex-col items-center">
            <span className="px-1 border-b border-emerald-500/30 pb-0.5 font-bold text-center select-all">m<sub>1</sub>y<sub>2</sub> + m<sub>2</sub>y<sub>1</sub></span>
            <span className="pt-0.5 font-bold text-center select-all">m<sub>1</sub> + m<sub>2</sub></span>
          </div>
          <span className="font-extrabold text-slate-300">)</span>
        </div>
      );
    case "f-3": // Coulomb's Law
      return (
        <div className="flex items-center justify-center gap-1 font-sans text-emerald-400 text-xs sm:text-sm select-none py-1 overflow-x-auto w-full scrollbar-none">
          <span className="font-extrabold text-slate-300">F =</span>
          <div className="flex flex-col items-center">
            <span className="px-1.5 border-b border-emerald-500/30 pb-0.5 font-bold text-center select-all">1</span>
            <span className="pt-0.5 font-bold text-center select-all">4&pi;&epsilon;<sub>0</sub></span>
          </div>
          <span className="text-slate-500 mx-0.5 font-black">&bull;</span>
          <div className="flex flex-col items-center">
            <span className="px-1.5 border-b border-emerald-500/30 pb-0.5 font-bold text-center select-all">q<sub>1</sub>q<sub>2</sub></span>
            <span className="pt-0.5 font-bold text-center select-all">r&sup2;</span>
          </div>
        </div>
      );
    case "f-4": // Einstein's
      return (
        <div className="flex items-center justify-center gap-1 font-sans text-emerald-400 text-xs sm:text-sm select-all py-1.5">
          <span className="font-bold">E = mc&sup2;</span>
        </div>
      );
    case "f-p1": // Ohm's Law
      return (
        <div className="flex items-center justify-center gap-1 font-sans text-emerald-400 text-xs sm:text-sm select-all py-1.5">
          <span className="font-bold">V = IR</span>
        </div>
      );
    case "f-p2": // Snell's Law
      return (
        <div className="flex items-center justify-center gap-1 font-sans text-emerald-400 text-xs sm:text-sm select-none py-1 overflow-x-auto w-full scrollbar-none">
          <span className="font-extrabold text-slate-300">&mu; =</span>
          <div className="flex flex-col items-center">
            <span className="px-1.5 border-b border-emerald-500/30 pb-0.5 font-bold text-center select-all">sin i</span>
            <span className="pt-0.5 font-bold text-center select-all">sin r</span>
          </div>
        </div>
      );
    case "f-p3": // Newton's Second Law
      return (
        <div className="flex items-center justify-center gap-1 font-sans text-emerald-400 text-xs sm:text-sm select-all py-1.5">
          <span className="font-bold">F = ma</span>
        </div>
      );
    case "f-5": // pH Value
      return (
        <div className="flex items-center justify-center gap-1 font-sans text-emerald-400 text-xs sm:text-sm select-all py-1.5">
          <span className="font-bold">pH = -log<sub>10</sub>[H<sup>+</sup>]</span>
        </div>
      );
    case "f-6": // Ideal Gas Law
      return (
        <div className="flex items-center justify-center gap-1 font-sans text-emerald-400 text-xs sm:text-sm select-all py-1.5">
          <span className="font-bold">PV = nRT</span>
        </div>
      );
    case "f-c1": // Molarity
      return (
        <div className="flex items-center justify-center gap-1 font-sans text-emerald-400 text-xs sm:text-sm select-none py-1 overflow-x-auto w-full scrollbar-none">
          <span className="font-extrabold text-slate-300">M =</span>
          <div className="flex flex-col items-center">
            <span className="px-1.5 border-b border-emerald-500/30 pb-0.5 font-bold text-center select-all">n</span>
            <span className="pt-0.5 font-bold text-center select-all">V</span>
          </div>
        </div>
      );
    default:
      return (
        <span className="block text-emerald-400 select-all font-sans text-xs md:text-sm leading-relaxed break-all">
          {formula}
        </span>
      );
  }
}

export default function SchoolSection({ lang, theme, onNavigate, profile }: SchoolSectionProps) {
  const [selectedClass, setSelectedClass] = useState<"9" | "10" | "11" | "12">("10");
  const [selectedBoard, setSelectedBoard] = useState<string>("madhyamik");
  const [activeTab, setActiveTab] = useState<"notes" | "boardPrep" | "formulas">("notes");
  
  useEffect(() => {
    const handleSetSchoolClass = (e: any) => {
      if (e.detail === "9" || e.detail === "10" || e.detail === "11" || e.detail === "12") {
        setSelectedClass(e.detail);
      }
    };
    window.addEventListener("setSchoolClass", handleSetSchoolClass);
    return () => window.removeEventListener("setSchoolClass", handleSetSchoolClass);
  }, []);
  
  // Notes state
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("math");
  const [selectedChapterId, setSelectedChapterId] = useState<string>("");
  const [viewingPdfChapter, setViewingPdfChapter] = useState<ChapterNote | null>(null);
  const [viewingPdfPYQ, setViewingPdfPYQ] = useState<PYQData | null>(null);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  
  // Board Prep state
  const [selectedPrepSubTab, setSelectedPrepSubTab] = useState<"pyqs" | "syllabus" | "suggestions">("pyqs");
  const [selectedPYQId, setSelectedPYQId] = useState<string>("");
  const [showAnswerForId, setShowAnswerForId] = useState<string>("");
  
  // Custom uploaded board papers
  const [uploadedPapers, setUploadedPapers] = useState<BoardPrepPaper[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  
  // Local fallback uploaded papers
  const [localPapers, setLocalPapers] = useState<BoardPrepPaper[]>(() => {
    const saved = localStorage.getItem("local_board_papers");
    return saved ? JSON.parse(saved) : [];
  });

  // Upload form state definitions
  const [uploadSubjectEn, setUploadSubjectEn] = useState("");
  const [uploadSubjectBn, setUploadSubjectBn] = useState("");
  const [uploadYear, setUploadYear] = useState<number>(2024);
  const [uploadFileUrl, setUploadFileUrl] = useState("");
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadFileType, setUploadFileType] = useState<"pdf" | "image" | "none">("none");
  const [uploadDragging, setUploadDragging] = useState(false);

  // Load uploaded papers from Firestore in real-time
  useEffect(() => {
    if (!profile) return;
    
    const q = query(
      collection(db, "boardPrepPapers"),
      orderBy("timestamp", "desc")
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const papers: BoardPrepPaper[] = [];
      snapshot.forEach((docSnap) => {
        papers.push({ id: docSnap.id, ...docSnap.data() } as BoardPrepPaper);
      });
      setUploadedPapers(papers);
    }, (error) => {
      console.error("Error listening to board papers: ", error);
    });
    
    return () => unsubscribe();
  }, [profile]);

  // Process the uploaded file to Base64
  const processUploadedFile = (file: File) => {
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const isImage = file.type.startsWith("image/") || 
                    file.name.toLowerCase().endsWith(".jpg") || 
                    file.name.toLowerCase().endsWith(".jpeg") || 
                    file.name.toLowerCase().endsWith(".png");

    if (!isPdf && !isImage) {
      alert(lang === "bn" ? "দয়া করে শুধুমাত্র পিডিএফ বা ইমেজ ফাইল আপলোড করুন (PDF, JPG, JPEG, PNG)" : "Please upload PDF or Image files only (PDF, JPG, JPEG, PNG).");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      alert(lang === "bn" ? "ফাইল সাইজ ৩ মেগাবাইটের বেশি হওয়া যাবে না।" : "File size must be under 3MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUploadFileUrl(reader.result as string);
      setUploadFileName(file.name);
      setUploadFileType(isPdf ? "pdf" : "image");
    };
    reader.readAsDataURL(file);
  };

  const handleUploadPaper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profile?.role !== "Admin") {
      alert(lang === "bn" ? "শুধুমাত্র অ্যাডমিন প্রশ্নপত্র বা নোট আপলোড করতে পারবেন।" : "Only Admins can upload question papers or notes.");
      return;
    }
    if (!uploadSubjectEn.trim() || !uploadSubjectBn.trim()) {
      alert(lang === "bn" ? "দয়া করে বিষয়ের নাম ইংরেজি ও বাংলায় লিখুন" : "Please enter the subject name in both English and Bengali.");
      return;
    }

    setIsUploading(true);

    const paperId = `custom-pyq-${Date.now()}`;
    const newPaper: BoardPrepPaper = {
      id: paperId,
      uploaderEmail: profile?.email || "guest@studyhub.edu",
      uploaderName: profile?.fullName || "Guest Student",
      board: selectedBoard,
      year: Number(uploadYear),
      subjectEn: uploadSubjectEn,
      subjectBn: uploadSubjectBn,
      fileUrl: uploadFileUrl || undefined,
      fileName: uploadFileName || undefined,
      fileType: uploadFileType !== "none" ? uploadFileType : undefined,
      timestamp: new Date().toISOString(),
      questions: [
        {
          qEn: `Board Exam Paper uploaded by student: ${uploadFileName || "Exam_Paper.pdf"}`,
          qBn: `শিক্ষার্থী দ্বারা আপলোডকৃত বোর্ড পরীক্ষার প্রশ্নপত্র: ${uploadFileName || "Exam_Paper.pdf"}`,
          marks: 100,
          answerEn: "Please click 'View Attached Paper' or 'Download' above to see the full document.",
          answerBn: "অনুগ্রহ করে উপরের 'ফাইল দেখুন' বা 'ডাউনলোড' বাটনে ক্লিক করে সম্পূর্ণ প্রশ্নপত্রটি দেখুন।"
        }
      ]
    };

    try {
      if (profile) {
        // Save to Firestore
        await addDoc(collection(db, "boardPrepPapers"), newPaper);
      } else {
        // Save locally to localStorage
        const updatedLocal = [newPaper, ...localPapers];
        setLocalPapers(updatedLocal);
        localStorage.setItem("local_board_papers", JSON.stringify(updatedLocal));
      }

      alert(lang === "bn" ? "প্রশ্নপত্রটি সফলভাবে আপলোড করা হয়েছে!" : "Board exam paper uploaded successfully!");
      
      // Select the uploaded paper
      setSelectedPYQId(paperId);
      
      // Reset upload states
      setUploadSubjectEn("");
      setUploadSubjectBn("");
      setUploadFileUrl("");
      setUploadFileName("");
      setUploadFileType("none");
      setShowUploadForm(false);
    } catch (err) {
      console.error("Upload error:", err);
      alert(lang === "bn" ? "আপলোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।" : "Error uploading paper. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteUploadedPaper = async (paperId: string) => {
    if (!window.confirm(lang === "bn" ? "আপনি কি নিশ্চিতভাবে এই প্রশ্নপত্রটি মুছে ফেলতে চান?" : "Are you sure you want to delete this exam paper?")) {
      return;
    }

    try {
      if (profile) {
        // Find document in firestore and delete it
        const q = query(collection(db, "boardPrepPapers"), where("id", "==", paperId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (docSnap) => {
          await deleteDoc(doc(db, "boardPrepPapers", docSnap.id));
        });
      } else {
        // Delete locally
        const updatedLocal = localPapers.filter(p => p.id !== paperId);
        setLocalPapers(updatedLocal);
        localStorage.setItem("local_board_papers", JSON.stringify(updatedLocal));
      }

      alert(lang === "bn" ? "প্রশ্নপত্রটি মুছে ফেলা হয়েছে!" : "Paper deleted successfully!");
      
      // Select the first available paper
      const nextBoardPapers = boardPrepPYQs.filter(p => p.id !== paperId);
      if (nextBoardPapers.length > 0) {
        setSelectedPYQId(nextBoardPapers[0].id);
      } else {
        setSelectedPYQId("");
      }
    } catch (err) {
      console.error("Error deleting paper:", err);
      alert("Failed to delete paper. Please try again.");
    }
  };
  
  // Formulas state
  const [formulaSearch, setFormulaSearch] = useState<string>("");
  const [formulaSubject, setFormulaSubject] = useState<"all" | "math" | "physics" | "chemistry">("all");
  const [favourites, setFavourites] = useState<string[]>(() => {
    const saved = localStorage.getItem("fav_formulas");
    return saved ? JSON.parse(saved) : [];
  });
  const [copiedId, setCopiedId] = useState<string>("");

  // Sync board options with selected class
  useEffect(() => {
    if (selectedClass === "9" || selectedClass === "10") {
      setSelectedBoard("madhyamik");
    } else {
      setSelectedBoard("hs");
      setActiveTab("boardPrep");
    }
    // Auto reset selection of subject and chapter
    const firstSubject = SUBJECTS_DATA[selectedClass]?.[0];
    if (firstSubject) {
      setSelectedSubjectId(firstSubject.id);
      setSelectedChapterId("all");
    }
  }, [selectedClass]);

  // Sync default chapter when changing subject
  useEffect(() => {
    const currentSubject = SUBJECTS_DATA[selectedClass]?.find(s => s.id === selectedSubjectId);
    if (currentSubject && currentSubject.chapters.length > 0) {
      setSelectedChapterId("all");
    } else {
      setSelectedChapterId("");
    }
  }, [selectedSubjectId, selectedClass]);

  // Formula copy handler
  const handleCopy = (formulaText: string, id: string) => {
    navigator.clipboard.writeText(formulaText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(""), 2000);
  };

  // Favourite handler
  const toggleFavourite = (id: string) => {
    const nextFavs = favourites.includes(id) 
      ? favourites.filter(fav => fav !== id)
      : [...favourites, id];
    setFavourites(nextFavs);
    localStorage.setItem("fav_formulas", JSON.stringify(nextFavs));
  };

  const downloadChapterPdfHtml = (chapter: ChapterNote) => {
    if (!chapter) return;

    const subjectName = SUBJECTS_DATA[selectedClass]?.find(s => s.id === selectedSubjectId);
    const subName = lang === "bn" ? subjectName?.nameBn : subjectName?.nameEn;

    const htmlContent = `
<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <title>${lang === "bn" ? chapter.chapterNameBn : chapter.chapterNameEn} - StudyHub Academy</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background-color: #f8fafc;
            color: #0f172a;
            margin: 0;
            padding: 40px 20px;
            display: flex;
            justify-content: center;
        }
        .page {
            background-color: white;
            width: 100%;
            max-width: 800px;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            border-radius: 24px;
            padding: 50px;
            box-sizing: border-box;
            position: relative;
            overflow: hidden;
            border: 1px solid #e2e8f0;
        }
        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-30deg);
            font-size: 5rem;
            font-weight: 900;
            color: rgba(16, 185, 129, 0.04);
            pointer-events: none;
            white-space: nowrap;
            z-index: 0;
            user-select: none;
        }
        header {
            border-bottom: 2px solid #f1f5f9;
            padding-bottom: 24px;
            margin-bottom: 30px;
            position: relative;
            z-index: 1;
        }
        .brand {
            font-size: 0.75rem;
            font-weight: 800;
            color: #059669;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            margin-bottom: 8px;
        }
        h1 {
            font-size: 2.25rem;
            font-weight: 800;
            color: #0f172a;
            margin: 0 0 10px 0;
            line-height: 1.2;
        }
        .meta {
            font-size: 0.875rem;
            color: #64748b;
            font-weight: 600;
        }
        .summary-box {
            background-color: #f0fdf4;
            border-left: 4px solid #10b981;
            padding: 20px;
            border-radius: 0 16px 16px 0;
            margin-bottom: 35px;
            position: relative;
            z-index: 1;
        }
        .summary-title {
            font-weight: 800;
            text-transform: uppercase;
            font-size: 0.75rem;
            letter-spacing: 0.1em;
            color: #047857;
            margin-bottom: 8px;
        }
        .summary-text {
            font-size: 0.95rem;
            line-height: 1.6;
            color: #1e293b;
            margin: 0;
        }
        .section-title {
            font-size: 1.25rem;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 8px;
            position: relative;
            z-index: 1;
        }
        .keypoint-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
            margin-bottom: 40px;
            padding: 0;
            list-style: none;
            position: relative;
            z-index: 1;
        }
        .keypoint-item {
            display: flex;
            gap: 16px;
            padding: 16px;
            background: #f8fafc;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
        }
        .keypoint-num {
            height: 24px;
            width: 24px;
            border-radius: 50%;
            background-color: rgba(16, 185, 129, 0.15);
            color: #047857;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
            font-weight: 800;
            flex-shrink: 0;
        }
        .keypoint-text {
            font-size: 0.9rem;
            line-height: 1.6;
            color: #334155;
            margin: 0;
            font-weight: 500;
        }
        footer {
            border-top: 1px solid #f1f5f9;
            padding-top: 20px;
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.75rem;
            color: #94a3b8;
            font-weight: 600;
            position: relative;
            z-index: 1;
        }
        .print-btn {
            background-color: #0f172a;
            color: white;
            border: none;
            padding: 10px 20px;
            font-weight: 700;
            font-size: 0.8125rem;
            border-radius: 10px;
            cursor: pointer;
            transition: background 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        .print-btn:hover {
            background-color: #1e293b;
        }
        @media print {
            body {
                background-color: white;
                padding: 0;
            }
            .page {
                box-shadow: none;
                border: none;
                padding: 0;
                border-radius: 0;
            }
            .no-print {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="watermark">STUDY HUB ACADEMY</div>
        <header>
            <div class="brand">STUDY HUB ACADEMY • CLASS ${selectedClass}</div>
            <h1>${lang === "bn" ? chapter.chapterNameBn : chapter.chapterNameEn}</h1>
            <div class="meta">${subName} • ${lang === "bn" ? "অফলাইন স্টাডি গাইড" : "Official Offline Study Guide"}</div>
        </header>

        <div class="summary-box">
            <div class="summary-title">${lang === "bn" ? "সংক্ষিপ্ত সারমর্ম (Summary)" : "Chapter Overview & Summary"}</div>
            <p class="summary-text">${lang === "bn" ? chapter.summaryBn : chapter.summaryEn}</p>
        </div>

        <h2 class="section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            ${lang === "bn" ? "গুরুত্বপূর্ণ সংক্ষিপ্ত আলোচনা ও সূত্র" : "Important Key Concepts & Formulas"}
        </h2>

        <div class="keypoint-list">
            ${(lang === "bn" ? chapter.keyPointsBn : chapter.keyPointsEn).map((point, idx) => `
            <div class="keypoint-item">
                <div class="keypoint-num">${idx + 1}</div>
                <p class="keypoint-text">${point}</p>
            </div>
            `).join("")}
        </div>

        <footer>
            <div>© ${new Date().getFullYear()} StudyHub Academy. ${lang === "bn" ? "সর্বস্বত্ব সংরক্ষিত।" : "All rights reserved."}</div>
            <button class="print-btn no-print" onclick="window.print()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                ${lang === "bn" ? "প্রিন্ট / পিডিএফ সেভ" : "Print / Save PDF"}
            </button>
        </footer>
    </div>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${chapter.chapterNameEn.replace(/[\s\W]+/g, "-")}-Study-Notes.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadPyqPdfHtml = (pyq: PYQData) => {
    if (!pyq) return;

    const htmlContent = `
<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <title>${lang === "bn" ? pyq.subjectBn : pyq.subjectEn} (${pyq.year}) - StudyHub Academy</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background-color: #f8fafc;
            color: #0f172a;
            margin: 0;
            padding: 40px 20px;
            display: flex;
            justify-content: center;
        }
        .page {
            background-color: white;
            width: 100%;
            max-width: 800px;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            border-radius: 24px;
            padding: 50px;
            box-sizing: border-box;
            position: relative;
            overflow: hidden;
            border: 1px solid #e2e8f0;
        }
        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-30deg);
            font-size: 5rem;
            font-weight: 900;
            color: rgba(16, 185, 129, 0.04);
            pointer-events: none;
            white-space: nowrap;
            z-index: 0;
            user-select: none;
        }
        header {
            border-bottom: 2px solid #f1f5f9;
            padding-bottom: 24px;
            margin-bottom: 30px;
            position: relative;
            z-index: 1;
        }
        .brand {
            font-size: 0.75rem;
            font-weight: 800;
            color: #059669;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            margin-bottom: 8px;
        }
        h1 {
            font-size: 2.25rem;
            font-weight: 800;
            color: #0f172a;
            margin: 0 0 10px 0;
            line-height: 1.2;
        }
        .meta {
            font-size: 0.875rem;
            color: #64748b;
            font-weight: 600;
        }
        .question-item {
            background: #f8fafc;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            padding: 20px;
            margin-bottom: 25px;
            position: relative;
            z-index: 1;
        }
        .question-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 15px;
            border-bottom: 1px dashed #e2e8f0;
            padding-bottom: 10px;
        }
        .question-num {
            font-weight: 800;
            color: #059669;
            font-size: 1rem;
        }
        .question-marks {
            font-size: 0.75rem;
            font-weight: 800;
            background: rgba(16, 185, 129, 0.15);
            color: #047857;
            padding: 4px 8px;
            border-radius: 6px;
        }
        .question-text {
            font-size: 0.95rem;
            font-weight: 700;
            color: #0f172a;
            line-height: 1.6;
            margin: 0 0 15px 0;
        }
        .solution-box {
            background: #f0fdf4;
            border-left: 4px solid #10b981;
            padding: 15px;
            border-radius: 0 10px 10px 0;
        }
        .solution-title {
            font-weight: 850;
            text-transform: uppercase;
            font-size: 0.7rem;
            letter-spacing: 0.1em;
            color: #047857;
            margin-bottom: 5px;
        }
        .solution-text {
            font-size: 0.875rem;
            line-height: 1.6;
            color: #1e293b;
            margin: 0;
            white-space: pre-wrap;
        }
        footer {
            border-top: 1px solid #f1f5f9;
            padding-top: 20px;
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.75rem;
            color: #94a3b8;
            font-weight: 600;
            position: relative;
            z-index: 1;
        }
        .print-btn {
            background-color: #0f172a;
            color: white;
            border: none;
            padding: 10px 20px;
            font-weight: 700;
            font-size: 0.8125rem;
            border-radius: 10px;
            cursor: pointer;
            transition: background 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        .print-btn:hover {
            background-color: #1e293b;
        }
        @media print {
            body {
                background-color: white;
                padding: 0;
            }
            .page {
                box-shadow: none;
                border: none;
                padding: 0;
                border-radius: 0;
            }
            .no-print {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="watermark">STUDY HUB ACADEMY</div>
        <header>
            <div class="brand">STUDY HUB ACADEMY • PREVIOUS YEAR PAPER</div>
            <h1>${lang === "bn" ? pyq.subjectBn : pyq.subjectEn} (${pyq.year})</h1>
            <div class="meta">Board: ${pyq.board.toUpperCase()} • ${lang === "bn" ? "প্রশ্ন ও সমাধান" : "Questions & Step-by-Step Solutions"}</div>
        </header>

        <div class="question-list">
            ${pyq.questions.map((q, idx) => `
            <div class="question-item">
                <div class="question-header">
                    <span class="question-num">QUESTION ${idx + 1}</span>
                    <span class="question-marks">${q.marks} ${lang === "bn" ? "নম্বর" : "Marks"}</span>
                </div>
                <p class="question-text">${lang === "bn" ? q.qBn : q.qEn}</p>
                <div class="solution-box">
                    <div class="solution-title">${lang === "bn" ? "উত্তর / গাণিতিক সমাধান:" : "Step-by-Step Solution:"}</div>
                    <p class="solution-text">${lang === "bn" ? q.answerBn : q.answerEn}</p>
                </div>
            </div>
            `).join("")}
        </div>

        <footer>
            <div>© ${new Date().getFullYear()} StudyHub Academy. ${lang === "bn" ? "সর্বস্বত্ব সংরক্ষিত।" : "All rights reserved."}</div>
            <button class="print-btn no-print" onclick="window.print()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                ${lang === "bn" ? "প্রিন্ট / পিডিএফ সেভ" : "Print / Save PDF"}
            </button>
        </footer>
    </div>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${pyq.subjectEn.replace(/[\s\W]+/g, "-")}-${pyq.year}-PYQ-Solutions.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Get subjects for currently selected class
  const availableSubjects = SUBJECTS_DATA[selectedClass] || [];
  const currentSubjectObj = availableSubjects.find(s => s.id === selectedSubjectId);
  const currentChapterObj = currentSubjectObj?.chapters.find(c => c.id === selectedChapterId);

  // Get custom papers for selected board (Only for Class 11 and 12)
  const activeCustomPapers = (selectedClass === "11" || selectedClass === "12")
    ? (profile ? uploadedPapers : localPapers)
        .filter(p => p.board === selectedBoard)
        .map(up => ({
          id: up.id,
          subjectEn: up.subjectEn,
          subjectBn: up.subjectBn,
          year: up.year,
          board: up.board,
          questions: up.questions || [],
          fileUrl: up.fileUrl,
          fileName: up.fileName,
          fileType: up.fileType,
          uploaderEmail: up.uploaderEmail,
          uploaderName: up.uploaderName,
          isCustom: true
        }))
    : [];

  // Get PYQ list for selected board (merging uploaded papers)
  const boardPrepPYQs = [
    ...activeCustomPapers,
    ...(PYQS_DATA[selectedBoard] || [])
  ];
  const activePYQ = boardPrepPYQs.find(p => p.id === selectedPYQId) || boardPrepPYQs[0];

  // Auto set active PYQ if changed board or class
  useEffect(() => {
    if (boardPrepPYQs.length > 0) {
      setSelectedPYQId(boardPrepPYQs[0].id);
    } else {
      setSelectedPYQId("");
    }
  }, [selectedBoard, uploadedPapers, localPapers, selectedClass]);

  // Syllabus list for selected board
  const boardSyllabus = SYLLABUS_DATA[selectedBoard] || [];

  // Filter formulas
  const filteredFormulas = FORMULAS_DATA.filter(item => {
    const matchesSearch = 
      item.nameEn.toLowerCase().includes(formulaSearch.toLowerCase()) ||
      item.nameBn.includes(formulaSearch) ||
      item.topicEn.toLowerCase().includes(formulaSearch.toLowerCase()) ||
      item.topicBn.includes(formulaSearch) ||
      item.formula.toLowerCase().includes(formulaSearch.toLowerCase());
    
    const matchesSubj = formulaSubject === "all" || item.subject === formulaSubject;
    return matchesSearch && matchesSubj;
  });

  return (
    <div className="space-y-4 md:space-y-6 pb-12">
      {/* Title block with school context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 md:p-6 bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 rounded-2xl md:rounded-3xl border border-emerald-500/20 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-emerald-500/20 text-emerald-600 flex items-center justify-center border border-emerald-500/30 shadow-md flex-shrink-0">
            <GraduationCap className="h-6 w-6 md:h-8 md:w-8 animate-pulse" />
          </div>
          <div>
            <h1 className={`text-base md:text-2xl font-black ${theme.textHeading} tracking-tight uppercase flex items-center gap-2 flex-wrap`}>
              {lang === "bn" ? "স্কুল একাডেমি ও বোর্ড প্রস্তুতি" : "School Academy & Board Prep"}
              <span className="text-[10px] md:text-xs bg-emerald-500 text-white font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider animate-bounce">NEW</span>
            </h1>
            <p className={`text-[11px] md:text-xs ${theme.textMuted} font-medium mt-1 max-w-xl`}>
              {lang === "bn" 
                ? "৯ম থেকে ১২শ শ্রেণীর ছাত্রছাত্রীদের জন্য বিষয়ভিত্তিক সংক্ষিপ্ত নোট, সাজেশন্স, বিগত বছরের প্রশ্নাবলী এবং একটি চমৎকার সূত্র সংকলন ভল্ট।"
                : "Class-wise brief chapter summaries, board suggestions, previous year questions (PYQs) and an interactive formula vault for classes 9-12."}
            </p>
          </div>
        </div>

        {/* Global Class Selection controls */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 relative z-10 w-full md:w-auto">
          <span className={`text-xs font-black uppercase tracking-wider ${theme.textMuted}`}>
            {lang === "bn" ? "শ্রেণী নির্বাচন:" : "Select Class:"}
          </span>
          <div className="grid grid-cols-4 sm:flex gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 w-full sm:w-auto">
            {(["9", "10", "11", "12"] as const).map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-1 sm:px-3.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-black transition-all text-center ${
                  selectedClass === cls
                    ? "bg-emerald-600 text-white shadow-md"
                    : `${theme.textMain} hover:bg-slate-200 dark:hover:bg-slate-700`
                }`}
              >
                {lang === "bn" ? `${cls}ম` : <><span className="hidden sm:inline">Class </span>{cls}</>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Tab Controls - Responsive grid on mobile, flex on desktop */}
      {(selectedClass === "9" || selectedClass === "10") && (
        <div className="grid grid-cols-3 md:flex gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/80 w-full md:w-auto">
          <button
            onClick={() => setActiveTab("notes")}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 px-1 py-2 sm:px-5 sm:py-3.5 rounded-xl text-[10px] sm:text-xs md:text-sm font-black transition-all cursor-pointer ${
              activeTab === "notes"
                ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200/40 dark:border-slate-700/50"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <BookMarked className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate">{lang === "bn" ? "অধ্যায়" : "Chapters"}</span>
          </button>
          <button
            onClick={() => setActiveTab("boardPrep")}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 px-1 py-2 sm:px-5 sm:py-3.5 rounded-xl text-[10px] sm:text-xs md:text-sm font-black transition-all cursor-pointer ${
              activeTab === "boardPrep"
                ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200/40 dark:border-slate-700/50"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate">{lang === "bn" ? "বোর্ড" : "Board Prep"}</span>
          </button>
          <button
            onClick={() => setActiveTab("formulas")}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 px-1 py-2 sm:px-5 sm:py-3.5 rounded-xl text-[10px] sm:text-xs md:text-sm font-black transition-all cursor-pointer ${
              activeTab === "formulas"
                ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200/40 dark:border-slate-700/50"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <Calculator className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate">{lang === "bn" ? "সূত্র" : "Formula"}</span>
          </button>
        </div>
      )}

      {/* RENDER ACTIVE TAB */}
      <AnimatePresence mode="wait">
        {activeTab === "notes" && (
          <motion.div
            key="notes-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Subjects sidebar on the left */}
            <div className="lg:col-span-3 space-y-3">
              <h3 className={`text-xs font-black uppercase tracking-wider ${theme.textMuted} px-1 flex items-center gap-2 lg:block hidden`}>
                <Layers className="h-4 w-4 text-emerald-500" />
                {lang === "bn" ? "অধ্যায় তালিকা" : "Subjects list"}
              </h3>
              
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2 pb-2 lg:pb-0 w-full">
                {availableSubjects.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubjectId(sub.id)}
                    className={`flex-1 lg:w-full flex items-center justify-between p-3 lg:p-3.5 rounded-xl border text-left font-black transition-all ${
                      selectedSubjectId === sub.id
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                        : `${theme.bgCard} ${theme.borderCard} ${theme.textHeading} hover:border-emerald-500/50`
                    }`}
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <span className="text-lg md:text-xl">{sub.icon}</span>
                      <span className="text-xs md:text-sm">{lang === "bn" ? sub.nameBn : sub.nameEn}</span>
                    </div>
                    <ChevronRight className={`h-4 w-4 lg:block hidden ${selectedSubjectId === sub.id ? "text-white" : "text-slate-400"}`} />
                  </button>
                ))}
                
                {availableSubjects.length === 0 && (
                  <div className={`p-4 text-center rounded-xl border ${theme.borderCard} bg-slate-50/50 dark:bg-slate-900/30 w-full`}>
                    <p className={`text-xs ${theme.textMuted} font-bold`}>
                      {lang === "bn" ? "এই ক্লাসের জন্য কোনো বিষয় এখনও যুক্ত হয়নি।" : "No subjects loaded for this class."}
                    </p>
                  </div>
                )}
              </div>

              {/* Chapter list sidebar beneath subjects */}
              {currentSubjectObj && currentSubjectObj.chapters.length > 0 && (
                <div className="space-y-1.5 pt-2 lg:pt-4">
                  <h4 className={`text-xs font-black uppercase tracking-wider ${theme.textMuted} px-1 lg:block hidden`}>
                    {lang === "bn" ? "অধ্যায়সমূহ" : "Chapters"}
                  </h4>
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-1.5 pb-2 lg:pb-0 w-full">
                    <button
                      onClick={() => setSelectedChapterId("all")}
                      className={`flex-1 lg:w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-black transition-all ${
                        selectedChapterId === "all"
                          ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-l-2 lg:border-l-4 border-emerald-500"
                          : `${theme.textMain} hover:bg-slate-100 dark:hover:bg-slate-800/50`
                      }`}
                    >
                      {lang === "bn" ? "সব অধ্যায় একসাথে" : "All Chapters Combined"}
                    </button>

                    {currentSubjectObj.chapters.map((ch) => (
                      <button
                        key={ch.id}
                        onClick={() => setSelectedChapterId(ch.id)}
                        className={`flex-1 lg:w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-black transition-all ${
                          selectedChapterId === ch.id
                            ? "bg-slate-200 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border-l-2 lg:border-l-4 border-emerald-500"
                            : `${theme.textMain} hover:bg-slate-100 dark:hover:bg-slate-800/50`
                        }`}
                      >
                        {lang === "bn" ? ch.chapterNameBn : ch.chapterNameEn}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Content area on the right */}
            <div className="lg:col-span-9">
              {selectedChapterId === "all" && currentSubjectObj && currentSubjectObj.chapters.length > 0 ? (
                <div className="space-y-8">
                  {/* Subject Overview Header */}
                  <div className={`rounded-2xl md:rounded-3xl border ${theme.borderCard} ${theme.bgCard} p-4 md:p-6 lg:p-8 space-y-4 shadow-xs`}>
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-black uppercase tracking-wider mb-2.5">
                        <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                        {lang === "bn" ? `${selectedClass}ম শ্রেণীর নোটস` : `Class ${selectedClass} notes`}
                      </span>
                      <h2 className={`text-xl md:text-3xl font-black ${theme.textHeading} leading-tight`}>
                        {lang === "bn" ? `${currentSubjectObj.nameBn} - সকল অধ্যায় একসাথে` : `${currentSubjectObj.nameEn} - All Chapters Combined`}
                      </h2>
                      <p className={`text-[11px] md:text-xs ${theme.textMuted} font-semibold mt-1.5`}>
                        {lang === "bn" ? `মোট অধ্যায়: ${currentSubjectObj.chapters.length} টি` : `Total Chapters: ${currentSubjectObj.chapters.length}`}
                      </p>
                    </div>
                  </div>

                  {/* Render list of all chapters */}
                  {currentSubjectObj.chapters.map((ch, idx) => (
                    <div 
                      key={ch.id} 
                      className={`rounded-2xl md:rounded-3xl border ${theme.borderCard} ${theme.bgCard} p-4 md:p-6 lg:p-8 space-y-5 md:space-y-6 shadow-xs relative`}
                    >
                      <div className="absolute top-4 right-4 text-xs font-black text-slate-300 dark:text-slate-700 select-none">
                        #{idx + 1}
                      </div>

                      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-wider mb-2">
                          {lang === "bn" ? `অধ্যায় - ০${idx + 1}` : `Chapter - 0${idx + 1}`}
                        </span>
                        <h3 className={`text-lg md:text-xl font-black ${theme.textHeading} leading-tight`}>
                          {lang === "bn" ? ch.chapterNameBn : ch.chapterNameEn}
                        </h3>
                      </div>

                      {/* Summary Box */}
                      <div className="p-4 md:p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                        <h4 className={`text-[10px] md:text-xs font-black uppercase tracking-widest ${theme.primaryText}`}>
                          {lang === "bn" ? "অধ্যায় সারসংক্ষেপ" : "Chapter Summary"}
                        </h4>
                        <p className={`text-xs md:text-sm ${theme.textMain} leading-relaxed`}>
                          {lang === "bn" ? ch.summaryBn : ch.summaryEn}
                        </p>
                      </div>

                      {/* Detailed Key Points */}
                      <div className="space-y-3.5">
                        <h4 className={`text-xs md:text-sm font-black ${theme.textHeading} flex items-center gap-2`}>
                          <FileCheck className="h-4 w-4 md:h-5 md:w-5 text-emerald-500" />
                          {lang === "bn" ? "গুরুত্বপূর্ণ সংক্ষিপ্ত আলোচনা ও সূত্র" : "Important Short Concepts & Formulas"}
                        </h4>
                        <div className="grid gap-2.5">
                          {(lang === "bn" ? ch.keyPointsBn : ch.keyPointsEn).map((point, pIdx) => (
                            <div 
                              key={pIdx}
                              className="flex gap-2.5 md:gap-3 p-3.5 md:p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 text-xs md:text-sm font-medium items-start shadow-2xs"
                            >
                              <span className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center text-[10px] md:text-xs font-black mt-0.5">
                                {pIdx + 1}
                              </span>
                              <span className={`${theme.textMain} leading-relaxed flex-1 min-w-0 break-words`}>{point}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* PDF View & Download Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 md:p-4 rounded-2xl bg-gradient-to-r from-emerald-500/5 to-teal-500/5 border border-emerald-500/10 mt-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-red-500/20 text-red-600 rounded-lg flex items-center justify-center font-bold flex-shrink-0">
                            PDF
                          </div>
                          <div>
                            <h4 className={`text-xs font-black ${theme.textHeading}`}>
                              {lang === "bn" 
                                ? `${ch.chapterNameBn} - সম্পূর্ণ পিডিএফ` 
                                : `${ch.chapterNameEn} - Complete Chapter PDF`}
                            </h4>
                            <p className={`text-[10px] ${theme.textMuted} font-semibold`}>Size: 1.8 MB | Pages: 12</p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0">
                          <button 
                            onClick={() => setViewingPdfChapter(ch)}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all cursor-pointer shadow-sm active:scale-95"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            {lang === "bn" ? "পিডিএফ দেখুন" : "View PDF"}
                          </button>
                          <button 
                            onClick={() => downloadChapterPdfHtml(ch)}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 transition-all cursor-pointer shadow-sm active:scale-95"
                          >
                            <Download className="h-3.5 w-3.5" />
                            {lang === "bn" ? "ডাউনলোড করুন" : "Download PDF"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : currentChapterObj ? (
                <div className={`rounded-2xl md:rounded-3xl border ${theme.borderCard} ${theme.bgCard} p-4 md:p-6 lg:p-8 space-y-5 md:space-y-6 shadow-xs`}>
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-black uppercase tracking-wider mb-2.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                      {lang === "bn" ? `${selectedClass}ম শ্রেণীর নোটস` : `Class ${selectedClass} notes`}
                    </span>
                    <h2 className={`text-lg md:text-2xl font-black ${theme.textHeading} leading-tight`}>
                      {lang === "bn" ? currentChapterObj.chapterNameBn : currentChapterObj.chapterNameEn}
                    </h2>
                    <p className={`text-[11px] md:text-xs ${theme.textMuted} font-semibold mt-1.5`}>
                      {lang === "bn" ? "বিষয়:" : "Subject:"} {lang === "bn" ? currentSubjectObj?.nameBn : currentSubjectObj?.nameEn}
                    </p>
                  </div>

                  {/* Summary Box */}
                  <div className="p-4 md:p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                    <h3 className={`text-[10px] md:text-xs font-black uppercase tracking-widest ${theme.primaryText}`}>
                      {lang === "bn" ? "অধ্যায় সারসংক্ষেপ" : "Chapter Summary"}
                    </h3>
                    <p className={`text-xs md:text-sm ${theme.textMain} leading-relaxed`}>
                      {lang === "bn" ? currentChapterObj.summaryBn : currentChapterObj.summaryEn}
                    </p>
                  </div>

                  {/* Detailed Key Points */}
                  <div className="space-y-3.5">
                    <h3 className={`text-xs md:text-sm font-black ${theme.textHeading} flex items-center gap-2`}>
                      <FileCheck className="h-4 w-4 md:h-5 md:w-5 text-emerald-500" />
                      {lang === "bn" ? "গুরুত্বপূর্ণ সংক্ষিপ্ত আলোচনা ও সূত্র" : "Important Short Concepts & Formulas"}
                    </h3>
                    <div className="grid gap-2.5">
                      {(lang === "bn" ? currentChapterObj.keyPointsBn : currentChapterObj.keyPointsEn).map((point, idx) => (
                        <div 
                          key={idx}
                          className="flex gap-2.5 md:gap-3 p-3.5 md:p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 text-xs md:text-sm font-medium items-start shadow-2xs"
                        >
                          <span className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center text-[10px] md:text-xs font-black mt-0.5">
                            {idx + 1}
                          </span>
                          <span className={`${theme.textMain} leading-relaxed flex-1 min-w-0 break-words`}>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* PDF View & Download Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 md:p-4 rounded-2xl bg-gradient-to-r from-emerald-500/5 to-teal-500/5 border border-emerald-500/10 mt-6 md:mt-8">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-red-500/20 text-red-600 rounded-lg flex items-center justify-center font-bold flex-shrink-0">
                        PDF
                      </div>
                      <div>
                        <h4 className={`text-xs font-black ${theme.textHeading}`}>
                          {lang === "bn" 
                            ? `${currentChapterObj.chapterNameBn} - সম্পূর্ণ পিডিএফ` 
                            : `${currentChapterObj.chapterNameEn} - Complete Chapter PDF`}
                        </h4>
                        <p className={`text-[10px] ${theme.textMuted} font-semibold`}>Size: 1.8 MB | Pages: 12</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0">
                      <button 
                        onClick={() => setViewingPdfChapter(currentChapterObj)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all cursor-pointer shadow-sm active:scale-95"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        {lang === "bn" ? "পিডিএফ দেখুন" : "View PDF"}
                      </button>
                      <button 
                        onClick={() => downloadChapterPdfHtml(currentChapterObj)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 transition-all cursor-pointer shadow-sm active:scale-95"
                      >
                        <Download className="h-3.5 w-3.5" />
                        {lang === "bn" ? "ডাউনলোড করুন" : "Download PDF"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`rounded-2xl md:rounded-3xl border border-dashed ${theme.borderCard} p-8 md:p-12 text-center bg-slate-50/50 dark:bg-slate-900/20`}>
                  <BookOpen className="h-8 w-8 md:h-10 md:w-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                  <p className={`text-xs md:text-sm font-bold ${theme.textMuted}`}>
                    {lang === "bn" ? "অনুগ্রহ করে বামদিকের তালিকা থেকে একটি বিষয় ও অধ্যায় নির্বাচন করুন।" : "Please select a subject and chapter from the sidebar to view notes."}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "boardPrep" && (
          <motion.div
            key="boardprep-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4 md:space-y-6"
          >
            {/* Board Selector & Mode selector combined */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-3 md:p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full lg:w-auto">
                <span className={`text-xs font-black uppercase tracking-wider ${theme.textMuted} flex-shrink-0`}>
                  {lang === "bn" ? "পরীক্ষা/বোর্ড:" : "Exam/Board:"}
                </span>
                
                {/* Dynamically adjust boards based on class 9/10 vs 11/12 */}
                <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                  {(selectedClass === "9" || selectedClass === "10") ? (
                    <>
                      <button
                        onClick={() => setSelectedBoard("madhyamik")}
                        className={`flex-1 sm:flex-initial px-3 py-2 rounded-lg text-xs font-black transition-all ${
                          selectedBoard === "madhyamik"
                            ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                            : `bg-white dark:bg-slate-800 ${theme.textMain} border ${theme.borderCard} hover:bg-slate-100`
                        }`}
                      >
                        {lang === "bn" ? "WBBSE মাধ্যমিক" : "WBBSE Madhyamik"}
                      </button>
                      <button
                        onClick={() => setSelectedBoard("cbse10")}
                        className={`flex-1 sm:flex-initial px-3 py-2 rounded-lg text-xs font-black transition-all ${
                          selectedBoard === "cbse10"
                            ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                            : `bg-white dark:bg-slate-800 ${theme.textMain} border ${theme.borderCard} hover:bg-slate-100`
                        }`}
                      >
                        CBSE Class 10
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setSelectedBoard("hs")}
                        className={`flex-1 sm:flex-initial px-3 py-2 rounded-lg text-xs font-black transition-all ${
                          selectedBoard === "hs"
                            ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                            : `bg-white dark:bg-slate-800 ${theme.textMain} border ${theme.borderCard} hover:bg-slate-100`
                        }`}
                      >
                        {lang === "bn" ? "WBCHSE উচ্চ মাধ্যমিক" : "WBCHSE HS"}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Sub tabs: PYQs, Syllabus, Suggestions - 3-column grid on mobile, flex on desktop */}
              <div className="grid grid-cols-3 lg:flex gap-1 rounded-xl bg-slate-200/50 dark:bg-slate-800 p-1 border border-slate-200/50 dark:border-slate-700 w-full lg:w-auto">
                <button
                  onClick={() => setSelectedPrepSubTab("pyqs")}
                  className={`px-1 sm:px-4 py-2 rounded-lg text-[10px] sm:text-xs font-black transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                    selectedPrepSubTab === "pyqs" ? "bg-emerald-600 text-white shadow-sm" : `${theme.textMain} hover:bg-slate-250/50`
                  }`}
                >
                  <FileText className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{lang === "bn" ? "প্রশ্ন" : "PYQs"}</span>
                </button>
                <button
                  onClick={() => setSelectedPrepSubTab("syllabus")}
                  className={`px-1 sm:px-4 py-2 rounded-lg text-[10px] sm:text-xs font-black transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                    selectedPrepSubTab === "syllabus" ? "bg-emerald-600 text-white shadow-sm" : `${theme.textMain} hover:bg-slate-250/50`
                  }`}
                >
                  <Layers className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{lang === "bn" ? "সিলেবাস" : "Syllabus"}</span>
                </button>
                <button
                  onClick={() => setSelectedPrepSubTab("suggestions")}
                  className={`px-1 sm:px-4 py-2 rounded-lg text-[10px] sm:text-xs font-black transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                    selectedPrepSubTab === "suggestions" ? "bg-emerald-600 text-white shadow-sm" : `${theme.textMain} hover:bg-slate-250/50`
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
                  <span className="truncate">{lang === "bn" ? "সাজেশন" : "Suggestions"}</span>
                </button>
              </div>
            </div>

            {/* RENDER SUBTAB CONTENT */}
            <AnimatePresence mode="wait">
              {/* 1. PYQS */}
              {selectedPrepSubTab === "pyqs" && (
                <motion.div
                  key="pyqs-subtab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                >
                  {/* Left list of PYQs */}
                  <div className="lg:col-span-4 space-y-2 lg:space-y-3">
                    <h4 className={`text-xs font-black uppercase tracking-wider ${theme.textMuted} px-1 lg:block hidden`}>
                      {lang === "bn" ? "প্রশ্নপত্র তালিকা" : "Available PYQ Sets"}
                    </h4>
                    
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 pb-2 lg:pb-0 w-full">
                      {/* Upload Past Paper button (Only for Class 11 and 12 and Admin) */}
                      {(selectedClass === "11" || selectedClass === "12") && profile?.role === "Admin" && (
                        <button
                          onClick={() => {
                            setSelectedPYQId("upload_new");
                          }}
                          className={`flex-1 lg:w-full p-3.5 rounded-xl lg:rounded-2xl border border-dashed transition-all flex items-center justify-center gap-2 font-sans ${
                            selectedPYQId === "upload_new"
                              ? "bg-emerald-600/15 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                              : `bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 ${theme.textMain} hover:border-emerald-500/50 hover:bg-emerald-500/5`
                          }`}
                        >
                          <Upload className="h-4 w-4 text-emerald-500 shrink-0" />
                          <div className="text-left">
                            <span className="text-xs font-black block leading-none">
                              {lang === "bn" ? "প্রশ্নপত্র আপলোড" : "Upload Past Paper"}
                            </span>
                            <span className={`text-[9px] ${theme.textMuted} font-semibold mt-0.5 block leading-none`}>
                              {lang === "bn" ? "বিগত ৪ বছরের" : "Previous 4 Years"}
                            </span>
                          </div>
                        </button>
                      )}

                      {boardPrepPYQs.map((pyq) => (
                        <button
                          key={pyq.id}
                          onClick={() => setSelectedPYQId(pyq.id)}
                          className={`flex-1 lg:w-full text-left p-3.5 rounded-xl lg:rounded-2xl border transition-all flex flex-col gap-1.5 lg:gap-2 ${
                            selectedPYQId === pyq.id
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                              : `${theme.bgCard} ${theme.borderCard} ${theme.textMain} hover:border-emerald-500/50`
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-[10px] font-black uppercase tracking-wider bg-black/10 px-2 py-0.5 rounded">
                              {pyq.board}
                            </span>
                            <span className="text-[10px] lg:text-xs font-extrabold">{pyq.year}</span>
                          </div>
                          <h5 className="text-xs lg:text-sm font-black mt-0.5 whitespace-normal leading-tight">
                            {lang === "bn" ? pyq.subjectBn : pyq.subjectEn}
                          </h5>
                        </button>
                      ))}

                      {boardPrepPYQs.length === 0 && (
                        <div className={`p-6 text-center rounded-2xl border border-dashed ${theme.borderCard} w-full`}>
                          <p className={`text-xs ${theme.textMuted} font-bold`}>
                            {lang === "bn" ? "এই বোর্ডের জন্য কোনো বিগত বছরের প্রশ্ন পাওয়া যায়নি।" : "No previous year papers added for this board yet."}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right questions with expandable answers */}
                  <div className="lg:col-span-8 space-y-4">
                    {selectedPYQId === "upload_new" ? (
                      <div className={`rounded-2xl md:rounded-3xl border ${theme.borderCard} ${theme.bgCard} p-4 md:p-6 space-y-6 shadow-xs`}>
                        <div className="border-b border-slate-150 dark:border-slate-800 pb-4 flex items-center justify-between">
                          <div>
                            <h3 className={`text-base md:text-xl font-black ${theme.textHeading}`}>
                              {lang === "bn" ? "প্রশ্নপত্র আপলোড করুন" : "Upload Past Year Board Paper"}
                            </h3>
                            <p className={`text-[11px] md:text-xs ${theme.textMuted} font-semibold mt-1`}>
                              {lang === "bn" ? "বিগত ৪ বছরের যেকোনো বিষয়ের বোর্ড পরীক্ষার প্রশ্নপত্র পিডিএফ বা ছবি আপলোড করুন।" : "Upload a PDF or image of any official past year board paper."}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedPYQId(boardPrepPYQs[0]?.id || "")}
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>

                        <form onSubmit={handleUploadPaper} className="space-y-4 font-sans">
                          {/* Subject Input */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className={`text-xs font-black uppercase tracking-wider ${theme.textHeading}`}>
                                {lang === "bn" ? "বিষয়ের নাম (ইংরেজি):" : "Subject Name (English):"}
                              </label>
                              <input
                                type="text"
                                value={uploadSubjectEn}
                                onChange={(e) => setUploadSubjectEn(e.target.value)}
                                placeholder="e.g. Mathematics, English"
                                className={`w-full px-4 py-2 rounded-xl text-xs font-bold border outline-hidden transition-all ${
                                  theme.isDark 
                                    ? "bg-slate-950 border-slate-800 text-white focus:border-emerald-500" 
                                    : "bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500 focus:bg-white"
                                }`}
                                required
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className={`text-xs font-black uppercase tracking-wider ${theme.textHeading}`}>
                                {lang === "bn" ? "বিষয়ের নাম (বাংলায়):" : "Subject Name (Bengali):"}
                              </label>
                              <input
                                type="text"
                                value={uploadSubjectBn}
                                onChange={(e) => setUploadSubjectBn(e.target.value)}
                                placeholder="যেমন: গণিত, ইংরেজি"
                                className={`w-full px-4 py-2 rounded-xl text-xs font-bold border outline-hidden transition-all ${
                                  theme.isDark 
                                    ? "bg-slate-950 border-slate-800 text-white focus:border-emerald-500" 
                                    : "bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500 focus:bg-white"
                                }`}
                                required
                              />
                            </div>
                          </div>

                          {/* Year and Board */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className={`text-xs font-black uppercase tracking-wider ${theme.textHeading}`}>
                                {lang === "bn" ? "পরীক্ষার বছর (বিগত ৪ বছর):" : "Exam Year (Last 4 Years):"}
                              </label>
                              <select
                                value={uploadYear}
                                onChange={(e) => setUploadYear(Number(e.target.value))}
                                className={`w-full px-4 py-2 rounded-xl text-xs font-bold border outline-hidden transition-all cursor-pointer ${
                                  theme.isDark 
                                    ? "bg-slate-950 border-slate-800 text-white focus:border-emerald-500" 
                                    : "bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500 focus:bg-white"
                                }`}
                              >
                                {[2024, 2023, 2022, 2021].map((y) => (
                                  <option key={y} value={y}>{y}</option>
                                ))}
                              </select>
                            </div>
                            <div className="space-y-1.5">
                              <label className={`text-xs font-black uppercase tracking-wider ${theme.textHeading}`}>
                                {lang === "bn" ? "বোর্ড/পরীক্ষা:" : "Board / Exam:"}
                              </label>
                              <input
                                type="text"
                                value={selectedBoard.toUpperCase()}
                                disabled
                                className="w-full px-4 py-2 rounded-xl text-xs font-bold border bg-slate-100 dark:bg-slate-950/60 text-slate-500 border-slate-200 dark:border-slate-800 cursor-not-allowed"
                              />
                            </div>
                          </div>

                          {/* Drag and Drop File Upload */}
                          <div className="space-y-1.5">
                            <label className={`text-xs font-black uppercase tracking-wider ${theme.textHeading}`}>
                              {lang === "bn" ? "প্রশ্নপত্র ফাইল (পিডিএফ বা ছবি):" : "Question Paper File (PDF or Image):"}
                            </label>
                            
                            <div
                              onDragOver={(e) => { e.preventDefault(); setUploadDragging(true); }}
                              onDragLeave={() => setUploadDragging(false)}
                              onDrop={(e) => {
                                e.preventDefault();
                                setUploadDragging(false);
                                const file = e.dataTransfer.files?.[0];
                                if (file) processUploadedFile(file);
                              }}
                              onClick={() => document.getElementById("past-paper-file-upload")?.click()}
                              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                                uploadDragging
                                  ? "border-emerald-500 bg-emerald-500/10"
                                  : uploadFileName
                                    ? "border-emerald-500/50 bg-emerald-500/5"
                                    : "border-slate-200 dark:border-slate-800 hover:border-emerald-500/30 hover:bg-slate-50/50 dark:hover:bg-slate-900/40"
                              }`}
                            >
                              <input
                                id="past-paper-file-upload"
                                type="file"
                                accept="application/pdf,image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) processUploadedFile(file);
                                }}
                                className="hidden"
                              />

                              {uploadFileName ? (
                                <>
                                  <FileCheck className="h-10 w-10 text-emerald-500" />
                                  <div>
                                    <p className={`text-xs font-black ${theme.textHeading}`}>{uploadFileName}</p>
                                    <p className={`text-[10px] ${theme.textMuted} font-semibold uppercase mt-0.5`}>
                                      {uploadFileType.toUpperCase()} • READY TO UPLOAD
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setUploadFileUrl("");
                                      setUploadFileName("");
                                      setUploadFileType("none");
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-600 text-[10px] font-black hover:bg-red-500/20 mt-1 transition-all"
                                  >
                                    {lang === "bn" ? "ফাইল পরিবর্তন" : "Change File"}
                                  </button>
                                </>
                              ) : (
                                <>
                                  <Upload className="h-10 w-10 text-slate-400 dark:text-slate-600" />
                                  <div>
                                    <p className={`text-xs font-black ${theme.textHeading}`}>
                                      {lang === "bn" ? "এখানে ফাইল ড্র্যাগ অ্যান্ড ড্রপ করুন অথবা ব্রাউজ করুন" : "Drag & drop files here, or click to browse"}
                                    </p>
                                    <p className={`text-[10px] ${theme.textMuted} font-semibold mt-1`}>
                                      Supports PDF, JPG, JPEG, PNG (Max 3MB)
                                    </p>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Submit Actions */}
                          <div className="flex gap-2 pt-2 justify-end">
                            <button
                              type="button"
                              onClick={() => setSelectedPYQId(boardPrepPYQs[0]?.id || "")}
                              className="px-4 py-2 rounded-xl text-xs font-black bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                            >
                              {lang === "bn" ? "বাতিল করুন" : "Cancel"}
                            </button>
                            <button
                              type="submit"
                              disabled={isUploading}
                              className="px-5 py-2 rounded-xl text-xs font-black bg-emerald-600 text-white hover:bg-emerald-700 transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                            >
                              {isUploading ? (
                                <>
                                  <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  <span>{lang === "bn" ? "আপলোড হচ্ছে..." : "Uploading..."}</span>
                                </>
                              ) : (
                                <>
                                  <Check className="h-3.5 w-3.5" />
                                  <span>{lang === "bn" ? "প্রশ্নপত্র জমা দিন" : "Submit Paper"}</span>
                                </>
                              )}
                            </button>
                          </div>
                        </form>
                      </div>
                    ) : activePYQ ? (
                      <div className={`rounded-2xl md:rounded-3xl border ${theme.borderCard} ${theme.bgCard} p-4 md:p-6 space-y-5 md:space-y-6 shadow-xs`}>
                        <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className={`text-base md:text-lg font-black ${theme.textHeading}`}>
                                {lang === "bn" ? activePYQ.subjectBn : activePYQ.subjectEn} ({activePYQ.year})
                              </h3>
                              {activePYQ.isCustom && (
                                <span className="text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded">
                                  {lang === "bn" ? "ছাত্রদের আপলোড" : "Student Upload"}
                                </span>
                              )}
                            </div>
                            <p className={`text-[11px] md:text-xs ${theme.textMuted} font-semibold mt-1`}>
                              Board: {activePYQ.board.toUpperCase()} | {lang === "bn" ? "সম্পূর্ণ প্রশ্ন ও সমাধান গাইড" : "Complete Question & Solution Guide"}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {(!activePYQ.isCustom || activePYQ.fileUrl) && (
                              <button 
                                onClick={() => setViewingPdfPYQ(activePYQ)}
                                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all cursor-pointer shadow-xs active:scale-95"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                {lang === "bn" ? "পিডিএফ দেখুন" : "View PDF"}
                              </button>
                            )}
                            {!activePYQ.isCustom && (
                              <button 
                                onClick={() => downloadPyqPdfHtml(activePYQ)}
                                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 transition-all cursor-pointer shadow-xs active:scale-95"
                              >
                                <Download className="h-3.5 w-3.5" />
                                {lang === "bn" ? "ডাউনলোড" : "Download PDF"}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* If it's a student uploaded paper, show file info and quick actions card */}
                        {activePYQ.isCustom && (
                          <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-500/5 to-emerald-500/5 border border-teal-500/10 space-y-3 font-sans">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600 font-extrabold shrink-0 text-xs">
                                {activePYQ.fileType === "pdf" ? "PDF" : "IMG"}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className={`text-xs font-black ${theme.textHeading} truncate`}>
                                  {activePYQ.fileName || (lang === "bn" ? "পরীক্ষার প্রশ্নপত্র ডকুমেন্ট" : "Question Paper Document")}
                                </h4>
                                <p className={`text-[10px] ${theme.textMuted} font-semibold mt-0.5`}>
                                  {lang === "bn" ? "আপলোড করেছেন:" : "Uploaded by:"} {activePYQ.uploaderName} • {activePYQ.uploaderEmail}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-150 dark:border-slate-800/40">
                              {activePYQ.fileUrl && (
                                <button
                                  onClick={() => setViewingPdfPYQ(activePYQ)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-black bg-emerald-600 text-white hover:bg-emerald-700 transition-all cursor-pointer"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  {lang === "bn" ? "প্রশ্নপত্র দেখুন" : "View Paper File"}
                                </button>
                              )}
                              {activePYQ.fileUrl && (
                                <button
                                  onClick={() => {
                                    const link = document.createElement("a");
                                    link.href = activePYQ.fileUrl;
                                    link.download = activePYQ.fileName || "exam_paper";
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                  }}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-black bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-opacity-90 transition-all cursor-pointer"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                  {lang === "bn" ? "ডাউনলোড" : "Download File"}
                                </button>
                              )}
                              
                              {/* Delete Option for author or Admin */}
                              {(!profile || activePYQ.uploaderEmail === profile?.email || profile?.role === "Admin") && (
                                <button
                                  onClick={() => handleDeleteUploadedPaper(activePYQ.id)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-black bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-all cursor-pointer ml-auto"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  {lang === "bn" ? "প্রশ্নপত্র মুছুন" : "Delete Paper"}
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Question list */}
                        <div className="space-y-3.5">
                          {activePYQ.questions.map((q, qidx) => (
                            <div 
                              key={qidx}
                              className="p-4 md:p-5 bg-slate-50 dark:bg-slate-900 rounded-xl md:rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3 md:space-y-4"
                            >
                              <div className="flex flex-col sm:flex-row justify-between items-start gap-2.5 sm:gap-3">
                                <div className="flex items-start gap-2 flex-1">
                                  <span className="text-xs md:text-sm font-black text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0">
                                    Q{qidx + 1}.
                                  </span>
                                  <p className={`text-xs md:text-sm font-bold ${theme.textHeading} leading-relaxed`}>
                                    {lang === "bn" ? q.qBn : q.qEn}
                                  </p>
                                </div>
                                <span className="text-[10px] md:text-xs font-black bg-slate-200 dark:bg-slate-800 px-2.5 py-1 rounded-md text-slate-600 dark:text-slate-400 self-start sm:self-auto shrink-0">
                                  {q.marks} {lang === "bn" ? "নম্বর" : "Marks"}
                                </span>
                              </div>

                              {/* Action buttons */}
                              <div className="flex gap-2 justify-end pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
                                <button
                                  onClick={() => setShowAnswerForId(showAnswerForId === `${activePYQ.id}-${qidx}` ? "" : `${activePYQ.id}-${qidx}`)}
                                  className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  {showAnswerForId === `${activePYQ.id}-${qidx}` 
                                    ? (lang === "bn" ? "সমাধান লুকান" : "Hide Solution") 
                                    : (lang === "bn" ? "সমাধান দেখুন" : "View Solution")}
                                </button>
                              </div>

                              {/* Solution body */}
                              <AnimatePresence>
                                {showAnswerForId === `${activePYQ.id}-${qidx}` && q.answerEn && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="p-3.5 bg-emerald-500/5 rounded-xl border border-emerald-500/10 text-[11px] md:text-xs font-medium space-y-2 overflow-hidden"
                                  >
                                    <h5 className="font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest text-[9px] md:text-[10px]">
                                      {lang === "bn" ? "উত্তর / গাণিতিক সমাধান:" : "Step-by-Step Solution:"}
                                    </h5>
                                    <p className={`${theme.textMain} leading-relaxed whitespace-pre-wrap`}>
                                      {lang === "bn" ? q.answerBn : q.answerEn}
                                    </p>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className={`rounded-2xl md:rounded-3xl border border-dashed ${theme.borderCard} p-8 md:p-12 text-center bg-slate-50/50 dark:bg-slate-900/20`}>
                        <HelpCircle className="h-8 w-8 md:h-10 md:w-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                        <p className={`text-xs md:text-sm font-bold ${theme.textMuted}`}>
                          {lang === "bn" ? "বামদিক বা উপর থেকে একটি প্রশ্নপত্র নির্বাচন করুন।" : "Please select a question set from the options."}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* 2. SYLLABUS */}
              {selectedPrepSubTab === "syllabus" && (
                <motion.div
                  key="syllabus-subtab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className={`rounded-2xl md:rounded-3xl border ${theme.borderCard} ${theme.bgCard} p-4 md:p-6 space-y-5 md:space-y-6 shadow-xs`}>
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                      <h3 className={`text-base md:text-lg font-black ${theme.textHeading}`}>
                        {lang === "bn" ? "সিলেবাস ও নম্বর বিভাজন" : "Official Syllabus & Marks Distribution"}
                      </h3>
                      <p className={`text-[11px] md:text-xs ${theme.textMuted} font-semibold mt-1`}>
                        Board: {selectedBoard.toUpperCase()} | {lang === "bn" ? "অধ্যায়ভিত্তিক নম্বর বিভাজন" : "Chapter-wise marks allocation to target during study."}
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {boardSyllabus.map((syll, idx) => (
                        <div 
                          key={idx}
                          className="p-4 md:p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3 shadow-2xs hover:border-emerald-500/20 transition-all"
                        >
                          <div className="flex justify-between items-start border-b border-slate-200/50 dark:border-slate-800/50 pb-2 gap-2">
                            <h4 className={`text-xs md:text-sm font-black ${theme.textHeading} leading-tight`}>
                              {lang === "bn" ? syll.topicBn : syll.topicEn}
                            </h4>
                            <span className="text-[10px] md:text-xs font-black bg-emerald-500 text-white px-2.5 py-1 rounded-lg flex-shrink-0">
                              {syll.marks} {lang === "bn" ? "নম্বর" : "Marks"}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Chapters included</span>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {syll.chapters.map((ch, cidx) => (
                                <span 
                                  key={cidx}
                                  className="text-[10px] md:text-[11px] font-bold px-2 py-0.5 md:py-1 bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-md text-slate-600 dark:text-slate-400"
                                >
                                  {ch}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 3. SUGGESTIONS */}
              {selectedPrepSubTab === "suggestions" && (
                <motion.div
                  key="suggestions-subtab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className={`rounded-2xl md:rounded-3xl border ${theme.borderCard} ${theme.bgCard} p-4 md:p-6 space-y-5 md:space-y-6 shadow-xs`}>
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                      <h3 className={`text-base md:text-lg font-black ${theme.textHeading}`}>
                        {lang === "bn" ? "গুরুত্বপূর্ণ সাজেশন ও সাজেস্টিভ কোশ্চেন" : "Exam Suggestive Questions"}
                      </h3>
                      <p className={`text-[11px] md:text-xs ${theme.textMuted} font-semibold mt-1`}>
                        Curated by teachers based on past trends for upcoming board exams. Focus on highly rated items.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {SUGGESTIONS_DATA.map((sug) => (
                        <div 
                          key={sug.id}
                          className="p-4 md:p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-800/80 space-y-3 shadow-2xs hover:shadow-sm"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black uppercase bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded">
                                {lang === "bn" ? sug.subjectBn : sug.subjectEn}
                              </span>
                              <span className="text-[10px] font-extrabold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded">
                                {sug.type.toUpperCase()}
                              </span>
                            </div>

                            <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 md:py-1 rounded-full ${
                              sug.importance === "critical" 
                                ? "bg-red-500/10 text-red-600 animate-pulse border border-red-500/20" 
                                : "bg-amber-500/10 text-amber-600"
                            }`}>
                              ⚠️ {sug.importance === "critical" ? (lang === "bn" ? "১০০% কমন উপযোগী" : "CRITICAL IMPORTANCE") : (lang === "bn" ? "অতি গুরুত্বপূর্ণ" : "HIGHLY PROBABLE")}
                            </span>
                          </div>

                          <p className={`text-xs md:text-sm font-black ${theme.textHeading} leading-relaxed pt-1`}>
                            {lang === "bn" ? sug.qBn : sug.qEn}
                          </p>

                          {sug.hintEn && (
                            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-[10px] md:text-[11px] leading-relaxed">
                              <span className="font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-1">
                                {lang === "bn" ? "হিন্ট / উত্তর সংকেত:" : "Answer Hint:"}
                              </span>
                              <p className={`${theme.textMain}`}>{lang === "bn" ? sug.hintBn : sug.hintEn}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {activeTab === "formulas" && (
          <motion.div
            key="formulas-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4 md:space-y-6"
          >
            {/* Search, Categorize, Favourites header bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 md:p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800">
              {/* Search bar */}
              <div className="relative w-full sm:w-64 md:w-72">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={lang === "bn" ? "সূত্র সার্চ করুন..." : "Search formula..."}
                  value={formulaSearch}
                  onChange={(e) => setFormulaSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Subject filters */}
              <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                {([
                  { id: "all", nameEn: "All", nameBn: "সব" },
                  { id: "math", nameEn: "Math", nameBn: "গণিত" },
                  { id: "physics", nameEn: "Physics", nameBn: "পদার্থ" },
                  { id: "chemistry", nameEn: "Chemistry", nameBn: "রসায়ন" }
                ] as const).map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setFormulaSubject(sub.id)}
                    className={`flex-1 sm:flex-initial px-3 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      formulaSubject === sub.id
                        ? "bg-emerald-600 text-white shadow-sm"
                        : `bg-white dark:bg-slate-800 ${theme.textMain} border ${theme.borderCard} hover:bg-slate-150`
                    }`}
                  >
                    {lang === "bn" ? sub.nameBn : sub.nameEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Formula grid */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredFormulas.map((f) => {
                const isFav = favourites.includes(f.id);
                const isCopied = copiedId === f.id;
                
                return (
                  <div 
                    key={f.id}
                    className={`relative rounded-2xl border ${theme.borderCard} ${theme.bgCard} p-4 md:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group overflow-hidden`}
                  >
                    {/* Decorative side border highlighting subject */}
                    <div className={`absolute top-0 bottom-0 left-0 w-1 ${
                      f.subject === "math" ? "bg-blue-500" : f.subject === "physics" ? "bg-purple-500" : "bg-emerald-500"
                    }`}></div>

                    <div className="space-y-3 md:space-y-4">
                      {/* Top topic metadata & actions */}
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          f.subject === "math" 
                            ? "bg-blue-500/10 text-blue-600" 
                            : f.subject === "physics" 
                            ? "bg-purple-500/10 text-purple-600" 
                            : "bg-emerald-500/10 text-emerald-600"
                        }`}>
                          {f.subject.toUpperCase()} | {lang === "bn" ? f.topicBn : f.topicEn}
                        </span>

                        <div className="flex items-center gap-1">
                          {/* Favorite button */}
                          <button
                            onClick={() => toggleFavourite(f.id)}
                            className={`p-1.5 rounded-lg transition-all ${
                              isFav ? "text-red-500" : "text-slate-400 hover:text-red-500"
                            } cursor-pointer`}
                          >
                            <Heart className={`h-4 w-4 ${isFav ? "fill-current" : ""}`} />
                          </button>
                          
                          {/* Copy button */}
                          <button
                            onClick={() => handleCopy(f.formula, f.id)}
                            className="p-1.5 text-slate-400 hover:text-emerald-500 rounded-lg transition-all cursor-pointer"
                            title="Copy Formula"
                          >
                            {isCopied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Formula display name */}
                      <div>
                        <h4 className={`text-xs md:text-sm font-black ${theme.textHeading}`}>
                          {lang === "bn" ? f.nameBn : f.nameEn}
                        </h4>
                      </div>

                      {/* Actual Equation Showcase Box */}
                      <div className="p-3.5 md:p-4 bg-slate-900 text-white rounded-xl text-center flex flex-col items-center justify-center min-h-[68px] font-mono font-medium text-xs md:text-sm border border-slate-800 shadow-inner select-all relative group overflow-hidden w-full">
                        <RenderMath id={f.id} formula={f.formula} />
                      </div>

                      {/* Explanation */}
                      <p className={`text-[11px] md:text-xs ${theme.textMuted} leading-relaxed`}>
                        <strong className="text-[9px] md:text-[10px] font-black uppercase tracking-wider block text-slate-400 mb-0.5">Explanation</strong>
                        {lang === "bn" ? f.explanationBn : f.explanationEn}
                      </p>

                      {/* Example if exists */}
                      {f.exampleEn && (
                        <div className="p-2.5 md:p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 text-[10px] leading-relaxed">
                          <strong className="font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-0.5">Example</strong>
                          <p className={`${theme.textMain}`}>{lang === "bn" ? f.exampleBn : f.exampleEn}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredFormulas.length === 0 && (
                <div className="col-span-full py-12 text-center">
                  <Calculator className="h-8 w-8 md:h-10 md:w-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                  <p className={`text-xs md:text-sm font-bold ${theme.textMuted}`}>
                    {lang === "bn" ? "কোনো সূত্র পাওয়া যায়নি।" : "No formulas found matching your search."}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: Highly immersive PDF Document Viewer */}
      <AnimatePresence>
        {viewingPdfChapter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white text-slate-900 rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 h-[90vh] relative"
            >
              {/* PDF Top Bar */}
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-rose-500 rounded-lg flex items-center justify-center text-white font-extrabold text-xs">
                    PDF
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 truncate max-w-[200px] md:max-w-md">
                      {lang === "bn" ? viewingPdfChapter.chapterNameBn : viewingPdfChapter.chapterNameEn}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-medium">
                      StudyHub Academy • Class {selectedClass} • {lang === "bn" ? "অফলাইন গাইড" : "Official Study Notes"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowPrintModal(true)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 text-xs font-bold transition-all"
                    title="Print or Save as PDF"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{lang === "bn" ? "পিডিএফ সেভ / প্রিন্ট" : "Save / Print PDF"}</span>
                  </button>
                  <button
                    onClick={() => setViewingPdfChapter(null)}
                    className="p-1.5 hover:bg-slate-200 rounded-lg transition-all text-slate-500 hover:text-slate-800"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* PDF Document Container */}
              <div 
                id="printable-school-pdf-document"
                className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 bg-slate-100 print:bg-white relative font-sans select-text"
              >
                {/* Embedded Watermark for PDF Authenticity */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none z-0">
                  <span className="text-slate-900 font-black text-6xl md:text-8xl tracking-widest uppercase rotate-275">
                    STUDYHUB
                  </span>
                </div>

                {/* PAGE 1: PDF Cover Sheet */}
                <div className="min-h-[70vh] bg-white rounded-2xl md:rounded-3xl p-6 md:p-12 border border-slate-200 shadow-xs flex flex-col justify-between relative overflow-hidden page-break-after z-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">
                        STUDYHUB ACADEMY • SCHOOL LEVEL
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
                        CLASS {selectedClass} EDITION
                      </span>
                      <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                        {lang === "bn" ? viewingPdfChapter.chapterNameBn : viewingPdfChapter.chapterNameEn}
                      </h1>
                      <p className="text-sm md:text-base text-slate-500 italic max-w-xl font-medium pt-2 border-t border-slate-150">
                        "{lang === "bn" ? viewingPdfChapter.summaryBn : viewingPdfChapter.summaryEn}"
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8">
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                        SUBJECT
                      </span>
                      <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                        {lang === "bn" ? SUBJECTS_DATA[selectedClass]?.find(s => s.id === selectedSubjectId)?.nameBn : SUBJECTS_DATA[selectedClass]?.find(s => s.id === selectedSubjectId)?.nameEn}
                      </span>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                        {lang === "bn" ? "প্রকাশিত হয়েছে" : "PUBLISHED"}
                      </span>
                      <span className="text-xs font-bold text-slate-600">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* PAGE 2: Key Concepts & Formulas */}
                <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-12 border border-slate-200 shadow-xs space-y-6 md:space-y-8 relative z-10">
                  <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
                    <span className="text-xs font-extrabold text-emerald-600 tracking-widest uppercase">
                      {lang === "bn" ? viewingPdfChapter.chapterNameBn : viewingPdfChapter.chapterNameEn}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">SECTION 1 • KEY CONCEPTS</span>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-lg md:text-xl font-bold text-slate-950 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-emerald-500" />
                      {lang === "bn" ? "গুরুত্বপূর্ণ সংক্ষিপ্ত আলোচনা ও সূত্র" : "Important Key Concepts & Formulas"}
                    </h2>
                    
                    <div className="grid gap-3 pt-2">
                      {(lang === "bn" ? viewingPdfChapter.keyPointsBn : viewingPdfChapter.keyPointsEn).map((point, idx) => (
                        <div 
                          key={idx}
                          className="flex gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/60 text-xs md:text-sm font-medium items-start"
                        >
                          <span className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center text-[10px] font-black">
                            {idx + 1}
                          </span>
                          <span className="text-slate-700 leading-relaxed flex-1">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* PAGE 3: Final back cover */}
                <div className="bg-slate-800 text-white rounded-2xl md:rounded-3xl p-8 md:p-12 text-center space-y-4 print:bg-white print:text-slate-800 print:border-t print:pt-6">
                  <Award className="h-10 w-10 mx-auto text-amber-400" />
                  <h4 className="font-bold text-sm tracking-widest uppercase">
                    STUDY HUB ACADEMY
                  </h4>
                  <p className="text-xs text-slate-400 print:text-slate-500 max-w-sm mx-auto leading-relaxed">
                    {lang === "bn" 
                      ? "আপনার স্বপ্ন ছোঁয়ার যাত্রায় আমরা সর্বদা আপনার সাথে আছি। নিয়মিত পড়াশোনা করুন এবং সফল হোন।" 
                      : "We are with you at every step of your preparation. Keep practicing and keep moving towards your dream."}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Help / Print & Download Options */}
      <AnimatePresence>
        {showPrintModal && viewingPdfChapter && (
          <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className={`${theme.bgCard} text-slate-900 dark:text-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border ${theme.borderCard} p-6 space-y-6 relative`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                  <Printer className="h-5 w-5" />
                  <h3 className={`text-base font-bold ${theme.textHeading}`}>
                    {lang === "bn" ? "প্রিন্ট এবং পিডিএফ ডাউনলোড অপশন" : "Print & PDF Download Options"}
                  </h3>
                </div>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <p className={`text-xs ${theme.textMuted} leading-relaxed`}>
                  {lang === "bn" 
                    ? "আইফ্রেম (iFrame) সিকিউরিটি সুবিধার কারণে ব্রাউজারের প্রিন্ট উইন্ডোটি এখানে সরাসরি কাজ নাও করতে পারে। নিচে দেওয়া সহজ এবং ১০০% কার্যকর অফলাইন ডাউনলোড অপশনটি ব্যবহার করুন:" 
                    : "Due to browser security constraints inside standard sandboxed previews, the default print window may be blocked. Please choose the offline download option below to get a perfect copy:"}
                </p>

                <div className="space-y-3">
                  <div className={`p-4 rounded-2xl border border-teal-500/20 bg-teal-500/5 hover:bg-teal-500/10 transition-all flex flex-col gap-2`}>
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                        <Download className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className={`text-xs font-bold ${theme.textHeading}`}>
                          {lang === "bn" ? "১. প্রিমিয়াম অফলাইন নোট ফাইল ডাউনলোড (সেরা পদ্ধতি)" : "1. Download Offline Notes File (Recommended)"}
                        </h4>
                        <p className={`text-[10px] ${theme.textMuted} mt-0.5 leading-normal`}>
                          {lang === "bn" 
                            ? "এই নোটটি আপনার ডিভাইসে একটি ফাইল হিসেবে ডাউনলোড করুন। ফাইলটি ওপেন করলেই ব্রাউজারে সুন্দরভাবে খুলবে এবং আপনি সরাসরি প্রিন্ট বা PDF সেভ করতে পারবেন। বাংলা লেখার ফন্ট ১০০% সঠিক থাকবে!" 
                            : "Download as a standalone offline file. Double-click to open in any browser to print/save as PDF with perfect formatting and fonts!"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        downloadChapterPdfHtml(viewingPdfChapter);
                        setShowPrintModal(false);
                      }}
                      className="w-full h-9 rounded-xl text-white font-semibold text-xs bg-teal-600 hover:bg-teal-700 transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                    >
                      <Download className="h-4 w-4" />
                      {lang === "bn" ? "অফলাইন নোট ফাইল ডাউনলোড করুন" : "Download Offline Note"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Highly immersive PYQ PDF Document Viewer */}
      <AnimatePresence>
        {viewingPdfPYQ && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white text-slate-900 rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 h-[90vh] relative"
            >
              {/* PDF Top Bar */}
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-rose-500 rounded-lg flex items-center justify-center text-white font-extrabold text-xs">
                    PDF
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 truncate max-w-[200px] md:max-w-md">
                      {lang === "bn" ? viewingPdfPYQ.subjectBn : viewingPdfPYQ.subjectEn} ({viewingPdfPYQ.year})
                    </h3>
                    <p className="text-[10px] text-slate-500 font-medium">
                      StudyHub Academy • Board Prep • {viewingPdfPYQ.board.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => downloadPyqPdfHtml(viewingPdfPYQ)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 text-xs font-bold transition-all"
                    title="Print or Save as PDF"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{lang === "bn" ? "পিডিএফ সেভ / প্রিন্ট" : "Save / Print PDF"}</span>
                  </button>
                  <button
                    onClick={() => setViewingPdfPYQ(null)}
                    className="p-1.5 hover:bg-slate-200 rounded-lg transition-all text-slate-500 hover:text-slate-800"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* PDF Document Container */}
              <div 
                id="printable-pyq-pdf-document"
                className="flex-1 overflow-y-auto p-6 md:p-12 space-y-10 bg-slate-100 print:bg-white relative font-sans select-text"
              >
                {/* Embedded Watermark for PDF Authenticity */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none z-0">
                  <span className="text-slate-900 font-black text-6xl md:text-8xl tracking-widest uppercase rotate-275">
                    STUDYHUB
                  </span>
                </div>

                {viewingPdfPYQ.isCustom && viewingPdfPYQ.fileUrl ? (
                  <div className="w-full space-y-6 relative z-10">
                    <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                      <div>
                        <h4 className="text-xs font-black text-slate-800">
                          {lang === "bn" ? "আপলোডকৃত মূল প্রশ্নপত্র ফাইল" : "Original Uploaded Exam Paper File"}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                          File Name: {viewingPdfPYQ.fileName}
                        </p>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 px-2.5 py-1 rounded-md">
                        {viewingPdfPYQ.fileType?.toUpperCase()} Document
                      </span>
                    </div>

                    {viewingPdfPYQ.fileType === "pdf" ? (
                      <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-md bg-white">
                        <iframe
                          src={viewingPdfPYQ.fileUrl}
                          className="w-full h-[65vh] border-none"
                          title={viewingPdfPYQ.fileName}
                        />
                      </div>
                    ) : (
                      <div className="flex justify-center items-center p-6 bg-white rounded-2xl border border-slate-200 shadow-md">
                        <img
                          src={viewingPdfPYQ.fileUrl}
                          className="max-w-full max-h-[65vh] rounded-xl object-contain"
                          alt={viewingPdfPYQ.fileName}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {/* PAGE 1: PDF Cover Sheet */}
                    <div className="min-h-[70vh] bg-white rounded-2xl md:rounded-3xl p-6 md:p-12 border border-slate-200 shadow-xs flex flex-col justify-between relative overflow-hidden page-break-after z-10">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2.5">
                          <div className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                          <span className="text-[10px] font-black uppercase tracking-wider text-red-600">
                            STUDYHUB ACADEMY • BOARD PREPARATION
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
                            PREVIOUS YEAR SOLVED PAPERS
                          </span>
                          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                            {lang === "bn" ? viewingPdfPYQ.subjectBn : viewingPdfPYQ.subjectEn} ({viewingPdfPYQ.year})
                          </h1>
                          <p className="text-sm md:text-base text-slate-500 italic max-w-xl font-medium pt-2 border-t border-slate-150">
                            {lang === "bn" 
                              ? `পশ্চিমবঙ্গ এবং মাধ্যমিক/উচ্চমাধ্যমিক পরীক্ষার পূর্ণাঙ্গ প্রশ্নোত্তর ও সমাধান গাণিতিক সমাধান` 
                              : `Complete past year paper questions with expert step-by-step solutions for target board exams.`}
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8">
                        <div className="space-y-1">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                            BOARD / EXAM
                          </span>
                          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                            {viewingPdfPYQ.board.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                            {lang === "bn" ? "পরীক্ষা সাল" : "EXAMINATION YEAR"}
                          </span>
                          <span className="text-xs font-bold text-slate-600 bg-amber-500/10 text-amber-700 px-3 py-1 rounded-full">
                            {viewingPdfPYQ.year}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* PAGE 2: Question & Solutions List */}
                    <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-12 border border-slate-200 shadow-xs space-y-6 md:space-y-8 relative z-10">
                      <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
                        <span className="text-xs font-extrabold text-red-600 tracking-widest uppercase">
                          {lang === "bn" ? "প্রশ্নপত্র ও সমাধান" : "Question Paper & Solutions"}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">SECTION 1 • DETAILED ANSWERS</span>
                      </div>

                      <div className="space-y-8">
                        {viewingPdfPYQ.questions.map((q, idx) => (
                          <div key={idx} className="space-y-3.5 pb-6 border-b border-slate-150 last:border-none last:pb-0">
                            <div className="flex justify-between items-start gap-4">
                              <h3 className="text-sm md:text-base font-bold text-slate-900 leading-relaxed flex gap-2">
                                <span className="text-red-500 shrink-0 font-black">Q{idx + 1}.</span>
                                <span>{lang === "bn" ? q.qBn : q.qEn}</span>
                              </h3>
                              <span className="text-2xs font-extrabold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md shrink-0">
                                {q.marks} {lang === "bn" ? "নম্বর" : "Marks"}
                              </span>
                            </div>

                            <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10 space-y-2">
                              <span className="text-[9px] font-extrabold text-emerald-600 uppercase tracking-widest block">
                                {lang === "bn" ? "উত্তর / গাণিতিক সমাধান:" : "Step-by-Step Solution:"}
                              </span>
                              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                                {lang === "bn" ? q.answerBn : q.answerEn}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

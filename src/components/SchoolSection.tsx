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
  AlertCircle
} from "lucide-react";
import { Language } from "../lib/translations";
import { ThemeConfig } from "../lib/themes";

interface SchoolSectionProps {
  lang: Language;
  theme: ThemeConfig;
  onNavigate?: (tab: string) => void;
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
  "9": [
    {
      id: "math",
      nameEn: "Mathematics",
      nameBn: "গণিত",
      icon: "📐",
      chapters: [
        {
          id: "real-numbers",
          chapterNameEn: "Real Numbers",
          chapterNameBn: "বাস্তব সংখ্যা",
          summaryEn: "Introduction to rational, irrational, and real numbers, representation on number lines, and decimal representations.",
          summaryBn: "মূলদ, অমূলদ এবং বাস্তব সংখ্যার ধারণা, সংখ্যা রেখায় উপস্থাপন এবং দশমিক বিস্তার আলোচনা।",
          keyPointsEn: [
            "Every rational number can be expressed as a terminating or repeating decimal.",
            "Irrational numbers cannot be written in the form p/q where p and q are integers and q ≠ 0.",
            "The sum or difference of a rational and irrational number is always irrational."
          ],
          keyPointsBn: [
            "প্রতিটি মূলদ সংখ্যাকে সসীম বা আবৃত্ত দশমিকে প্রকাশ করা যায়।",
            "অমূলদ সংখ্যাকে p/q আকারে প্রকাশ করা যায় না যেখানে p এবং q পূর্ণসংখ্যা এবং q ≠ ০।",
            "একটি মূলদ এবং একটি অমূলদ সংখ্যার যোগফল বা বিয়োগফল সর্বদা অমূলদ হয়।"
          ]
        },
        {
          id: "laws-indices",
          chapterNameEn: "Laws of Indices",
          chapterNameBn: "সূচকের নিয়মাবলী",
          summaryEn: "Understanding exponents, laws of indices for real numbers, and solving exponential equations.",
          summaryBn: "সূচকের ধারণা, বাস্তব সংখ্যার ক্ষেত্রে সূচকের নিয়মাবলী এবং সূচকীয় সমীকরণের সমাধান।",
          keyPointsEn: [
            "a^m * a^n = a^(m+n)",
            "(a^m)^n = a^(mn)",
            "a^0 = 1 (where a ≠ 0)",
            "a^(-n) = 1/(a^n)"
          ],
          keyPointsBn: [
            "a^m * a^n = a^(m+n)",
            "(a^m)^n = a^(mn)",
            "a^0 = ১ (যেখানে a ≠ ০)",
            "a^(-n) = ১/(a^n)"
          ]
        }
      ]
    },
    {
      id: "physics",
      nameEn: "Physical Science",
      nameBn: "ভৌত বিজ্ঞান",
      icon: "🧪",
      chapters: [
        {
          id: "measurement",
          chapterNameEn: "Measurement and Units",
          chapterNameBn: "পরিমাপ ও একক",
          summaryEn: "Study of physical quantities, scalar and vector quantities, SI & CGS units, and dimensions.",
          summaryBn: "ভৌত রাশি, স্কেলার ও ভেক্টর রাশি, SI ও CGS একক এবং মাত্রার বিস্তারিত আলোচনা।",
          keyPointsEn: [
            "Fundamental units are independent (e.g., Mass, Length, Time).",
            "Derived units are formulated from fundamental units (e.g., Velocity, Force).",
            "Dimensions represent the powers to which base units are raised."
          ],
          keyPointsBn: [
            "মৌলিক এককগুলি অন্য এককের ওপর নির্ভরশীল নয় (যেমন- ভর, দৈর্ঘ্য, সময়)।",
            "লব্ধ এককগুলি মৌলিক এককের সাহায্যে গঠিত হয় (যেমন- বেগ, বল)।",
            "মাত্রা নির্দেশ করে কোন মৌলিক এককগুলি কত ঘাতে উন্নীত হয়েছে।"
          ]
        }
      ]
    }
  ],
  "10": [
    {
      id: "math",
      nameEn: "Mathematics",
      nameBn: "গণিত",
      icon: "📐",
      chapters: [
        {
          id: "quadratic-eq",
          chapterNameEn: "Quadratic Equation with One Variable",
          chapterNameBn: "একচলবিশিষ্ট দ্বিঘাত সমীকরণ",
          summaryEn: "Detailed look into quadratic equations of form ax² + bx + c = 0, finding roots using factorization and Sridhara Acharya's formula.",
          summaryBn: "ax² + bx + c = ০ আকারের দ্বিঘাত সমীকরণ, উৎপাদকে বিশ্লেষণ এবং শ্রীধর আচার্যের সূত্রের সাহায্যে বীজ নির্ণয়।",
          keyPointsEn: [
            "Sridhara Acharya's formula: x = [-b ± √(b² - 4ac)] / 2a",
            "Discriminant (D) = b² - 4ac determines the nature of the roots.",
            "If D > 0: roots are real and unequal. If D = 0: roots are real and equal. If D < 0: roots are imaginary."
          ],
          keyPointsBn: [
            "শ্রীধর আচার্যের সূত্র: x = [-b ± √(b² - ৪ac)] / ২a",
            "নিরূপক (D) = b² - ৪ac বীজের প্রকৃতি নির্ধারণ করে।",
            "D > ০ হলে বীজদ্বয় বাস্তব ও অসমান; D = ০ হলে বাস্তব ও সমান; D < ০ হলে কাল্পনিক।"
          ]
        },
        {
          id: "simple-interest",
          chapterNameEn: "Simple Interest",
          chapterNameBn: "সরল সুদকষা",
          summaryEn: "Calculation of simple interest, principal, rate of interest, and time period with practical problems.",
          summaryBn: "সরল সুদ, আসল, সুদের হার এবং সময়কাল গণনা এবং বাস্তব সমস্যার সমাধান।",
          keyPointsEn: [
            "Simple Interest Formula: I = (P * R * T) / 100",
            "Total Amount (A) = Principal (P) + Interest (I)",
            "Rate of interest (R) must be per annum and Time (T) must be in years."
          ],
          keyPointsBn: [
            "সরল সুদের সূত্র: I = (P * R * T) / ১০০",
            "সবৃদ্ধিমূল (A) = আসল (P) + মোট সুদ (I)",
            "সুদের হার (R) বার্ষিক এবং সময় (T) বছরে হিসাব করতে হয়।"
          ]
        }
      ]
    },
    {
      id: "physics",
      nameEn: "Physical Science",
      nameBn: "ভৌত বিজ্ঞান",
      icon: "🧪",
      chapters: [
        {
          id: "gas-behavior",
          chapterNameEn: "Behavior of Gases",
          chapterNameBn: "গ্যাসের আচরণ",
          summaryEn: "Exploration of Boyle's Law, Charles's Law, Avogadro's Hypothesis, and the Ideal Gas Equation.",
          summaryBn: "বয়েলের সূত্র, চার্লসের সূত্র, অ্যাভোগাড্রো সূত্র এবং আদর্শ গ্যাস সমীকরণ (PV = nRT) এর বিস্তারিত আলোচনা।",
          keyPointsEn: [
            "Boyle's Law: V ∝ 1/P at constant temperature.",
            "Charles's Law: V ∝ T at constant pressure.",
            "Ideal Gas Equation: PV = nRT = (w/M)RT.",
            "Absolute zero temperature is -273.15°C or 0 Kelvin."
          ],
          keyPointsBn: [
            "বয়েলের সূত্র: স্থির তাপমাত্রায় V ∝ ১/P।",
            "চার্লসের সূত্র: স্থির চাপে V ∝ T।",
            "আদর্শ গ্যাস সমীকরণ: PV = nRT।",
            "পরম শূন্য তাপমাত্রা হল -২৭৩.১৫°C বা ০ কেলভিন।"
          ]
        },
        {
          id: "light",
          chapterNameEn: "Light & Optics",
          chapterNameBn: "আলো",
          summaryEn: "Study of reflection on spherical mirrors, refraction through lenses, dispersion, and scattering of light.",
          summaryBn: "গলীয় দর্পণে প্রতিফলন, লেন্সের মধ্য দিয়ে প্রতিসরণ, আলোর বিচ্ছুরণ এবং বিক্ষেপণ সংক্রান্ত তত্ত্বসমূহ।",
          keyPointsEn: [
            "Mirror formula: 1/v + 1/u = 1/f",
            "Snell's Law: sin(i) / sin(r) = constant ( refractive index μ )",
            "Red light has the highest wavelength and scatters the least, which is why danger signals are red."
          ],
          keyPointsBn: [
            "দর্পণ সূত্র: ১/v + ১/u = ১/f",
            "স্নেলের সূত্র: sin(i) / sin(r) = ধ্রুবক ( প্রতিসরাঙ্ক μ )",
            "লাল আলোর তরঙ্গদৈর্ঘ্য সবচেয়ে বেশি এবং বিক্ষেপণ সবচেয়ে কম, তাই বিপদের সংকেত লাল হয়।"
          ]
        }
      ]
    },
    {
      id: "history",
      nameEn: "History",
      nameBn: "ইতিহাস",
      icon: "🏛️",
      chapters: [
        {
          id: "ideas-history",
          chapterNameEn: "Ideas of History",
          chapterNameBn: "ইতিহাসের ধারণা",
          summaryEn: "Understanding new social history, history of sports, food, arts, attire, transport, and local/national visual resources.",
          summaryBn: "নতুন সামাজিক ইতিহাস, খেলাধুলো, খাদ্যসামগ্রী, শিল্পচর্চা, পোশাক-পরিচ্ছদ এবং দৃশ্যশিল্পের ইতিহাসের আধুনিক ধারণা।",
          keyPointsEn: [
            "Social history shifted focus from kings and battles to common people.",
            "In 1911, Mohun Bagan won the IFA Shield, a historical event in Indian nationalism.",
            "Visual sources like photography and painting serve as crucial contemporary records."
          ],
          keyPointsBn: [
            "সামাজিক ইতিহাস রাজা-রানিদের বদলে সাধারণ মানুষের জীবনযাত্রার উপর ফোকাস করে।",
            "১৯১১ সালে মোহনবাগানের আইএফএ শিল্ড জয় ভারতীয় জাতীয়তাবাদের ইতিহাসে এক ঐতিহাসিক ঘটনা।",
            "ফটোগ্রাফি এবং পেইন্টিং-এর মতো দৃশ্যশিল্প সমকালীন ইতিহাসের গুরুত্বপূর্ণ উপাদান।"
          ]
        }
      ]
    }
  ],
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

export default function SchoolSection({ lang, theme, onNavigate }: SchoolSectionProps) {
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
  
  // Board Prep state
  const [selectedPrepSubTab, setSelectedPrepSubTab] = useState<"pyqs" | "syllabus" | "suggestions">("pyqs");
  const [selectedPYQId, setSelectedPYQId] = useState<string>("");
  const [showAnswerForId, setShowAnswerForId] = useState<string>("");
  
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
    }
    // Auto reset selection of subject and chapter
    const firstSubject = SUBJECTS_DATA[selectedClass]?.[0];
    if (firstSubject) {
      setSelectedSubjectId(firstSubject.id);
      setSelectedChapterId(firstSubject.chapters[0]?.id || "");
    }
  }, [selectedClass]);

  // Sync default chapter when changing subject
  useEffect(() => {
    const currentSubject = SUBJECTS_DATA[selectedClass]?.find(s => s.id === selectedSubjectId);
    if (currentSubject && currentSubject.chapters.length > 0) {
      setSelectedChapterId(currentSubject.chapters[0].id);
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

  // Get subjects for currently selected class
  const availableSubjects = SUBJECTS_DATA[selectedClass] || [];
  const currentSubjectObj = availableSubjects.find(s => s.id === selectedSubjectId);
  const currentChapterObj = currentSubjectObj?.chapters.find(c => c.id === selectedChapterId);

  // Get PYQ list for selected board
  const boardPrepPYQs = PYQS_DATA[selectedBoard] || [];
  const activePYQ = boardPrepPYQs.find(p => p.id === selectedPYQId) || boardPrepPYQs[0];

  // Auto set active PYQ if changed board
  useEffect(() => {
    if (boardPrepPYQs.length > 0) {
      setSelectedPYQId(boardPrepPYQs[0].id);
    } else {
      setSelectedPYQId("");
    }
  }, [selectedBoard]);

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
              {currentChapterObj ? (
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

                  {/* PDF Download mockup */}
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
                    <button 
                      onClick={() => alert(lang === "bn" ? "পিডিএফ ডাউনলোড শুরু হচ্ছে!" : "Downloading PDF file!")}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 transition-all cursor-pointer shadow-sm active:scale-95"
                    >
                      <Download className="h-3.5 w-3.5" />
                      {lang === "bn" ? "ডাউনলোড করুন" : "Download PDF"}
                    </button>
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
                    {activePYQ ? (
                      <div className={`rounded-2xl md:rounded-3xl border ${theme.borderCard} ${theme.bgCard} p-4 md:p-6 space-y-5 md:space-y-6 shadow-xs`}>
                        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                          <h3 className={`text-base md:text-lg font-black ${theme.textHeading}`}>
                            {lang === "bn" ? activePYQ.subjectBn : activePYQ.subjectEn} ({activePYQ.year})
                          </h3>
                          <p className={`text-[11px] md:text-xs ${theme.textMuted} font-semibold mt-1`}>
                            Board: {activePYQ.board.toUpperCase()} | {lang === "bn" ? "সম্পূর্ণ প্রশ্ন ও সমাধান গাইড" : "Complete Question & Solution Guide"}
                          </p>
                        </div>

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
    </div>
  );
}

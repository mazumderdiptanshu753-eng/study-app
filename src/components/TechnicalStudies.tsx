import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Laptop, 
  Cpu, 
  Hammer, 
  Layers, 
  HelpCircle, 
  Calculator, 
  BookOpen, 
  Trash2, 
  Upload, 
  Download, 
  Eye, 
  Check, 
  Sparkles, 
  GraduationCap, 
  Terminal, 
  RefreshCw, 
  ArrowRight, 
  Code,
  FileText,
  FileCheck,
  Car,
  Wrench
} from "lucide-react";
import { Language } from "../lib/translations";
import { ThemeConfig } from "../lib/themes";
import { StudentProfile } from "../types";
import { db } from "../lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, query, onSnapshot } from "firebase/firestore";

interface TechnicalStudiesProps {
  lang: Language;
  theme: ThemeConfig;
  profile: StudentProfile | null;
  onBack: () => void;
  initialCourse?: "btech" | "diploma";
  fixedCourseOnly?: boolean;
}

interface DynamicResource {
  id: string;
  course: "btech" | "diploma";
  branch: string;
  semester: string;
  title: string;
  description: string;
  fileName?: string;
  fileUrl?: string;
  fileType?: string;
  uploaderName: string;
  uploaderEmail: string;
  timestamp: string;
}

// Curated technical syllabus & branch guidelines
const COURSE_BRANCH_DATA = {
  btech: {
    name: "B.Tech (Bachelor of Technology)",
    bnName: "বি.টেক (ব্যাচেলর অফ টেকনোলজি)",
    duration: "4 Years (8 Semesters)",
    durationBn: "৪ বছর (৮ সেমিস্টার)",
    branches: [
      {
        id: "cse",
        name: "Computer Science & Engineering",
        bnName: "কম্পিউটার সায়েন্স এন্ড ইঞ্জিনিয়ারিং",
        icon: Laptop,
        color: "from-blue-500/10 to-blue-600/20 text-blue-600 border-blue-500/20",
        keySubjects: ["Data Structures & Algorithms", "Operating Systems", "Computer Networks", "Database Management Systems (DBMS)", "Design and Analysis of Algorithms", "Theory of Computation", "Artificial Intelligence"],
        semesters: {
          "3rd Sem": ["Data Structures", "Digital Electronics", "Discrete Mathematics", "Object Oriented Programming"],
          "4th Sem": ["Computer Architecture", "Operating Systems", "Design & Analysis of Algorithms", "Formal Language & Automata"],
          "5th Sem": ["Database Management Systems", "Computer Networks", "Software Engineering", "Microprocessors"],
          "6th Sem": ["Compiler Design", "Computer Graphics", "Machine Learning", "Distributed Systems"],
          "7th Sem": ["Information Security", "Cloud Computing", "Internet of Things", "Elective-I"],
          "8th Sem": ["Grand Viva", "Major Project & Thesis", "Industrial Management", "Elective-II"]
        }
      },
      {
        id: "ee",
        name: "Electrical Engineering",
        bnName: "ইলেকট্রিক্যাল ইঞ্জিনিয়ারিং",
        icon: Cpu,
        color: "from-amber-500/10 to-amber-600/20 text-amber-600 border-amber-500/20",
        keySubjects: ["Network Theory", "Electrical Machines", "Power Systems", "Control Systems", "Power Electronics", "Signals & Systems", "Electromagnetic Field Theory"],
        semesters: {
          "3rd Sem": ["Electric Circuit Theory", "Analog Electronics", "Electrical & Electronic Measurement", "Mathematics-III"],
          "4th Sem": ["Electrical Machines-I", "Digital Electronics", "Electromagnetic Field Theory", "Thermal Power Engineering"],
          "5th Sem": ["Electrical Machines-II", "Power Systems-I", "Control Systems-I", "Microprocessor & Microcontrollers"],
          "6th Sem": ["Power Electronics", "Power Systems-II", "Control Systems-II", "Utilization of Electric Power"],
          "7th Sem": ["Electric Drives", "Power System Protection", "High Voltage Engineering", "Renewable Energy Sources"],
          "8th Sem": ["Industrial Instrumentation", "Project Phase-II", "Energy Management & Audit", "Seminar"]
        }
      },
      {
        id: "ce",
        name: "Civil Engineering",
        bnName: "সিভিল ইঞ্জিনিয়ারিং",
        icon: Layers,
        color: "from-teal-500/10 to-teal-600/20 text-teal-600 border-teal-500/20",
        keySubjects: ["Strength of Materials", "Fluid Mechanics", "Structural Analysis", "Geotechnical Engineering", "Transportation Engineering", "Environmental Engineering", "Concrete Structures"],
        semesters: {
          "3rd Sem": ["Strength of Materials", "Fluid Mechanics", "Surveying & Geomatics", "Civil Engineering Materials"],
          "4th Sem": ["Structural Analysis-I", "Concrete Technology", "Water Resource Engineering-I", "Soil Mechanics-I"],
          "5th Sem": ["Design of RC Structures", "Structural Analysis-II", "Soil Mechanics-II", "Transportation Engineering-I"],
          "6th Sem": ["Design of Steel Structures", "Foundation Engineering", "Transportation Engineering-II", "Environmental Engineering-I"],
          "7th Sem": ["Prestressed Concrete", "Environmental Engineering-II", "Construction Project Management", "Estimating & Costing"],
          "8th Sem": ["Earthquake Engineering", "Bridge Engineering", "Project Work-II", "Comprehensive Viva"]
        }
      },
      {
        id: "me",
        name: "Mechanical Engineering",
        bnName: "মেকানিক্যাল ইঞ্জিনিয়ারিং",
        icon: Hammer,
        color: "from-rose-500/10 to-rose-600/20 text-rose-600 border-rose-500/20",
        keySubjects: ["Thermodynamics", "Fluid Mechanics & Machinery", "Strength of Materials", "Theory of Machines", "Machine Design", "Heat and Mass Transfer", "Manufacturing Processes"],
        semesters: {
          "3rd Sem": ["Engineering Thermodynamics", "Strength of Materials", "Material Science", "Mathematics-III"],
          "4th Sem": ["Fluid Mechanics & Hydraulic Machines", "Applied Thermodynamics", "Manufacturing Technology", "Kinematics of Machines"],
          "5th Sem": ["Heat Transfer", "Dynamics of Machinery", "Design of Machine Elements-I", "Metrology & Instrumentation"],
          "6th Sem": ["Design of Machine Elements-II", "Internal Combustion Engines", "Mechanical Vibrations", "Operations Research"],
          "7th Sem": ["CAD/CAM", "Refrigeration & Air Conditioning", "Automobile Engineering", "Power Plant Engineering"],
          "8th Sem": ["Mechatronics Systems", "Production & Operations Management", "Project Work-II", "Comprehensive Viva"]
        }
      }
    ]
  },
  diploma: {
    name: "Diploma in Engineering (Polytechnic)",
    bnName: "ডিপ্লোমা ইন ইঞ্জিনিয়ারিং (পলিটেকনিক)",
    duration: "3 Years (6 Semesters)",
    durationBn: "৩ বছর (৬ সেমিস্টার)",
    branches: [
      {
        id: "et",
        name: "Electrical Technology",
        bnName: "ইলেকট্রিক্যাল টেকনোলজি",
        icon: Cpu,
        color: "from-yellow-500/10 to-yellow-600/20 text-yellow-600 border-yellow-500/20",
        keySubjects: ["Basic Electrical Engineering", "Electrical Circuit", "Electrical Machines", "Power System", "Electrical Measurement", "Industrial Electronics"],
        semesters: {
          "1st Sem": ["Communication Skills", "Applied Physics-I", "Applied Chemistry-I", "Mathematics-I"],
          "2nd Sem": ["Applied Physics-II", "Applied Chemistry-II", "Mathematics-II", "Basic Electrical Engineering"],
          "3rd Sem": ["Electrical Circuits", "Electrical Measurements-I", "Analog Electronics", "Computer Applications"],
          "4th Sem": ["Electrical Machines-I", "Electrical Measurements-II", "Power System-I", "Digital Electronics"],
          "5th Sem": ["Electrical Machines-II", "Power System-II", "Control System", "Industrial Electronics"],
          "6th Sem": ["Switchgear & Protection", "Electrical Design Estimation", "Project Work & Industrial Training", "Grand Viva"]
        }
      },
      {
        id: "mt",
        name: "Mechanical Technology",
        bnName: "মেকানিক্যাল টেকনোলজি",
        icon: Hammer,
        color: "from-red-500/10 to-red-600/20 text-red-600 border-red-500/20",
        keySubjects: ["Engineering Mechanics", "Thermal Engineering", "Machine Drawing", "Strength of Materials", "Fluid Mechanics", "Theory of Machines"],
        semesters: {
          "1st Sem": ["Communication Skills", "Applied Physics-I", "Applied Chemistry-I", "Mathematics-I"],
          "2nd Sem": ["Applied Physics-II", "Applied Chemistry-II", "Mathematics-II", "Workshop Practice-I"],
          "3rd Sem": ["Engineering Mechanics", "Thermal Engineering-I", "Machine Drawing", "Workshop Practice-II"],
          "4th Sem": ["Strength of Materials", "Thermal Engineering-II", "Manufacturing Processes-I", "Theory of Machines"],
          "5th Sem": ["Fluid Mechanics & Machinery", "Design of Machine Elements", "Manufacturing Processes-II", "Industrial Engineering"],
          "6th Sem": ["Power Plant Engineering", "Mechatronics & CNC Machines", "Project Work & Seminar", "Grand Viva"]
        }
      },
      {
        id: "at",
        name: "Automobile Technology",
        bnName: "অটোমোবাইল টেকনোলজি",
        icon: Car,
        color: "from-blue-500/10 to-blue-600/20 text-blue-600 border-blue-500/20",
        keySubjects: ["Automotive Engines", "Chassis, Body & Transmission", "Auto Electrical & Electronics", "Vehicle Maintenance & Garage Practice", "Two & Three Wheelers", "Vehicle Dynamics"],
        semesters: {
          "1st Sem": ["Communication Skills", "Applied Physics-I", "Applied Chemistry-I", "Mathematics-I"],
          "2nd Sem": ["Applied Physics-II", "Applied Chemistry-II", "Mathematics-II", "Workshop Practice-I"],
          "3rd Sem": ["Automotive Materials", "Strength of Materials", "Thermal Engineering", "Machine Drawing"],
          "4th Sem": ["Automotive Engines", "Chassis & Transmission", "Manufacturing Technology", "Theory of Machines"],
          "5th Sem": ["Auto Electrical & Electronic Systems", "Vehicle Maintenance", "Two & Three Wheeler Systems", "Industrial Engineering & Management"],
          "6th Sem": ["Electric & Hybrid Vehicles", "Automotive Design & Estimation", "Project Work & Seminar", "Grand Viva"]
        }
      }
    ]
  }
};

export default function TechnicalStudies({ 
  lang, 
  theme, 
  profile, 
  onBack,
  initialCourse = "diploma",
  fixedCourseOnly = false
}: TechnicalStudiesProps) {
  const [course, setCourse] = useState<"btech" | "diploma">(initialCourse);
  const [selectedBranch, setSelectedBranch] = useState<string>(initialCourse === "diploma" ? "et" : "cse");
  const [selectedSem, setSelectedSem] = useState<string>("3rd Sem");
  const [activeSubTab, setActiveSubTab] = useState<"syllabus" | "simulator" | "calculator" | "aiAssistant" | "uploads">("syllabus");

  // Dynamic resources state loaded from Firestore or LocalStorage
  const [dynamicResources, setDynamicResources] = useState<DynamicResource[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form states for uploading material
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadFileUrl, setUploadFileUrl] = useState("");
  const [uploadFileType, setUploadFileType] = useState<"pdf" | "image" | "none">("pdf");

  // Logic Gate Simulator States
  const [gateInA, setGateInA] = useState<boolean>(true);
  const [gateInB, setGateInB] = useState<boolean>(false);
  const [gateInC, setGateInC] = useState<boolean>(true);

  // Electrical Solver states
  const [calcVoltage, setCalcVoltage] = useState("230");
  const [calcResistance, setCalcResistance] = useState("50");
  const [calcInductance, setCalcInductance] = useState("0.1"); // in Henry
  const [calcCapacitance, setCalcCapacitance] = useState("50"); // in microFarad
  const [calcFrequency, setCalcFrequency] = useState("50"); // in Hz
  const [electricOutput, setElectricOutput] = useState<any>(null);

  // AI assistant states
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiChatHistory, setAiChatHistory] = useState<{ role: "user" | "model"; text: string }[]>([
    {
      role: "model",
      text: lang === "bn" 
        ? "হ্যালো প্রকৌশলী! আমি আপনার বি.টেক ও ডিপ্লোমা এআই ল্যাব অ্যাসিস্ট্যান্ট। কোডিং, সার্কিট বিশ্লেষণ, থার্মোডাইনামিক্স বা যেকোনো জটিল বৈজ্ঞানিক বিষয়ের প্রশ্ন এখানে জিজ্ঞেস করতে পারেন।"
        : "Hello Engineer! I am your AI Lab & Technical Assistant. Ask me anything about programming, algorithms, electrical circuit calculations, structural concrete, or manufacturing design."
    }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Base Conversion states
  const [numDecimal, setNumDecimal] = useState("42");
  const [numBinary, setNumBinary] = useState("101010");
  const [numHex, setNumHex] = useState("2A");

  const currentCourseData = COURSE_BRANCH_DATA[course];
  const activeBranchObj = currentCourseData.branches.find(b => b.id === selectedBranch) || currentCourseData.branches[0];

  // Helper to generate official syllabus and materials for Diploma on-the-fly
  const getStaticResources = (courseVal: "btech" | "diploma", langVal: string): DynamicResource[] => {
    return [];
  };

  const getSemFocusInfo = (courseVal: "btech" | "diploma", branchId: string, sem: string, langVal: string) => {
    const focus: { title: string; bnTitle: string; desc: string; keyPoints: string[] } = {
      title: "Semester Focus & Lab Guide",
      bnTitle: "সেমিস্টার ফোকাস ও ল্যাব গাইড",
      desc: langVal === "bn" 
        ? `${sem}-এর মূল ল্যাব ও থিওরি ভিত্তিক দক্ষতা উন্নয়ন গাইড।` 
        : `Key topics and critical technical laboratory competencies to master in ${sem}.`,
      keyPoints: []
    };

    if (courseVal === "btech") {
      if (branchId === "cse") {
        if (sem === "3rd Sem") {
          focus.desc = langVal === "bn" 
            ? "ডাটা স্ট্রাকচার ও অবজেক্ট অরিয়েন্টেড প্রোগ্রামিং-এর সুদৃঢ় ভিত্তি তৈরি করুন।" 
            : "Build robust foundations in core structures and object-oriented architectures.";
          focus.keyPoints = langVal === "bn" 
            ? ["রৈখিক ও অ-রৈখিক ডাটা স্ট্রাকচার", "ডিজিটাল সার্কিট ও গেট মিনিমাইজেশন", "জাভা/সি++ অবজেক্ট মডেল ও মেমরি", "ডিসক্রিট ম্যাথমেটিক্স সমাধান"]
            : ["Linear & Non-linear Data Structures", "Digital Circuits & Gate Minimization", "OOP Paradigms & Memory Allocations", "Discrete Mathematics Proofs"];
        } else if (sem === "4th Sem") {
          focus.desc = langVal === "bn" 
            ? "অপারেটিং সিস্টেমের মেকানিজম এবং অ্যালগরিদম কমপ্লেক্সিসিটি অ্যানালাইসিস।" 
            : "Understand core Operating System logic and rigorous design of algorithms.";
          focus.keyPoints = langVal === "bn" 
            ? ["অ্যালগরিদমের টাইম ও স্পেস কমপ্লেক্সিসিটি", "প্রসেস শিডিউলিং ও ভার্চুয়াল মেমরি", "কম্পিউটার রেজিস্টার ও পাইপলাইনিং", "অটোমেটা, ডিএফএ ও ব্যাকাস-নাউর ফর্ম"]
            : ["Asymptotic Time & Space Bounds", "CPU Scheduling & Virtual Memory", "Instruction Pipeline & Cache Control", "Automata, DFA & Parsing Grammars"];
        } else if (sem === "5th Sem") {
          focus.desc = langVal === "bn" 
            ? "ডাটাবেজ নরমালাইজেশন এবং নেটওয়ার্ক প্রোটোকল কনফিগারেশন।" 
            : "Dive into relational DB normalization and networking socket designs.";
          focus.keyPoints = langVal === "bn" 
            ? ["SQL কুয়েরি ও ৩-এনএফ নরমালাইজেশন", "টিসিপি/আইপি পোর্ট এবং রাউটিং স্কিম", "এসডিএলসি স্পেসিফিকেশন ও আর্কিটেকচার", "৮০৮৫/৮০৮৬ অ্যাসেম্বলি ল্যাব লজিক"]
            : ["SQL Queries & 3NF Normalization", "TCP/IP Sockets & Routing Algorithms", "SDLC Agiles & Design Patterns", "8085/8086 Assembly Programming"];
        } else if (sem === "6th Sem") {
          focus.desc = langVal === "bn" 
            ? "কম্পাইলার ফেজ এবং মেশিন লার্নিং ডিশিসন মেকিং।" 
            : "Master parsing phases of Compilers and Predictive Machine Learning models.";
          focus.keyPoints = langVal === "bn" 
            ? ["লেক্সিকাল ও এলআর পার্সিং ফেজ", "সুপারভাইজড ও আনসুপারভাইজড লার্নিং", "গ্রাফিক্স রাস্টারাইজেশন ল্যাব", "ডিস্ট্রিবিউটেড রিমোট কলিং (RPC)"]
            : ["Lexical & LR Parsing Automata", "Supervised/Unsupervised Algorithms", "OpenGL Graphics Rasterization", "Distributed Systems & Consensus"];
        } else if (sem === "7th Sem") {
          focus.desc = langVal === "bn" 
            ? "ক্লাউড নেটিভ আর্কিটেকচার এবং ইনফরমেশন ক্রিপ্টোগ্রাফি।" 
            : "Design enterprise secure clouds and robust hardware iot interfaces.";
          focus.keyPoints = langVal === "bn" 
            ? ["ক্রিপ্টোগ্রাফিক অ্যালগরিদম ও অডিট", "এডাব্লিউএস/জিসিপি ক্লাউড ডেপ্লয়মেন্ট", "আইওটি সেন্সর নেটওয়ার্কিং ল্যাব", "স্পেশাল ইলেকটিভ ও ডোমেইন স্টাডি"]
            : ["Symmetric/Asymmetric Cryptography", "AWS/GCP Native Serverless Deploy", "IoT Sensor APIs & Microcontrollers", "Domain Elective Specializations"];
        } else {
          focus.desc = langVal === "bn" 
            ? "ক্যাপস্টোন প্রজেক্টের চূড়ান্ত প্রকাশ এবং ক্যারিয়ারের সম্পূর্ণ প্রস্তুতি।" 
            : "Finalize high-impact Capstone software, thesis defense and placement prep.";
          focus.keyPoints = langVal === "bn" 
            ? ["মেজর প্রজেক্ট ইন্টিগ্রেশন ও ডেপ্লয়", "ইন্ডাস্ট্রিয়াল ম্যানেজমেন্ট প্রিন্সিপাল", "গ্র্যান্ড ভাইভা প্র্যাকটিস সেশন", "প্রফেশনাল এথিক্স ও প্রোটোকল"]
            : ["Major Project Build & Deployment", "Industrial Economics & Management", "Technical VIVA Voce Simulations", "Ethics, IP Rights & Guidelines"];
        }
      } else if (branchId === "ee") {
        if (sem === "3rd Sem") {
          focus.desc = langVal === "bn" 
            ? "বৈদ্যুতিক নেটওয়ার্ক থিওরেম এবং অ্যানালগ অ্যামপ্লিফায়ার ল্যাব।" 
            : "Analyze circuits using matrix equations and study diode characteristics.";
          focus.keyPoints = langVal === "bn" 
            ? ["কেসিএল, কেভিএল ও নর্টন থিওরেম", "বিজেটি ও অপ-অ্যাম্প ক্যাসকেড ল্যাব", "ভোল্টমিটার ও গ্যালভানোমিটার ক্যালিব্রেশন", "ল্যাপ্লাস ও ফুরিয়ার গণিত সমাধান"]
            : ["Nodal, Mesh & Norton Theorems", "Op-Amp Cascade Configuration", "Ammeter & Galvanometer Shunts", "Laplace & Fourier Analysis"];
        } else if (sem === "4th Sem") {
          focus.desc = langVal === "bn" 
            ? "ট্রান্সফরমার কাপলিং, ডিসি মোটর ক্যাটাগরি এবং পাওয়ার প্ল্যান্ট।" 
            : "Understand electromagnetics, DC machine coils and thermal cycles.";
          focus.keyPoints = langVal === "bn" 
            ? ["একক ও ৩-ফেজ ট্রান্সফরমার কোরের আচরণ", "ডিসি শান্ট ও সিরিজ মোটরের লোড কার্ভ", "ডিজিটাল ফ্লিপ-ফ্লপ ও সিকোয়েন্সিয়াল সার্কিট", "র‍্যাঙ্কিন সাইকেল ও থার্মাল জেনারেশন"]
            : ["1-Phase & 3-Phase Transformers", "DC Shunt & Series Motor Testing", "Flip-Flops & Counter Schematics", "Rankine Cycle & Coal Power Plants"];
        } else if (sem === "5th Sem") {
          focus.desc = langVal === "bn" 
            ? "সিংক্রোনাস জেনারেটর এবং ফিডব্যাক কন্ট্রোল ডিজাইন।" 
            : "Study synchronous induction systems and root locus stability charts.";
          focus.keyPoints = langVal === "bn" 
            ? ["সিংক্রোনাস অল্টারনেটর ও মোটর উইন্ডিং", "ওভারহেড পাওয়ার ট্রান্সমিশন প্যারামিটার", "কন্ট্রোল সিস্টেমের রুট লোকাস ও স্টেবিলিটি", "৮০৮৫ মাইক্রোপ্রসেসর আর্কিটেকচার"]
            : ["Alternator Windings & Armatures", "ABCD Parameters & Overhead Lines", "Root Locus & Nyquist Stability", "8085 Assembly & Peripheral Chips"];
        } else {
          focus.desc = langVal === "bn" 
            ? "থাইরিস্টর পাওয়ার কনভার্টার এবং সাবস্টেশন প্রোটেকশন।" 
            : "Model power converters, high voltage circuit breakers and energy audits.";
          focus.keyPoints = langVal === "bn" 
            ? ["এসসিআর, ট্রায়াক ও ইনভার্টার কন্ডাকশন", "রিলে এবং সার্কিট ব্রেকার ওয়্যারিং স্কিম", "সোলার ও উইন্ড পাওয়ার গ্রিড ইন্টিগ্রেশন", "মোটর ড্রাইভ স্পিড কন্ট্রোল টেকনিক্স"]
            : ["SCR, TRIAC, Chopper Converters", "Relays & SF6 Circuit Breaker Layout", "Solar & Wind Grid-tie Inverters", "Variable Frequency AC Drives"];
        }
      } else if (branchId === "ce") {
        if (sem === "3rd Sem") {
          focus.desc = langVal === "bn" 
            ? "বস্তুর শক্তি (Strength of Materials) এবং ফ্লুইড মেকানিক্স।" 
            : "Evaluate tension, compression, bending and hydrostatics of water.";
          focus.keyPoints = langVal === "bn" 
            ? ["স্ট্রেস-স্ট্রেন ডায়াগ্রাম ও হুকস ল", "বার্নৌলির উপপাদ্য ও ভেন্টুরিং পাইপ", "কম্পাস ও থিওডোলাইট সার্ভে ল্যাব", "ইট, সিমেন্ট ও কংক্রিট স্যাম্পল টেস্ট"]
            : ["Stress-Strain Curves & Young Modulus", "Bernoulli's Theorem & Venturimeter", "Compass, Theodolite & Leveling", "Aggregates, Cement & Admixtures"];
        } else {
          focus.desc = langVal === "bn" 
            ? "আরসিসি স্ট্রাকচারাল ডিজাইন এবং সয়েল বিয়ারিং টেস্ট।" 
            : "Design safe reinforced concrete beams and determine shear strength of soil.";
          focus.keyPoints = langVal === "bn" 
            ? ["আরসিসি বিম ও ওয়ান-ওয়ে স্ল্যাব ডিজাইন", "মাটির প্লাস্টিসিটি ও ডাইরেক্ট শিয়ার টেস্ট", "বোল্টেড ও ওয়েল্ডেড স্টিল ট্রাস জয়েন্ট", "ফ্লেক্সিবল ও রিজিড রোড ডাস্ট লেআউট"]
            : ["RCC Beam & One-Way Slab Design", "Soil Compaction & Direct Shear Labs", "Bolted & Welded Steel Trusses", "Flexible & Rigid Highway Pavement"];
        }
      } else {
        // me
        if (sem === "3rd Sem") {
          focus.desc = langVal === "bn" 
            ? "ইঞ্জিনিয়ারিং থার্মোডাইনামিক্স এবং ক্রিস্টাল ল্যাটিস।" 
            : "Understand energy balances, gas equations and metal grains.";
          focus.keyPoints = langVal === "bn" 
            ? ["তাপগতিবিদ্যার প্রথম ও দ্বিতীয় সূত্র", "শ্যাফট টরশন ও বিয়ারিং স্ট্রেস", "ধাতুর ক্রিস্টাল ডায়াগ্রাম ও হিট ট্রিটমেন্ট", "ভেক্টর ইন্টিগ্রেশন ও লিনিয়ার ডিফারেনশিয়াল"]
            : ["1st & 2nd Laws of Thermodynamics", "Shaft Torsion & Bending Stresses", "Crystal Lattices & Heat Treatments", "Vector Calculus & Linear ODEs"];
        } else {
          focus.desc = langVal === "bn" 
            ? "ফ্লুইড রোটো-ডাইনামিক টারবাইন এবং machine পার্ট ডিজাইন।" 
            : "Analyze pump performance curves and design complex gears and clutches.";
          focus.keyPoints = langVal === "bn" 
            ? ["পেল্টন, ফ্রান্সিস ও কাপলান হাইড্রোলিক টারবাইন", "কন্ডাকশন ও রেডিয়েশন হিট ট্রান্সফার সমীকরণ", "শ্যাফট, গিয়ার ও কী-জয়েন্ট ডিজাইন", "আইসি ইঞ্জিন থার্মাল এফিসিয়েন্সি ল্যাব"]
            : ["Pelton, Francis & Kaplan Turbines", "Conduction & Radiation Handouts", "Shaft, Keys, Gears & Clutch Designs", "IC Engine Performance Testing"];
        }
      }
    } else {
      // diploma
      if (branchId === "et") {
        if (sem === "1st Sem" || sem === "2nd Sem") {
          focus.desc = langVal === "bn" 
            ? "মৌলিক কারিগরি বিজ্ঞান এবং ইন্জিনিয়ারিং গণিত।" 
            : "General engineering sciences and core mathematics foundation.";
          focus.keyPoints = langVal === "bn" 
            ? ["ইংরেজি টেকনিক্যাল কমিউনিকেশন স্কিল", "মৌলিক পদার্থবিজ্ঞান ও ওয়েভ অপটিক্স", "মৌলিক রসায়ন, ফুয়েল ও লুব্রিকেন্ট", "গণিত - বীজগণিত ও ত্রিকোণমিতি"]
            : ["Technical English & Grammar", "Units, Dimensions & Physics Labs", "Electrochemistry & Metallurgy", "Algebra, Vectors & Trigonometry"];
        } else if (sem === "3rd Sem") {
          focus.desc = langVal === "bn" 
            ? "মৌলিক সার্কিট থিওরেম এবং ডায়োড ক্যারেক্টারিস্টিক ল্যাব।" 
            : "Explore fundamental electrical circuits and semiconductor devices.";
          focus.keyPoints = langVal === "bn" 
            ? ["কেসিএল, কেভিএল ও এসি ফান্ডামেন্টাল", "পিএমএমসি ও এমআই ইনস্ট্রুমেন্ট ক্যালিব্রেশন", "সেমিকন্ডাক্টর ডায়োড ও বিজেটি বায়াসিং", "কম্পিউটার অ্যাপ্লিকেশন ও অফিস অটোমেশন"]
            : ["KCL, KVL & AC Circuit Theorems", "PMMC, MI Instrument Calibration", "Diodes, BJTs & Multi-vibrators", "Office Tools & OS Operations"];
        } else if (sem === "4th Sem") {
          focus.desc = langVal === "bn" 
            ? "ডিসি জেনারেটর ওয়ার্কিং প্রিন্সিপাল এবং কম্বিনেশনাল লজিক।" 
            : "Learn working of DC machines, grid structures and digital gates.";
          focus.keyPoints = langVal === "bn" 
            ? ["ডিসি মোটর এবং ট্রান্সফরমার অপারেশন", "ডিজিটাল লজিক গেটস, কাউন্টার ও মার্ক্স", "পাওয়ার ট্রান্সমিশন লাইন ও ইনসুলেটর", "ইনস্ট্রুমেন্ট ট্রান্সফরমার (CT/PT) সংযোগ"]
            : ["DC Motor & Transformer Tests", "Logic Gates, Counters & Mux", "Overhead Lines & Insulators", "Current & Potential Transformers"];
        } else if (sem === "5th Sem") {
          focus.desc = langVal === "bn" 
            ? "এসি থ্রি-ফেজ ইন্ডাকশন এবং ইন্ডাস্ট্রিয়াল পাওয়ার এসসিআর।" 
            : "Learn induction speed control and high power industrial rectifiers.";
          focus.keyPoints = langVal === "bn" 
            ? ["৩-ফেজ ইন্ডাকশন ও সিংক্রোনাস অল্টারনেটর", "সাবস্টেশন লেআউট ও ক্যাবলস", "পিআইডি কন্ট্রোলার ট্রান্সফার ফাংশন", "থাইরিস্টর কনভার্টার ও ইনভার্টার"]
            : ["3-Phase Induction & Synch Motors", "Substation Equipment Layouts", "PID Controller Transfer Functions", "Thyristors, TRIACs & Choppers"];
        } else {
          focus.desc = langVal === "bn" 
            ? "সুইচগিয়ার অ্যান্ড প্রোটেকশন রিলে এবং ওয়্যারিং এস্টিমেশন।" 
            : "Master switchgear relay controls, wiring estimation and capstone design.";
          focus.keyPoints = langVal === "bn" 
            ? ["সার্কিট ব্রেকার ও রিলে ট্রিপিং স্কিম", "হাউস ও কমার্শিয়াল ওয়্যারিং এস্টিমেশন", "ইন্ডাস্ট্রিয়াল প্রজেক্ট মেকিং ও জমা", "কম্প্রিহেনসিভ গ্র্যান্ড ভাইভা সেশন"]
            : ["Fuses, MCBs, Relays Schematics", "Domestic & Industrial Estimating", "Practical Project Submission", "Comprehensive VIVA Practice"];
        }
      } else if (branchId === "mt") {
        if (sem === "1st Sem" || sem === "2nd Sem") {
          focus.desc = langVal === "bn" 
            ? "মৌলিক ওয়ার্কশপ মেটাল ফিটিং এবং ড্রয়িং।" 
            : "Master general sciences and hand tool fitting practices.";
          focus.keyPoints = langVal === "bn" 
            ? ["ইংরেজি গ্রামার ও রাইটিং", "পদার্থ ও রসায়ন ল্যাব সেশন", "ওয়ার্কশপ কার্পেন্ট্রি ও জয়েন্ট মেকিং", "ইঞ্জিনিয়ারিং প্রজেকশন ড্রইং"]
            : ["Technical English & Grammar", "Physics & Chemistry Labs", "Carpentry & Welding Practices", "Orthographic Projection Drawings"];
        } else if (sem === "3rd Sem") {
          focus.desc = langVal === "bn" 
            ? "ইঞ্জিনিয়ারিং মেকানিক্স এবং বয়লার মাউন্টিং অ্যাক্সেসরিজ।" 
            : "Explore forces, trusses and thermal generation cycles.";
          focus.keyPoints = langVal === "bn" 
            ? ["ল্যামিস সূত্রাবলী ও ফ্রিকশন ল্যাব", "বয়লার ড্রাম ও কন্ডেনসার বৈশিষ্ট্য", "অটোক্যাড ২ডি ড্রয়িং শিট", "ওয়ার্কশপ লেদ ও শেপার মেশিন চালনা"]
            : ["Lami's Theorem & Friction", "Boiler Mountings & Accessories", "2D Orthographic CAD Drafting", "Lathe & Shaper Metal Cutting"];
        } else {
          focus.desc = langVal === "bn" 
            ? "মেটাল মেকানিক্যাল ক্যারেক্টারিস্টিক ও থার্মাল ইঞ্জিনিয়ারিং।" 
            : "Master CNC machining, machine assembly and manufacturing design.";
          focus.keyPoints = langVal === "bn" 
            ? ["টেনসাইল স্ট্রেস, শিয়ার ও টরশন টেস্ট", "গিয়ার ট্রেন ও ফ্লাইহুইল ক্যালকুলেশন", "সেন্ট্রিফিউগাল পাম্প ও টারবাইন অপারেশন", "সিএনসি মেশিন এম ও জি কোড প্রোগ্রামিং"]
            : ["Tensile, Shear and Torsion Tests", "Gear Trains & Governors", "Centrifugal Pumps & Turbines", "CNC Codes & Manufacturing Design"];
        }
      } else {
        // automobile
        if (sem === "1st Sem" || sem === "2nd Sem") {
          focus.desc = langVal === "bn" 
            ? "অটোমোবাইল সেফটি ও ইঞ্জিন লেআউট লেকচার।" 
            : "Foundational sciences and basic automotive engine workshop safety.";
          focus.keyPoints = langVal === "bn" 
            ? ["ইংলিশ ও কমুনিকেশন", "পদার্থবিজ্ঞান ও রসায়ন প্র্যাকটিক্যাল", "শিট মেটাল জয়েন্ট ও শোল্ডারিং ল্যাব", "অটোমোবাইল সেফটি রুলস ও শপ লেআউট"]
            : ["Technical English & Grammar", "Applied Engineering Sciences", "Sheet Metal & Wiring Practice", "Vehicle Safety & Workshop Layout"];
        } else {
          focus.desc = langVal === "bn" 
            ? "ইঞ্জিন মেকানিজম, ট্রান্সমিশন ও ভেহিকল মেইনটেন্যান্স।" 
            : "Analyze combustion chamber designs, transmission lines and EV motors.";
          focus.keyPoints = langVal === "bn" 
            ? ["আইসি ইঞ্জিন ও ফুয়েল ইনজেকশন সিস্টেমস", "ক্লাচ, গিয়ারবক্স ও ডিফারেনশিয়াল এসেম্বলি", "ব্যাটারি চার্জিং ও ফুয়েল লাইন ডায়াগনস্টিক", "ইলেকট্রিক ও হাইব্রিড ভেহিকল আর্কিটেকচার"]
            : ["IC Engines & Fuel Injection", "Clutch, Gearbox & Differential", "Battery Capacity & Cell Diagnostics", "Electric & Hybrid Vehicle Motors"];
        }
      }
    }

    return focus;
  };

  const filteredResources = [
    ...getStaticResources(course, lang),
    ...dynamicResources
  ].filter(r => r.course === course && r.branch === selectedBranch && r.semester === selectedSem)
   .sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  useEffect(() => {
    // Sync dynamic uploaded documents from Firestore
    try {
      const q = query(collection(db, "technicalResources"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const loaded: DynamicResource[] = [];
        snapshot.forEach((docSnap) => {
          loaded.push({ id: docSnap.id, ...docSnap.data() } as DynamicResource);
        });
        setDynamicResources(loaded.sort((a, b) => b.timestamp.localeCompare(a.timestamp)));
      }, (err) => {
        console.warn("Firestore collection technicalResources failed, reading local storage:", err);
        const local = localStorage.getItem("local_technical_resources");
        if (local) {
          try {
            setDynamicResources(JSON.parse(local));
          } catch(e) {}
        }
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn("Firestore listener not available, reading local storage.");
      const local = localStorage.getItem("local_technical_resources");
      if (local) {
        try {
          setDynamicResources(JSON.parse(local));
        } catch(e) {}
      }
    }
  }, []);

  // Sync B.Tech/Diploma standard branch transition
  useEffect(() => {
    if (course === "btech") {
      setSelectedBranch("cse");
      setSelectedSem("3rd Sem");
    } else {
      setSelectedBranch("et");
      setSelectedSem("3rd Sem");
      if (activeSubTab !== "syllabus" && activeSubTab !== "uploads") {
        setActiveSubTab("syllabus");
      }
    }
  }, [course]);

  // Handle Dynamic file reading for simulation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFileName(file.name);
    
    // Determine attachment type
    if (file.type === "application/pdf") {
      setUploadFileType("pdf");
    } else if (file.type.startsWith("image/")) {
      setUploadFileType("image");
    } else {
      setUploadFileType("none");
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUploadFileUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profile?.role !== "Admin") {
      alert(lang === "bn" ? "দুঃখিত, শুধুমাত্র অ্যাডমিনরা ম্যাটেরিয়াল আপলোড করতে পারবেন।" : "Sorry, only admins are allowed to upload materials.");
      return;
    }
    if (!uploadTitle.trim()) {
      alert(lang === "bn" ? "দয়া করে একটি শিরোনাম প্রদান করুন।" : "Please enter a title.");
      return;
    }
    setIsUploading(true);

    const newResource: Omit<DynamicResource, "id"> = {
      course,
      branch: selectedBranch,
      semester: selectedSem,
      title: uploadTitle,
      description: uploadDesc,
      fileName: uploadFileName || undefined,
      fileUrl: uploadFileUrl || undefined,
      fileType: uploadFileType,
      uploaderName: profile?.fullName || "Faculty Advisor",
      uploaderEmail: profile?.email || "faculty@studyhub.edu",
      timestamp: new Date().toISOString()
    };

    try {
      if (db) {
        await addDoc(collection(db, "technicalResources"), newResource);
      } else {
        const local = localStorage.getItem("local_technical_resources");
        let list: DynamicResource[] = [];
        if (local) {
          try { list = JSON.parse(local); } catch(e){}
        }
        const created: DynamicResource = { id: `tech-res-${Date.now()}`, ...newResource };
        list.unshift(created);
        setDynamicResources(list);
        localStorage.setItem("local_technical_resources", JSON.stringify(list));
      }

      setUploadTitle("");
      setUploadDesc("");
      setUploadFileName("");
      setUploadFileUrl("");
      setUploadFileType("pdf");
      alert(lang === "bn" ? "রিসোর্স সফলভাবে আপলোড করা হয়েছে!" : "Resource successfully uploaded!");
    } catch (err: any) {
      console.error("Upload error:", err);
      alert("Failed to save resource: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (!window.confirm(lang === "bn" ? "আপনি কি নিশ্চিত যে এটি ডিলিট করতে চান?" : "Are you sure you want to delete this resource?")) {
      return;
    }
    try {
      if (db) {
        await deleteDoc(doc(db, "technicalResources", id));
      } else {
        const remaining = dynamicResources.filter(r => r.id !== id);
        setDynamicResources(remaining);
        localStorage.setItem("local_technical_resources", JSON.stringify(remaining));
      }
    } catch(err: any) {
      console.error("Delete error:", err);
    }
  };

  // Base Converter helper
  const handleDecimalChange = (val: string) => {
    setNumDecimal(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed)) {
      setNumBinary(parsed.toString(2));
      setNumHex(parsed.toString(16).toUpperCase());
    } else {
      setNumBinary("");
      setNumHex("");
    }
  };

  // Electrical Solver Engine
  const calculateElectricSystem = () => {
    const V = parseFloat(calcVoltage);
    const R = parseFloat(calcResistance);
    const L = parseFloat(calcInductance);
    const C_uF = parseFloat(calcCapacitance);
    const f = parseFloat(calcFrequency);

    if (isNaN(V) || isNaN(R) || isNaN(L) || isNaN(C_uF) || isNaN(f)) {
      alert("Please enter valid numeric parameters!");
      return;
    }

    const C = C_uF * 1e-6; // conversion to Farad
    const omega = 2 * Math.PI * f;
    const X_L = omega * L;
    const X_C = C > 0 ? 1 / (omega * C) : 0;
    
    // Impedance calculation Z = sqrt(R^2 + (X_L - X_C)^2)
    const reactanceDiff = X_L - X_C;
    const Z = Math.sqrt(R * R + reactanceDiff * reactanceDiff);
    const current = Z > 0 ? V / Z : 0;
    const powerFactor = Z > 0 ? R / Z : 1;
    const activePower = V * current * powerFactor; // P = V * I * cos(phi)

    // Resonant Frequency f_r = 1 / (2 * pi * sqrt(L * C))
    const resonantFreq = L * C > 0 ? 1 / (2 * Math.PI * Math.sqrt(L * C)) : 0;

    setElectricOutput({
      reactanceL: X_L.toFixed(3),
      reactanceC: X_C.toFixed(3),
      impedance: Z.toFixed(3),
      current: current.toFixed(3),
      powerFactor: powerFactor.toFixed(3),
      activePower: activePower.toFixed(2),
      resonantFreq: resonantFreq.toFixed(2)
    });
  };

  // AI Assistant trigger
  const handleAskAi = async () => {
    if (!aiPrompt.trim()) return;
    const userMsg = aiPrompt;
    setAiChatHistory(prev => [...prev, { role: "user", text: userMsg }]);
    setAiPrompt("");
    setIsAiLoading(true);

    try {
      const response = await fetch("/api/technical-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMsg,
          courseContext: course,
          branchContext: selectedBranch,
          language: lang
        })
      });
      const data = await response.json();
      if (data.reply) {
        setAiChatHistory(prev => [...prev, { role: "model", text: data.reply }]);
      } else {
        setAiChatHistory(prev => [...prev, { role: "model", text: lang === "bn" ? "দুঃখিত, এআই সার্ভার উত্তর দিতে পারছে না। পরে আবার চেষ্টা করুন।" : "Sorry, the AI service encountered an issue. Please try again later." }]);
      }
    } catch (e: any) {
      console.error("AI error:", e);
      setAiChatHistory(prev => [...prev, { role: "model", text: "Error: " + e.message }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Logic values
  const outAnd = gateInA && gateInB ? 1 : 0;
  const outOr = gateInA || gateInB ? 1 : 0;
  const outNot = !gateInC ? 1 : 0;
  const outNand = !(gateInA && gateInB) ? 1 : 0;
  const outXor = (gateInA ? 1 : 0) ^ (gateInB ? 1 : 0) ? 1 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6 lg:space-y-8 max-w-7xl mx-auto px-1"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl border border-slate-200/50 bg-white/75 backdrop-blur-md shadow-xs">
        <div className="space-y-1">
          <span className={`inline-flex items-center gap-1.5 rounded-full ${theme.badgeBg} px-3 py-1 text-[10px] font-black ${theme.badgeText} uppercase tracking-wider`}>
            <Terminal className="h-3 w-3 animate-pulse" /> {course === "diploma" ? (lang === "bn" ? "ডিপ্লোমা কর্নার" : "Polytechnic Corner") : (lang === "bn" ? "বি.টেক কর্নার" : "Engineering Portal")}
          </span>
          <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${theme.textHeading}`}>
            {course === "diploma"
              ? (lang === "bn" ? "পলিটেকনিক ডিপ্লোমা ইঞ্জিনিয়ারিং হাব" : "Polytechnic Diploma Engineering Hub")
              : (lang === "bn" ? "বি.টেক ইঞ্জিনিয়ারিং হাব" : "B.Tech Engineering Hub")
            }
          </h1>
          <p className={`text-xs sm:text-sm font-medium ${theme.textMuted}`}>
            {course === "diploma"
              ? (lang === "bn"
                ? "৩ বছর মেয়াদী পলিটেকনিক ডিপ্লোমা শিক্ষার্থীদের জন্য সেমিস্টার সিলেবাস, প্রিভিয়াস ইয়ারের প্রশ্ন ও ল্যাব।"
                : "Official 3-year polytechnic diploma semesters syllabus, previous years' questions, lecture notes & simulation tools.")
              : (lang === "bn"
                ? "বি.টেক (B.Tech) ৪ বছরের সেমিস্টার সিলেবাস, এআই ল্যাব এবং ইঞ্জিনিয়ারিং ক্যালকুলেটর।"
                : "Comprehensive academic curriculum, AI Lab, calculators & semester resources for 4-year B.Tech students.")
            }
          </p>
        </div>
        <button
          onClick={onBack}
          className={`self-start md:self-auto inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-black transition-all shadow-3xs cursor-pointer ${theme.primaryBtn} ${theme.primaryBtnHover} ${theme.primaryBtnText}`}
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
          {lang === "bn" ? "ড্যাশবোর্ডে ফিরুন" : "Dashboard"}
        </button>
      </div>

      {/* Program Selector Switches */}
      {!fixedCourseOnly && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setCourse("btech")}
            className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all cursor-pointer text-left ${
              course === "btech" 
                ? "border-emerald-500 bg-emerald-500/5 shadow-md" 
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-extrabold text-xl">
              B.T
            </div>
            <div>
              <h3 className={`font-black text-sm md:text-base ${theme.textHeading}`}>
                {lang === "bn" ? "বি.টেক প্রোগ্রাম" : "B.Tech Engineering"}
              </h3>
              <p className="text-[10px] md:text-xs text-slate-500 font-semibold">
                {lang === "bn" ? "৪ বছর মেয়াদী ব্যাচেলর ডিগ্রি কোর্স" : "4-Year Bachelor of Technology Degree Syllabus"}
              </p>
            </div>
          </button>

          <button
            onClick={() => setCourse("diploma")}
            className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all cursor-pointer text-left ${
              course === "diploma" 
                ? "border-indigo-500 bg-indigo-500/5 shadow-md" 
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-extrabold text-xl">
              D.E
            </div>
            <div>
              <h3 className={`font-black text-sm md:text-base ${theme.textHeading}`}>
                {lang === "bn" ? "ডিপ্লোমা ইন ইঞ্জিনিয়ারিং" : "Diploma in Engineering"}
              </h3>
              <p className="text-[10px] md:text-xs text-slate-500 font-semibold">
                {lang === "bn" ? "৩ বছর মেয়াদী পলিটেকনিক ডিপ্লোমা" : "3-Year Polytechnic Diploma Technical Course"}
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Branch Selector Icons */}
      <div className="space-y-4">
        <h2 className={`text-base md:text-lg font-black tracking-tight ${theme.textHeading} flex items-center gap-2 px-1`}>
          <Layers className="h-5 w-5 text-emerald-500" />
          {lang === "bn" ? "আপনার বিভাগ / ইঞ্জিনিয়ারিং শাখা নির্বাচন করুন" : "Select Your Engineering Discipline"}
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {currentCourseData.branches.map((branch) => {
            const IconComp = branch.icon;
            const isSelected = selectedBranch === branch.id;
            return (
              <button
                key={branch.id}
                onClick={() => setSelectedBranch(branch.id)}
                className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border-2 transition-all cursor-pointer text-center ${
                  isSelected 
                    ? `border-emerald-500 bg-emerald-50/20 shadow-md scale-[1.02]` 
                    : `border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs`
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br ${branch.color}`}>
                  <IconComp className="h-6 w-6" />
                </div>
                <div>
                  <span className={`text-xs md:text-sm font-black ${theme.textHeading} block`}>
                    {lang === "bn" ? branch.bnName : branch.name}
                  </span>
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest mt-1 block">
                    {branch.id.toUpperCase()}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Nav Sub-Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
        {[
          { id: "syllabus", nameEn: "Syllabus & Roadmap", nameBn: "সিলেবাস ও সেমিস্টার" },
          { id: "simulator", nameEn: "Digital Gate Simulator", nameBn: "লজিক গেট সিমুলেটর" },
          { id: "calculator", nameEn: "Electrical AC/DC Solver", nameBn: "ইলেকট্রিক্যাল সলভার" },
          { id: "aiAssistant", nameEn: "AI Lab Companion", nameBn: "এআই ল্যাব সহকারী" },
          { id: "uploads", nameEn: "Technical Resources", nameBn: "প্রশ্নপত্র ও লেকচার নোট" }
        ].filter((tab) => {
          if (course === "diploma") {
            return tab.id === "syllabus" || tab.id === "uploads";
          }
          return true;
        }).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`whitespace-nowrap px-4 py-3 text-xs md:text-sm font-black border-b-2 transition-all cursor-pointer ${
              activeSubTab === tab.id
                ? "border-emerald-500 text-emerald-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {lang === "bn" ? tab.nameBn : tab.nameEn}
          </button>
        ))}
      </div>

      {/* Main Feature Rendering Section */}
      <div className="bg-white/60 backdrop-blur-xs rounded-3xl border border-slate-200/50 p-6 shadow-xs min-h-[400px]">
        <AnimatePresence mode="wait">
          
          {/* SYLLABUS & ROADMAP VIEW */}
          {activeSubTab === "syllabus" && (
            <motion.div
              key="syllabus"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className={`text-base md:text-lg font-black ${theme.textHeading}`}>
                    {lang === "bn" ? `${activeBranchObj.bnName} - সেমিস্টার ভিত্তিক কারিকুলাম` : `${activeBranchObj.name} - Semester Curriculum`}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    {lang === "bn" ? `সম্পূর্ণ পাঠ্যক্রম মেয়াদ: ${currentCourseData.durationBn}` : `Official program timeline: ${currentCourseData.duration}`}
                  </p>
                </div>
                
                {/* Semester Buttons selection */}
                <div className="flex flex-wrap gap-1.5">
                  {Object.keys(activeBranchObj.semesters).map((sem) => (
                    <button
                      key={sem}
                      onClick={() => setSelectedSem(sem)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        selectedSem === sem 
                          ? "bg-slate-900 text-white shadow-xs" 
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {sem}
                    </button>
                  ))}
                </div>
              </div>

              {/* Course details panel */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Dynamic Semester Focus Info */}
                {(() => {
                  const semFocus = getSemFocusInfo(course, selectedBranch, selectedSem, lang);
                  return (
                    <div className="lg:col-span-5 space-y-4 bg-emerald-500/5 rounded-2xl p-5 border border-emerald-500/10 animate-fadeIn">
                      <h4 className="text-xs font-black uppercase text-emerald-800 tracking-wider flex items-center gap-2 select-none">
                        <GraduationCap className="h-4 w-4" />
                        {lang === "bn" ? semFocus.bnTitle : semFocus.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold leading-relaxed">
                        {semFocus.desc}
                      </p>
                      <div className="pt-2 border-t border-emerald-500/10 space-y-2.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block select-none">
                          {lang === "bn" ? "প্রয়োজনীয় ল্যাব ও ফোকাস টপিকস:" : "Key Lab & Focus Topics:"}
                        </span>
                        {semFocus.keyPoints.length > 0 ? (
                          semFocus.keyPoints.map((pt, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-800">
                              <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center text-[10px] font-black shrink-0">
                                {i + 1}
                              </span>
                              <span>{pt}</span>
                            </div>
                          ))
                        ) : (
                          activeBranchObj.keySubjects.map((sub, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-800">
                              <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center text-[10px] font-black shrink-0">
                                {i + 1}
                              </span>
                              <span>{sub}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Specific selected semester subject list */}
                <div className="lg:col-span-7 space-y-4">
                  <h4 className={`text-sm font-black ${theme.textHeading} flex items-center gap-2`}>
                    <BookOpen className="h-4 w-4 text-emerald-500" />
                    {lang === "bn" ? `${selectedSem}-এর জন্য নির্ধারিত কোর্সসমূহ:` : `Curriculum for ${selectedSem}:`}
                  </h4>
                  
                  <div className="space-y-3">
                    {(activeBranchObj.semesters as any)[selectedSem]?.map((subject: string, idx: number) => (
                      <div 
                        key={idx} 
                        className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white shadow-3xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                            {idx + 1}
                          </div>
                          <div>
                            <span className="block text-xs font-black text-slate-900">{subject}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Theory & Laboratory Practical</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setActiveSubTab("aiAssistant");
                            setAiPrompt(`Explain the syllabus, key topics, and reference books for the subject "${subject}" in ${course === "btech" ? "B.Tech" : "Diploma"} ${selectedBranch.toUpperCase()}`);
                          }}
                          className="px-2.5 py-1.5 rounded-lg text-[10px] font-black bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 transition-all cursor-pointer border border-emerald-500/10"
                        >
                          {lang === "bn" ? "এআই সিলেবাস গাইড" : "Syllabus Guide"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Shared PDF Resources & Upload Panel */}
              <div className="border-t border-slate-200/60 pt-6 mt-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className={`text-base font-black ${theme.textHeading} flex items-center gap-1.5`}>
                      <FileText className="h-5 w-5 text-emerald-500 animate-pulse" />
                      {lang === "bn" ? `${selectedSem}-এর স্টাডি পিডিএফ ও প্রশ্নপত্র` : `${selectedSem} Study PDFs & Exam Papers`}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-bold">
                      {lang === "bn"
                        ? "এই সেমিস্টারের জন্য অ্যাডমিনদের আপলোডকৃত সকল অ্যাসাইনমেন্ট, ল্যাব এবং প্রিভিয়াস ইয়ার প্রশ্নাবলি।"
                        : `Access practical lab guides, previous exam papers, and class notes uploaded by admins for ${selectedSem}.`}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Upload Form (Visible to Admin ONLY) */}
                  {profile?.role === "Admin" && (
                    <div className="lg:col-span-5 space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                          <Upload className="h-4 w-4 text-emerald-500" />
                          {lang === "bn" ? "পিডিএফ আপলোড করুন" : "Upload PDF / Material"}
                        </h4>
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {lang === "bn" ? "অ্যাডমিন প্যানেল" : "Admin Panel"}
                        </span>
                      </div>

                      <form onSubmit={handleUploadResource} className="space-y-3">
                        <div>
                          <label className="block text-[10px] text-slate-600 font-black mb-1">
                            {lang === "bn" ? "শিরোনাম / বিষয়ের নাম" : "Title / Subject Name"}
                          </label>
                          <input
                            type="text"
                            value={uploadTitle}
                            onChange={(e) => setUploadTitle(e.target.value)}
                            placeholder={lang === "bn" ? "যেমন: সিএসই ৩য় সেম ডিএসএ ল্যাব পিডিএফ" : "e.g., DSA Lab Manual or Electrical Machines Paper"}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-600 font-black mb-1">
                            {lang === "bn" ? "সংক্ষিপ্ত বিবরণ" : "Brief Description"}
                          </label>
                          <textarea
                            value={uploadDesc}
                            onChange={(e) => setUploadDesc(e.target.value)}
                            placeholder={lang === "bn" ? "টপিকস, বছর বা প্রয়োজনীয় নির্দেশনা..." : "Topics covered, year, or instructions..."}
                            rows={2}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500 resize-none"
                          />
                        </div>

                        {/* File chooser */}
                        <div className="space-y-1">
                          <label className="block text-[10px] text-slate-600 font-black">
                            {lang === "bn" ? "পিডিএফ ফাইল বা ডকুমেন্ট সংযুক্ত করুন" : "Attachment (PDF or Image)"}
                          </label>
                          <div className="flex items-center gap-2">
                            <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-emerald-500 bg-white rounded-xl p-4 cursor-pointer transition-colors text-center">
                              <FileText className="h-6 w-6 text-slate-400 mb-1" />
                              <span className="text-[10px] font-black text-slate-500">
                                {uploadFileName ? uploadFileName : (lang === "bn" ? "পিডিএফ / ফাইল নির্বাচন করুন" : "Select PDF / Document")}
                              </span>
                              <input
                                type="file"
                                accept="application/pdf,image/*"
                                onChange={handleFileChange}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isUploading}
                          className={`w-full inline-flex items-center justify-center py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-sm ${theme.primaryBtn} ${theme.primaryBtnHover} ${theme.primaryBtnText}`}
                        >
                          {isUploading ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            lang === "bn" ? "রিসোর্স সাবমিট করুন" : "Submit Material"
                          )}
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Uploaded Resources List */}
                  <div className={`${profile?.role === "Admin" ? "lg:col-span-7" : "lg:col-span-12"} space-y-3`}>
                    <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider px-1 flex items-center gap-1.5">
                      <FileCheck className="h-4 w-4 text-emerald-500" />
                      {lang === "bn" ? "উপলব্ধ শেয়ারকৃত পিডিএফ ফাইলসমূহ" : "Available Shared PDF Files"}
                    </h4>

                    {filteredResources.length > 0 ? (
                      <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                        {filteredResources.map((res) => (
                          <div 
                            key={res.id}
                            className="p-4 bg-white rounded-xl border border-slate-150 flex items-start justify-between shadow-3xs"
                          >
                            <div className="space-y-1">
                              <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[8px] font-black uppercase">
                                {res.semester}
                              </span>
                              <h5 className="font-extrabold text-xs text-slate-900">{res.title}</h5>
                              <p className="text-[10px] text-slate-500 font-semibold">{res.description}</p>
                              
                              <div className="text-[9px] text-slate-400 font-semibold pt-1">
                                {lang === "bn" 
                                  ? `দ্বারা ${res.uploaderName} • ${new Date(res.timestamp).toLocaleDateString()}`
                                  : `By ${res.uploaderName} • ${new Date(res.timestamp).toLocaleDateString()}`
                                }
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {res.fileUrl && (
                                <a
                                  href={res.fileUrl}
                                  download={res.fileName || "attachment"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-200"
                                  title="Download / View File"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                </a>
                              )}
                              
                              {/* Delete button */}
                              {!res.id.startsWith("static-") && (profile?.role === "Admin" || profile?.email === res.uploaderEmail || !profile) && (
                                <button
                                  onClick={() => handleDeleteResource(res.id)}
                                  className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors border border-rose-200 cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-48 text-center text-slate-400 font-medium bg-slate-50 rounded-2xl border border-slate-100">
                        <FileText className="h-10 w-10 text-slate-300 mb-1" />
                        <p className="text-xs font-semibold">
                          {lang === "bn" 
                            ? `এই সেমিস্টারের (${selectedSem}) জন্য কোনো পিডিএফ আপলোড করা হয়নি। অ্যাডমিন হিসেবে প্রথম হয়ে নতুন একটি আপলোড করুন!` 
                            : `No PDF materials uploaded yet for ${selectedSem}. Be the first to upload!`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* DIGITAL GATE SIMULATOR */}
          {activeSubTab === "simulator" && (
            <motion.div
              key="simulator"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              <div>
                <h3 className={`text-base md:text-lg font-black ${theme.textHeading} flex items-center gap-2`}>
                  <Code className="h-5 w-5 text-indigo-500" />
                  {lang === "bn" ? "ডিজিটাল লজিক সার্কিট সিমুলেটর (Digital Logic Gate Sim)" : "Digital Logic Gate & Boolean Simulator"}
                </h3>
                <p className="text-xs text-slate-500 font-semibold">
                  {lang === "bn" 
                    ? "ইনপুট পিনগুলোর মান টগল করুন এবং বিভিন্ন গেটের আউটপুট পরিবর্তন লাইভ পর্যবেক্ষণ করুন।" 
                    : "Toggle input pin values to instantly simulate logic AND, OR, NOT, XOR outputs."}
                </p>
              </div>

              {/* Interactive Sandbox Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Inputs Switch Controls */}
                <div className="lg:col-span-4 space-y-4 bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">
                    {lang === "bn" ? "সার্কিট ইনপুট সিগন্যাল" : "Circuit Input Pins"}
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
                      <div>
                        <span className="block font-black text-xs text-slate-800">Pin A (Input A)</span>
                        <span className={`text-[10px] font-black ${gateInA ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {gateInA ? "HIGH (1)" : "LOW (0)"}
                        </span>
                      </div>
                      <button
                        onClick={() => setGateInA(!gateInA)}
                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-250 cursor-pointer ${gateInA ? 'bg-emerald-500' : 'bg-slate-300'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-250 ${gateInA ? 'translate-x-6' : ''}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
                      <div>
                        <span className="block font-black text-xs text-slate-800">Pin B (Input B)</span>
                        <span className={`text-[10px] font-black ${gateInB ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {gateInB ? "HIGH (1)" : "LOW (0)"}
                        </span>
                      </div>
                      <button
                        onClick={() => setGateInB(!gateInB)}
                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-250 cursor-pointer ${gateInB ? 'bg-emerald-500' : 'bg-slate-300'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-250 ${gateInB ? 'translate-x-6' : ''}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
                      <div>
                        <span className="block font-black text-xs text-slate-800">Pin C (Input for NOT)</span>
                        <span className={`text-[10px] font-black ${gateInC ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {gateInC ? "HIGH (1)" : "LOW (0)"}
                        </span>
                      </div>
                      <button
                        onClick={() => setGateInC(!gateInC)}
                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-250 cursor-pointer ${gateInC ? 'bg-emerald-500' : 'bg-slate-300'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-250 ${gateInC ? 'translate-x-6' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Gates Outputs visualizer */}
                <div className="lg:col-span-8 space-y-4">
                  <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider px-1">
                    {lang === "bn" ? "সিমুলেটেড গেট আউটপুট সিগন্যাল" : "Simulated Logic Gate Outputs"}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* AND Gate Card */}
                    <div className="p-4 rounded-xl border border-slate-100 bg-white flex items-center justify-between shadow-3xs hover:border-blue-300 transition-colors">
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[9px] font-black uppercase mb-1">AND Gate</span>
                        <h5 className="font-extrabold text-xs text-slate-800">Y = A • B</h5>
                      </div>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white transition-all ${outAnd ? 'bg-blue-600 shadow-md scale-105 animate-pulse' : 'bg-slate-200'}`}>
                        {outAnd}
                      </div>
                    </div>

                    {/* OR Gate Card */}
                    <div className="p-4 rounded-xl border border-slate-100 bg-white flex items-center justify-between shadow-3xs hover:border-emerald-300 transition-colors">
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase mb-1">OR Gate</span>
                        <h5 className="font-extrabold text-xs text-slate-800">Y = A + B</h5>
                      </div>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white transition-all ${outOr ? 'bg-emerald-600 shadow-md scale-105 animate-pulse' : 'bg-slate-200'}`}>
                        {outOr}
                      </div>
                    </div>

                    {/* NOT Gate Card */}
                    <div className="p-4 rounded-xl border border-slate-100 bg-white flex items-center justify-between shadow-3xs hover:border-purple-300 transition-colors">
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[9px] font-black uppercase mb-1">NOT Gate</span>
                        <h5 className="font-extrabold text-xs text-slate-800">Y = C̅</h5>
                      </div>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white transition-all ${outNot ? 'bg-purple-600 shadow-md scale-105 animate-pulse' : 'bg-slate-200'}`}>
                        {outNot}
                      </div>
                    </div>

                    {/* XOR Gate Card */}
                    <div className="p-4 rounded-xl border border-slate-100 bg-white flex items-center justify-between shadow-3xs hover:border-amber-300 transition-colors">
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[9px] font-black uppercase mb-1">XOR Gate</span>
                        <h5 className="font-extrabold text-xs text-slate-800">Y = A ⊕ B</h5>
                      </div>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white transition-all ${outXor ? 'bg-amber-600 shadow-md scale-105 animate-pulse' : 'bg-slate-200'}`}>
                        {outXor}
                      </div>
                    </div>
                  </div>

                  {/* Programmer base numeric converter utility */}
                  <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 space-y-4 border border-slate-800 mt-4">
                    <div className="flex items-center gap-2">
                      <Terminal className="h-5 w-5 text-emerald-400" />
                      <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400">
                        {lang === "bn" ? "প্রোগ্রামার বেস কনভার্টার" : "Base Numeric & Bitwise Converter"}
                      </h4>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] text-slate-400 font-extrabold uppercase mb-1">Decimal (10)</label>
                        <input
                          type="number"
                          value={numDecimal}
                          onChange={(e) => handleDecimalChange(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-black text-slate-200 focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 font-extrabold uppercase mb-1">Binary (2)</label>
                        <input
                          type="text"
                          value={numBinary}
                          readOnly
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-black text-slate-300 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 font-extrabold uppercase mb-1">Hexadecimal (16)</label>
                        <input
                          type="text"
                          value={numHex}
                          readOnly
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-black text-slate-300 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          )}

          {/* ELECTRICAL AC/DC SOLVER */}
          {activeSubTab === "calculator" && (
            <motion.div
              key="calculator"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              <div>
                <h3 className={`text-base md:text-lg font-black ${theme.textHeading} flex items-center gap-2`}>
                  <Calculator className="h-5 w-5 text-emerald-500" />
                  {lang === "bn" ? "আরএলসি (RLC) সিরিজ রেজোন্যান্স ও ইলেকট্রিক্যাল সলভার" : "Electrical RLC Impedance & Resonance Solver"}
                </h3>
                <p className="text-xs text-slate-500 font-semibold">
                  {lang === "bn" 
                    ? "ভোল্টেজ, রেজিস্ট্যান্স, ইনডাক্ট্যান্স ও ক্যাপাসিট্যান্স ইনপুট দিয়ে রেজোন্যান্ট ফ্রিকোয়েন্সি ও ইম্পিডেন্স গণনা করুন।" 
                    : "Enter electrical elements to automatically analyze RLC series networks, power factors and resonance parameters."}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Entry fields */}
                <div className="lg:col-span-5 space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">
                    {lang === "bn" ? "সার্কিট প্যারামিটারসমূহ" : "Circuit Specifications"}
                  </h4>

                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-[10px] text-slate-600 font-black mb-1">RMS Voltage V (Volts)</label>
                      <input
                        type="number"
                        value={calcVoltage}
                        onChange={(e) => setCalcVoltage(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-600 font-black mb-1">Resistance R (Ohms Ω)</label>
                      <input
                        type="number"
                        value={calcResistance}
                        onChange={(e) => setCalcResistance(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-600 font-black mb-1">Inductance L (Henrys H)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={calcInductance}
                        onChange={(e) => setCalcInductance(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-600 font-black mb-1">Capacitance C (MicroFarads μF)</label>
                      <input
                        type="number"
                        value={calcCapacitance}
                        onChange={(e) => setCalcCapacitance(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-600 font-black mb-1">Frequency f (Hertz Hz)</label>
                      <input
                        type="number"
                        value={calcFrequency}
                        onChange={(e) => setCalcFrequency(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <button
                      onClick={calculateElectricSystem}
                      className={`w-full inline-flex items-center justify-center py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-sm ${theme.primaryBtn} ${theme.primaryBtnHover} ${theme.primaryBtnText}`}
                    >
                      {lang === "bn" ? "হিসাব করুন" : "Calculate Outputs"}
                    </button>
                  </div>
                </div>

                {/* Mathematical Output derivations */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider mb-4 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                      <FileCheck className="h-4 w-4 text-emerald-500" />
                      {lang === "bn" ? "সার্কিট গাণিতিক ফলাফল" : "Network Analytical Outputs"}
                    </h4>

                    {electricOutput ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="block text-[10px] text-slate-400 font-bold uppercase">Reactance X_L</span>
                          <span className="block text-sm font-black text-slate-900">{electricOutput.reactanceL} Ω</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="block text-[10px] text-slate-400 font-bold uppercase">Reactance X_C</span>
                          <span className="block text-sm font-black text-slate-900">{electricOutput.reactanceC} Ω</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="block text-[10px] text-slate-400 font-bold uppercase">Impedance Z</span>
                          <span className="block text-sm font-black text-slate-900">{electricOutput.impedance} Ω</span>
                        </div>
                        <div className="p-3 bg-indigo-50/40 rounded-xl border border-indigo-100/50">
                          <span className="block text-[10px] text-indigo-500 font-bold uppercase">Current I_RMS</span>
                          <span className="block text-sm font-black text-indigo-800">{electricOutput.current} A</span>
                        </div>
                        <div className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-100/50">
                          <span className="block text-[10px] text-emerald-600 font-bold uppercase">Power Factor (cos φ)</span>
                          <span className="block text-sm font-black text-emerald-800">{electricOutput.powerFactor}</span>
                        </div>
                        <div className="p-3 bg-amber-50/40 rounded-xl border border-amber-100/50">
                          <span className="block text-[10px] text-amber-600 font-bold uppercase">Resonant Freq f_r</span>
                          <span className="block text-sm font-black text-amber-800">{electricOutput.resonantFreq} Hz</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-48 text-center text-slate-400 font-medium">
                        <Calculator className="h-10 w-10 text-slate-300 mb-2 animate-bounce" />
                        <p className="text-xs">
                          {lang === "bn" 
                            ? "বামপাশে সার্কিটের প্যারামিটারগুলো প্রদান করে গণনা বোতামে ক্লিক করুন।" 
                            : "Provide parameters on the left to review series network impedance outputs."}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="text-[10px] text-slate-400 font-bold bg-slate-50 p-3 rounded-xl border border-slate-100 mt-4 leading-relaxed">
                    <strong>Resonance Formula:</strong> f_r = 1 / (2π√LC) • <strong>Impedance Formula:</strong> Z = √[R² + (X_L - X_C)²]
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* AI TECHNICAL ASSISTANT */}
          {activeSubTab === "aiAssistant" && (
            <motion.div
              key="aiAssistant"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-4 flex flex-col h-[520px]"
            >
              <div className="border-b border-slate-100 pb-2">
                <h3 className={`text-base font-black ${theme.textHeading} flex items-center gap-1.5`}>
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  {lang === "bn" ? "প্রকৌশলী ও ল্যাব এআই অ্যাসিস্ট্যান্ট" : "Engineering & Lab AI Assistant"}
                </h3>
                <p className="text-[11px] text-slate-500 font-bold">
                  {lang === "bn" 
                    ? "কোড ত্রুটি, সার্কিট বিশ্লেষণ, সিভিল কংক্রিট নকশা বা যেকোনো থিওরি সম্বলিত সমস্যা সমাধান করুন।" 
                    : "Ask coding bugs, compiler errors, digital networks, or thermodynamic problem derivations."}
                </p>
              </div>

              {/* Chat messages viewport */}
              <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                {aiChatHistory.map((msg, idx) => (
                  <div 
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div 
                      className={`max-w-[85%] rounded-2xl p-4.5 text-xs font-semibold leading-relaxed shadow-3xs ${
                        msg.role === "user" 
                          ? "bg-slate-900 text-white rounded-tr-none" 
                          : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
                      }`}
                    >
                      <span className="block text-[9px] font-black uppercase text-slate-400 mb-1">
                        {msg.role === "user" ? "You" : "Engineering Lab Assistant"}
                      </span>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                ))}

                {isAiLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 text-xs font-semibold text-slate-400 flex items-center gap-2">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>{lang === "bn" ? "এআই চিন্তা করছে..." : "Generating response..."}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick suggestion prompt chips */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { en: "Write Bubble Sort in C++", bn: "C++ এ বাবল সর্ট কোড লিখুন" },
                  { en: "Explain Kirchhoff's Current Law (KCL)", bn: "কারশফের কারেন্ট সূত্র (KCL) ব্যাখ্যা কর" },
                  { en: "What is concrete grade M25 ratio?", bn: "কংক্রিট গ্রেড M25 এর অনুপাত কী?" },
                  { en: "Explain Carnot Cycle efficiency", bn: "কার্নোট ইঞ্জিনের দক্ষতা ব্যাখ্যা করুন" }
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => setAiPrompt(lang === "bn" ? chip.bn : chip.en)}
                    className="px-2.5 py-1.5 rounded-lg text-[10px] font-black bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-colors border border-slate-200/50"
                  >
                    {lang === "bn" ? chip.bn : chip.en}
                  </button>
                ))}
              </div>

              {/* Message Entry box */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleAskAi(); }}
                  placeholder={lang === "bn" ? "প্রকৌশল বিষয়ক প্রশ্ন এখানে টাইপ করুন..." : "Enter your engineering/technical question here..."}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500 bg-white"
                />
                <button
                  onClick={handleAskAi}
                  disabled={isAiLoading}
                  className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
                >
                  {lang === "bn" ? "জিজ্ঞেস করুন" : "Send Query"}
                </button>
              </div>
            </motion.div>
          )}

          {/* DYNAMIC UPLOADS VIEW */}
          {activeSubTab === "uploads" && (
            <motion.div
              key="uploads"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className={`text-base font-black ${theme.textHeading}`}>
                    {lang === "bn" ? "অ্যাডমিন কর্তৃক শেয়ারকৃত প্রশ্নপত্র ও নোট" : "Admin Shared Technical Exam Papers & Lab Notes"}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-bold">
                    {lang === "bn" 
                      ? "আপনার সেমিস্টার ও বিষয়ের জন্য পিডিএফ নোট বা অতীতের পরীক্ষার প্রশ্নপত্র খুঁজে নিন এবং ডাউনলোড করুন।" 
                      : "Access PDF question papers, cheat sheets, and practical lab manuals uploaded by admins."}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Upload Form (Visible to Admins ONLY) */}
                {profile?.role === "Admin" && (
                  <div className="lg:col-span-5 space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                      <Upload className="h-4 w-4 text-emerald-500" />
                      {lang === "bn" ? "নতুন ম্যাটেরিয়াল আপলোড করুন" : "Upload Lecture Note or Exam Paper"}
                    </h4>

                    <form onSubmit={handleUploadResource} className="space-y-3">
                      <div>
                        <label className="block text-[10px] text-slate-600 font-black mb-1">Title / Subject Name</label>
                        <input
                          type="text"
                          value={uploadTitle}
                          onChange={(e) => setUploadTitle(e.target.value)}
                          placeholder="e.g., DSA Lab Manual or Electrical Machines Paper"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-600 font-black mb-1">Brief Description</label>
                        <textarea
                          value={uploadDesc}
                          onChange={(e) => setUploadDesc(e.target.value)}
                          placeholder="Topics covered, year, or instructions..."
                          rows={2}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500 resize-none"
                        />
                      </div>

                      {/* File chooser */}
                      <div className="space-y-1">
                        <label className="block text-[10px] text-slate-600 font-black">Attachment (PDF or Image)</label>
                        <div className="flex items-center gap-2">
                          <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-emerald-500 bg-white rounded-xl p-4 cursor-pointer transition-colors text-center">
                            <FileText className="h-6 w-6 text-slate-400 mb-1" />
                            <span className="text-[10px] font-black text-slate-500">
                              {uploadFileName ? uploadFileName : "Select PDF / Document"}
                            </span>
                            <input
                              type="file"
                              accept="application/pdf,image/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isUploading}
                        className={`w-full inline-flex items-center justify-center py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-sm ${theme.primaryBtn} ${theme.primaryBtnHover} ${theme.primaryBtnText}`}
                      >
                        {isUploading ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          lang === "bn" ? "রিসোর্স সাবমিট করুন" : "Submit Material"
                        )}
                      </button>
                    </form>
                  </div>
                )}

                {/* Uploaded Resources List */}
                <div className={`${profile?.role === "Admin" ? "lg:col-span-7" : "lg:col-span-12"} space-y-3`}>
                  <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider px-1 flex items-center gap-1.5">
                    <FileCheck className="h-4 w-4 text-emerald-500" />
                    {lang === "bn" ? `উপলব্ধ নথি সমূহ (${selectedBranch.toUpperCase()})` : `Available Shared Documents (${selectedBranch.toUpperCase()})`}
                  </h4>

                  {filteredResources.length > 0 ? (
                    <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                      {filteredResources.map((res) => (
                        <div 
                          key={res.id}
                          className="p-4 bg-white rounded-xl border border-slate-150 flex items-start justify-between shadow-3xs"
                        >
                          <div className="space-y-1">
                            <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[8px] font-black uppercase">
                              {res.semester}
                            </span>
                            <h5 className="font-extrabold text-xs text-slate-900">{res.title}</h5>
                            <p className="text-[10px] text-slate-500 font-semibold">{res.description}</p>
                            
                            <div className="text-[9px] text-slate-400 font-semibold pt-1">
                              By {res.uploaderName} • {new Date(res.timestamp).toLocaleDateString()}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {res.fileUrl && (
                              <a
                                href={res.fileUrl}
                                download={res.fileName || "attachment"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-200"
                                title="Download / View File"
                              >
                                <Download className="h-3.5 w-3.5" />
                              </a>
                            )}
                            
                            {/* Delete button (If uploader or Admin - only for dynamic user uploaded ones) */}
                            {!res.id.startsWith("static-") && (profile?.role === "Admin" || profile?.email === res.uploaderEmail) && (
                              <button
                                onClick={() => handleDeleteResource(res.id)}
                                className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors border border-rose-200 cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-center text-slate-400 font-medium">
                      <FileText className="h-10 w-10 text-slate-300 mb-1" />
                      <p className="text-xs">
                        {lang === "bn" 
                          ? `এই শাখার (${selectedBranch.toUpperCase()}) জন্য এখনও কোনো প্রশ্ন বা নোট আপলোড করা হয়নি। প্রথম হয়ে নতুন একটি আপলোড করুন!` 
                          : `No technical papers have been uploaded yet for ${selectedBranch.toUpperCase()}. Be the first to upload!`}
                      </p>
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </motion.div>
  );
}

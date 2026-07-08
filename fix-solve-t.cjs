const fs = require('fs');
const file = 'src/components/SolveWithAI.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldT = `  const t = {
    title: isBengali ? "এআই দিয়ে সমাধান করুন (Solve with AI)" : "Solve with AI",
    subtitle: isBengali 
      ? "যেকোনো কঠিন প্রশ্ন বা সমীকরণ টাইপ করুন বা আপলোড করুন এবং এআই-এর মাধ্যমে ১০০% নির্ভুল ধাপে ধাপে সমাধান বুঝে নিন" 
      : "Type or upload any complex question, equation, or problem for step-by-step solutions",
    placeholder: isBengali 
      ? "যেমন: x² - 5x + 6 = 0 সমীকরণটি সমাধান করুন অথবা 3x² + sin(x) এর ব্যবকলন নির্ণয় করুন..." 
      : "e.g. Solve x^2 - 5x + 6 = 0 or find the derivative of 3x^2 + sin(x)...",
    solveBtn: isBengali ? "এআই সমাধান শুরু করুন" : "Solve with AI",
    solving: isBengali ? "এআই হিসাব করছে..." : "AI is solving...",
    coreConceptLabel: isBengali ? "মূল গাণিতিক সূত্র / তত্ত্ব:" : "Core Formula / Concept:",
    stepsLabel: isBengali ? "ধাপে ধাপে সমাধান:" : "Step-by-Step Derivation:",
    finalAnswerLabel: isBengali ? "চূড়ান্ত ফলাফল:" : "Final Answer:",
    clearBtn: isBengali ? "নতুন প্রশ্ন" : "New Problem",
    sampleLabel: isBengali ? "সহজ ট্রাই করার জন্য নমুনা সমীকরণ:" : "Try these sample problems:",
    errorLabel: isBengali ? "সমাধান তৈরি করতে ব্যর্থ হয়েছে।" : "Failed to solve the problem.",
    tip: isBengali 
      ? "পরামর্শ: এটি সাধারণ বীজগণিত, ক্যালকুলাস, ত্রিকোণমিতি বা জ্যামিতির প্রশ্ন খুব সুন্দরভাবে ব্যাখ্যা করতে পারে!" 
      : "Tip: It can thoroughly explain algebra, calculus, trigonometry, statistics, or word problems!",
    uploadLabel: isBengali ? "প্রশ্ন বা খাতার ছবি/পিডিএফ আপলোড করুন" : "Upload problem photo or PDF",
    uploadHint: isBengali ? "JPG, PNG বা PDF ফাইল ড্র্যাগ করে আনুন অথবা ক্লিক করে আপলোড করুন" : "Drag & drop or click to select JPG, PNG, or PDF file",
    imageTextPlaceholder: isBengali ? "আপনার সমস্যা বা প্রশ্নটি এখানে টাইপ করুন..." : "Your problem or question...",
  };`;

const newT = `  const t = {
    title: isBengali ? "এআই স্টাডি ইঞ্জিন (AI Study Engine)" : "AI Universal Study Engine",
    subtitle: isBengali 
      ? "যেকোনো কঠিন প্রশ্ন, সমস্যা বা সমীকরণ টাইপ বা আপলোড করুন এবং ১০০% নির্ভুল ধাপে ধাপে সমাধান বুঝে নিন" 
      : "Type or upload any complex question or problem from any subject for 100% accurate step-by-step solutions",
    placeholder: isBengali 
      ? "যেমন: বিজ্ঞানের কোনো প্রশ্ন, ইতিহাসের ঘটনা বা গাণিতিক সমীকরণ..." 
      : "e.g. A science question, historical event, or mathematical equation...",
    solveBtn: isBengali ? "এআই সমাধান শুরু করুন" : "Solve with AI Engine",
    solving: isBengali ? "এআই সমাধান তৈরি করছে..." : "AI Engine is analyzing...",
    coreConceptLabel: isBengali ? "মূল ধারণা / তত্ত্ব:" : "Core Concept:",
    stepsLabel: isBengali ? "ধাপে ধাপে সমাধান:" : "Step-by-Step Solution:",
    finalAnswerLabel: isBengali ? "চূড়ান্ত উত্তর:" : "Final Answer:",
    clearBtn: isBengali ? "নতুন প্রশ্ন" : "New Question",
    sampleLabel: isBengali ? "সহজ ট্রাই করার জন্য নমুনা প্রশ্ন:" : "Try these sample questions:",
    errorLabel: isBengali ? "সমাধান তৈরি করতে ব্যর্থ হয়েছে।" : "Failed to generate solution.",
    tip: isBengali 
      ? "পরামর্শ: এটি গণিত, বিজ্ঞান, ইতিহাস, সাহিত্য বা যেকোনো বিষয়ের প্রশ্নের উত্তর সুন্দরভাবে ব্যাখ্যা করতে পারে!" 
      : "Tip: It can thoroughly explain questions from Math, Science, History, Literature, and more!",
    uploadLabel: isBengali ? "প্রশ্ন বা বইয়ের ছবি/পিডিএফ আপলোড করুন" : "Upload question photo or document",
    uploadHint: isBengali ? "JPG, PNG বা PDF ফাইল ড্র্যাগ করে আনুন অথবা ক্লিক করে আপলোড করুন" : "Drag & drop or click to select JPG, PNG, or PDF file",
    imageTextPlaceholder: isBengali ? "আপনার সমস্যা বা প্রশ্নটি এখানে টাইপ করুন..." : "Your problem or question...",
  };`;

content = content.replace(oldT, newT);

fs.writeFileSync(file, content);

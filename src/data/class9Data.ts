export interface ChapterNote {
  id: string;
  chapterNameEn: string;
  chapterNameBn: string;
  summaryEn: string;
  summaryBn: string;
  keyPointsEn: string[];
  keyPointsBn: string[];
}

export interface SubjectData {
  id: string;
  nameEn: string;
  nameBn: string;
  icon: string;
  chapters: ChapterNote[];
}

export const class9Subjects: SubjectData[] = [
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
      },
      {
        id: "graph",
        chapterNameEn: "Graph",
        chapterNameBn: "লেখচিত্র",
        summaryEn: "Cartesian coordinate system, plotting points, and graphing linear equations in two variables.",
        summaryBn: "কার্তেসীয় স্থানাঙ্ক পদ্ধতি, ছক কাগজে বিন্দু স্থাপন এবং দুই চলবিশিষ্ট একঘাত সমীকরণের লেখচিত্র অঙ্কন।",
        keyPointsEn: [
          "The horizontal line is the X-axis and the vertical line is the Y-axis.",
          "The origin has coordinates (0, 0).",
          "Graph of a linear equation ax + by + c = 0 is always a straight line."
        ],
        keyPointsBn: [
          "অনুভূমিক রেখাটিকে X-অক্ষ এবং উলম্ব রেখাটিকে Y-অক্ষ বলা হয়।",
          "মূলবিন্দুর স্থানাঙ্ক হল (০, ০)।",
          "ax + by + c = ০ সমীকরণটির লেখচিত্র সর্বদা একটি সরলরেখা হয়।"
        ]
      },
      {
        id: "coord-distance",
        chapterNameEn: "Coordinate Geometry: Distance Formula",
        chapterNameBn: "স্থানাঙ্ক জ্যামিতি: দূরত্ব নির্ণয়",
        summaryEn: "Finding the distance between two points in a Cartesian plane using the distance formula.",
        summaryBn: "কার্তেসীয় তলে দুটি বিন্দুর মধ্যবর্তী দূরত্ব পরিমাপের সূত্র এবং বিভিন্ন গাণিতিক সমস্যার সমাধান।",
        keyPointsEn: [
          "Distance formula: d = √[(x₂ - x₁)² + (y₂ - y₁)²].",
          "The distance of point (x, y) from the origin is √(x² + y²).",
          "Distance is always a non-negative value."
        ],
        keyPointsBn: [
          "দুটি বিন্দুর মধ্যবর্তী দূরত্ব নির্ণয়ের সূত্র: d = √[(x₂ - x₁)² + (y₂ - y₁)²] একক।",
          "মূলবিন্দু থেকে কোনো বিন্দু (x, y)-এর দূরত্ব = √(x² + y²) একক।",
          "দূরত্ব সর্বদা একটি অ-ঋণাত্মক মান হয়।"
        ]
      },
      {
        id: "linear-equations",
        chapterNameEn: "Linear Simultaneous Equations",
        chapterNameBn: "রৈখিক সহসমীকরণ",
        summaryEn: "Solving simultaneous linear equations in two variables using substitution, elimination, comparison, and cross-multiplication.",
        summaryBn: "দুই চলবিশিষ্ট রৈখিক সহসমীকরণের সমাধান পদ্ধতিসমূহ (অপনয়ন, পরিবর্তন, তুলনা এবং বজ্রগুণন পদ্ধতি)।",
        keyPointsEn: [
          "A system of two linear equations has a unique solution if a₁/a₂ ≠ b₁/b₂.",
          "No solution exists if a₁/a₂ = b₁/b₂ ≠ c₁/c₂ (parallel lines).",
          "Infinitely many solutions exist if a₁/a₂ = b₁/b₂ = c₁/c₂ (coincident lines)."
        ],
        keyPointsBn: [
          "দুটি সমীকরণের একটি নির্দিষ্ট সমাধান থাকবে যদি a₁/a₂ ≠ b₁/b₂ হয়।",
          "কোনো সমাধান থাকবে না যদি a₁/a₂ = b₁/b₂ ≠ c₁/c₂ হয় (সমান্তরাল সরলরেখা)।",
          "অসংখ্য সমাধান থাকবে যদি a₁/a₂ = b₁/b₂ = c₁/c₂ হয় (ঐকিক সরলরেখা)।"
        ]
      },
      {
        id: "properties-parallelogram",
        chapterNameEn: "Properties of Parallelogram",
        chapterNameBn: "সামান্তরিকের ধর্ম",
        summaryEn: "Properties of parallelogram, rectangle, rhombus, and square. Theorems and proofs regarding diagonals and angles.",
        summaryBn: "সামান্তরিক, আয়তক্ষেত্র, রম্বস এবং বর্গক্ষেত্রের জ্যামিতিক বৈশিষ্ট্য এবং কর্ণ ও কোণ সংক্রান্ত উপপাদ্যসমূহ।",
        keyPointsEn: [
          "Opposite sides and opposite angles of a parallelogram are equal.",
          "Diagonals of a parallelogram bisect each other.",
          "Diagonals of a rhombus bisect each other at right angles (90°)."
        ],
        keyPointsBn: [
          "সামান্তরিকের বিপরীত বাহুগুলি এবং বিপরীত কোণগুলি পরস্পর সমান হয়।",
          "সামান্তরিকের কর্ণ দুটি পরস্পরকে সমদ্বিখণ্ডিত করে।",
          "রম্বসের কর্ণদ্বয় পরস্পরকে সমকোণে সমদ্বিখণ্ডিত করে।"
        ]
      },
      {
        id: "polynomials",
        chapterNameEn: "Polynomials",
        chapterNameBn: "বহুপদী রাশিমালা",
        summaryEn: "Definition of polynomials, degree, coefficients, Remainder Theorem, and Factor Theorem.",
        summaryBn: "বহুপদী রাশিমালার সংজ্ঞা, সূচক ও সহগ, ভাগশেষ উপপাদ্য এবং উৎপাদক উপপাদ্য সংক্রান্ত আলোচনা।",
        keyPointsEn: [
          "Remainder Theorem: If f(x) is divided by (x - a), the remainder is f(a).",
          "Factor Theorem: If f(a) = 0, then (x - a) is a factor of f(x).",
          "The degree of a non-zero constant polynomial is 0."
        ],
        keyPointsBn: [
          "ভাগশেষ উপপাদ্য: f(x) বহুপদী রাশিকে (x - a) দ্বারা ভাগ করলে ভাগশেষ হবে f(a)।",
          "উৎপাদক উপপাদ্য: যদি f(a) = ০ হয়, তবে (x - a), f(x) এর একটি উৎপাদক হবে।",
          "অশূন্য ধ্রুবক বহুপদী রাশিমালার মাত্রা সর্বদা ০ হয়।"
        ]
      },
      {
        id: "factorisation",
        chapterNameEn: "Factorisation",
        chapterNameBn: "উৎপাদকে বিশ্লেষণ",
        summaryEn: "Methods of factorising algebraic expressions including middle term splitting and algebraic identities.",
        summaryBn: "বীজগাণিতিক রাশিমালার উৎপাদকে বিশ্লেষণ করার বিভিন্ন নিয়ম, মধ্যপদ সহগ বিশ্লেষণ (Middle Term Splitting) ও সূত্রের ব্যবহার।",
        keyPointsEn: [
          "Factorisation of a² - b² = (a - b)(a + b).",
          "Factorisation of a³ + b³ = (a + b)(a² - ab + b²).",
          "Vanishing method is used for higher degree polynomials by guessing a zero."
        ],
        keyPointsBn: [
          "a² - b² = (a - b)(a + b) এর উৎপাদকের রূপ।",
          "a³ + b³ = (a + b)(a² - ab + b²) এর উৎপাদকের রূপ।",
          "ত্রিঘাত রাশিমালার ক্ষেত্রে ট্রায়াল পদ্ধতিতে কোনো একটি শূন্য বা রুট খুঁজে উৎপাদক নির্ণয় করা হয়।"
        ]
      },
      {
        id: "transversal-midpoint",
        chapterNameEn: "Transversal and Mid-Point Theorem",
        chapterNameBn: "ভেদক ও মধ্যবিন্দু সংক্রান্ত উপপাদ্য",
        summaryEn: "Theorems regarding line segments joining midpoints of triangle sides and properties of transversals.",
        summaryBn: "ত্রিভুজের বাহুগুলির মধ্যবিন্দু সংযোগকারী সরলরেখা সংক্রান্ত উপপাদ্য এবং সমান্তরাল সরলরেখায় ভেদকের ধর্ম।",
        keyPointsEn: [
          "The line segment connecting the midpoints of any two sides of a triangle is parallel to the third side and half of it in length.",
          "If a transversal makes equal intercepts on three or more parallel lines, any other transversal will also make equal intercepts."
        ],
        keyPointsBn: [
          "ত্রিভুজের যেকোনো দুটি বাহুর মধ্যবিন্দুর সংযোজক সরলরেখাংশ তৃতীয় বাহুর সমান্তরাল ও অর্ধেক হয়।",
          "যদি কোনো ভেদক তিনটি সমান্তরাল সরলরেখা থেকে সমান অংশ খণ্ডিত করে, তবে অন্য যেকোনো ভেদকও সমান অংশ খণ্ডিত করবে।"
        ]
      },
      {
        id: "profit-loss",
        chapterNameEn: "Profit and Loss",
        chapterNameBn: "লাভ ও ক্ষতি",
        summaryEn: "Concepts of cost price, selling price, marked price, discount, profit percentage, and loss percentage.",
        summaryBn: "ক্রয়মূল্য, বিক্রয়মূল্য, ধার্যমূল্য, ছাড় বা ডিসকাউন্ট, শতকরা লাভ এবং শতকরা ক্ষতির গাণিতিক বিশ্লেষণ।",
        keyPointsEn: [
          "Profit = Selling Price (SP) - Cost Price (CP); Loss = CP - SP.",
          "Profit or Loss percentage is always calculated on the Cost Price unless specified otherwise.",
          "Discount is always calculated on the Marked Price."
        ],
        keyPointsBn: [
          "লাভ = বিক্রয়মূল্য - ক্রয়মূল্য; ক্ষতি = ক্রয়মূল্য - বিক্রয়মূল্য।",
          "শতকরা লাভ বা ক্ষতি সাধারণত ক্রয়মূল্যের ওপর ভিত্তি করে হিসাব করা হয়।",
          "ছাড় বা ডিসকাউন্ট সর্বদা ধার্যমূল্যের ওপর হিসাব করা হয়।"
        ]
      },
      {
        id: "statistics-9",
        chapterNameEn: "Statistics",
        chapterNameBn: "রাশিবিজ্ঞান",
        summaryEn: "Collection of data, frequency distribution tables, cumulative frequency, histograms, and frequency polygons.",
        summaryBn: "তথ্য সংগ্রহ, পরিসংখ্যা বিভাজন তালিকা প্রস্তুতকরণ, ক্রমযৌগিক পরিসংখ্যা এবং আয়তলেখ ও পরিসংখ্যা বহুভুজ অঙ্কন।",
        keyPointsEn: [
          "Class mark = (Upper Limit + Lower Limit) / 2.",
          "Tally marks are used to count the frequency of data points.",
          "Histogram is a graphical representation of grouped continuous data using bars."
        ],
        keyPointsBn: [
          "শ্রেণি মধ্যক = (উচ্চসীমা + নিম্নসীমা) / ২।",
          "ট্যালি মার্কের সাহায্যে তথ্যের পরিসংখ্যা গোনা সহজ হয়।",
          "আয়তলেখ হল স্তম্ভের সাহায্যে অবিচ্ছিন্ন শ্রেণি বিন্যাসিত তথ্যের লৈখিক উপস্থাপন।"
        ]
      },
      {
        id: "theorems-on-area",
        chapterNameEn: "Theorems on Area",
        chapterNameBn: "ক্ষেত্রফল সংক্রান্ত উপপাদ্য",
        summaryEn: "Theorems establishing relationship between areas of parallelograms and triangles on the same base and between same parallels.",
        summaryBn: "একই ভূমি ও একই সমান্তরাল যুগলের মধ্যে অবস্থিত সামান্তরিক ও ত্রিভুজের ক্ষেত্রফল সংক্রান্ত গুরুত্বপূর্ণ উপপাদ্য ও প্রমাণ।",
        keyPointsEn: [
          "Parallelograms on the same base and between the same parallels are equal in area.",
          "The area of a triangle is half the area of a parallelogram on the same base and between the same parallels.",
          "Triangles on the same base and between the same parallels are equal in area."
        ],
        keyPointsBn: [
          "একই ভূমি এবং একই সমান্তরাল সরলরেখা যুগলের মধ্যে অবস্থিত সকল সামান্তরিকের ক্ষেত্রফল সমান হয়।",
          "একই ভূমি ও একই সমান্তরাল যুগলের মধ্যে অবস্থিত ত্রিভুজের ক্ষেত্রফল সামান্তরিকের ক্ষেত্রফলের অর্ধেক হয়।",
          "একই ভূমি ও একই সমান্তরাল যুগলের মধ্যে অবস্থিত ত্রিভুজগুলির ক্ষেত্রফল পরস্পর সমান।"
        ]
      },
      {
        id: "construction-triangle-parallelogram",
        chapterNameEn: "Construction of Parallelogram Equal to Triangle",
        chapterNameBn: "সম্পাদ্য: ত্রিভুজের সমান ক্ষেত্রফলবিশিষ্ট সামান্তরিক অঙ্কন",
        summaryEn: "Geometrical construction of a parallelogram having an area equal to a given triangle with a specified angle.",
        summaryBn: "নির্দিষ্ট কোণবিশিষ্ট এবং প্রদত্ত ত্রিভুজের সমান ক্ষেত্রফলযুক্ত সামান্তরিক অঙ্কন প্রণালী।",
        keyPointsEn: [
          "First, bisect the base of the given triangle.",
          "Draw a line parallel to the base through the opposite vertex.",
          "Construct the given angle at the midpoint of the base to complete the parallelogram."
        ],
        keyPointsBn: [
          "প্রথমে প্রদত্ত ত্রিভুজটির ভূমিকে সমদ্বিখণ্ডিত করতে হয়।",
          "বিপরীত শীর্ষবিন্দু দিয়ে ভূমির সমান্তরাল একটি সরলরেখা অঙ্কন করতে হবে।",
          "ভূমির মধ্যবিন্দুতে নির্দিষ্ট কোণটি অঙ্কন করে সমান্তরাল সরলরেখাদ্বয়ের সাহায্যে সামান্তরিক গঠন করতে হয়।"
        ]
      },
      {
        id: "construction-quadrilateral-triangle",
        chapterNameEn: "Construction of Triangle Equal to Quadrilateral",
        chapterNameBn: "সম্পাদ্য: চতুর্ভুজের সমান ক্ষেত্রফলবিশিষ্ট ত্রিভুজ অঙ্কন",
        summaryEn: "Geometrical steps to construct a triangle whose area is equal to a given quadrilateral.",
        summaryBn: "জ্যামিতিক পদ্ধতিতে প্রদত্ত চতুর্ভুজের সমান ক্ষেত্রফলসম্পন্ন ত্রিভুজ অঙ্কন করার সঠিক ধাপসমূহ।",
        keyPointsEn: [
          "Draw one diagonal of the given quadrilateral.",
          "From the remaining vertex, draw a line parallel to this diagonal to intersect the extended base.",
          "Join the starting vertex to this intersection point to form the equivalent triangle."
        ],
        keyPointsBn: [
          "প্রথমে প্রদত্ত চতুর্ভুজটির যেকোনো একটি কর্ণ অঙ্কন করতে হবে।",
          "অপর শীর্ষবিন্দু থেকে এই কর্ণের সমান্তরাল সরলরেখা টেনে বর্ধিত ভূমির সাথে মেলাতে হবে।",
          "ভূমির প্রান্তবিন্দুর সাথে ওই ছেদবিন্দু যোগ করলেই কাঙ্ক্ষিত ত্রিভুজটি গঠিত হয়।"
        ]
      },
      {
        id: "perimeter-area",
        chapterNameEn: "Perimeter and Area of Triangle & Quadrilateral",
        chapterNameBn: "ত্রিভুজ ও চতুর্ভুজের পরিসীমা ও ক্ষেত্রফল",
        summaryEn: "Formulas for perimeter and area of scalene, isosceles, equilateral triangles, and quadrilaterals (trapezium, parallelogram, rhombus).",
        summaryBn: "বিষমবাহু, সমদ্বিবাহু, সমবাহু ত্রিভুজ এবং ট্রাপিজিয়াম, সামান্তরিক ও রম্বসের ক্ষেত্রফল ও পরিসীমা নির্ণয়।",
        keyPointsEn: [
          "Heron's Formula for area of triangle = √[s(s-a)(s-b)(s-c)] where s = (a+b+c)/2.",
          "Area of Equilateral Triangle = (√3/4) * a².",
          "Area of Trapezium = 0.5 * (sum of parallel sides) * distance between them."
        ],
        keyPointsBn: [
          "হেরনের সূত্র অনুযায়ী ত্রিভুজের ক্ষেত্রফল = √[s(s-a)(s-b)(s-c)] বর্গ একক, যেখানে অর্ধপরিসীমা s = (a+b+c)/২।",
          "সমবাহু ত্রিভুজের ক্ষেত্রফল = (√৩/৪) * a² বর্গ একক।",
          "ট্রাপিজিয়ামের ক্ষেত্রফল = ০.৫ * (সমান্তরাল বাহুদ্বয়ের যোগফল) * তাদের মধ্যবর্তী লম্ব দূরত্ব।"
        ]
      },
      {
        id: "circumference-circle",
        chapterNameEn: "Circumference of Circle",
        chapterNameBn: "বৃত্তের পরিধি",
        summaryEn: "Formula for the perimeter of a circle and semi-circle, with application to rotational motion of wheels.",
        summaryBn: "বৃত্ত এবং অর্ধবৃত্তের পরিধি বা পরিসীমা নির্ণয় এবং চাকার আবর্তন সংক্রান্ত বিভিন্ন বাস্তব সমস্যার সমাধান।",
        keyPointsEn: [
          "Circumference of a circle = 2πr (where r is the radius, π ≈ 22/7 or 3.14).",
          "Perimeter of a semi-circle = πr + 2r = r(π + 2).",
          "The distance covered by a wheel in one complete rotation is equal to its circumference."
        ],
        keyPointsBn: [
          "বৃত্তের পরিধি = ২πr (যেখানে r ব্যাসার্ধ এবং π ≈ ২২/৭ বা ৩.১৪)।",
          "অর্ধবৃত্তের পরিসীমা = πr + ২r = r(π + ২) একক।",
          "একটি চাকা একবার সম্পূর্ণ ঘুরলে তার নিজের পরিধির সমান দূরত্ব অতিক্রম করে।"
        ]
      },
      {
        id: "theorems-on-concurrency",
        chapterNameEn: "Theorems on Concurrency",
        chapterNameBn: "সমবিন্দু সংক্রান্ত উপপাদ্য",
        summaryEn: "Understanding centroid, circumcentre, incentre, and orthocentre of a triangle and related theorems.",
        summaryBn: "ত্রিভুজের ভরকেন্দ্র, পরিকেন্দ্র, অন্তকেন্দ্র এবং লম্ববিন্দুর অবস্থান ও সমবিন্দু সংক্রান্ত উপপাদ্যসমূহ।",
        keyPointsEn: [
          "The perpendicular bisectors of the sides of a triangle are concurrent (Circumcentre).",
          "The internal bisectors of the angles of a triangle are concurrent (Incentre).",
          "The medians of a triangle meet at a point called the Centroid, which divides each median in the ratio 2:1."
        ],
        keyPointsBn: [
          "ত্রিভুজের বাহুগুলির লম্ব সমদ্বিখণ্ডক তিনটি সমবিন্দু হয় (পরিকেন্দ্র)।",
          "ত্রিভুজের কোণগুলির অন্তসমদ্বিখণ্ডক তিনটি সমবিন্দু হয় (অন্তকেন্দ্র)।",
          "ত্রিভুজের মধ্যমা তিনটি যে বিন্দুতে মিলিত হয় তাকে ভরকেন্দ্র বলে এবং এটি মধ্যমাকে ২:১ অনুপাতে বিভক্ত করে।"
        ]
      },
      {
        id: "area-of-circle",
        chapterNameEn: "Area of Circle",
        chapterNameBn: "বৃত্তের ক্ষেত্রফল",
        summaryEn: "Derivation and applications of formulas for area of circle, circular ring, and sectors.",
        summaryBn: "বৃত্তের ক্ষেত্রফল, বলয়ের ক্ষেত্রফল এবং বৃত্তকলার ক্ষেত্রফল নির্ণয় এবং বাস্তব ভিত্তিক সমস্যা সমাধান।",
        keyPointsEn: [
          "Area of a circle = πr² square units.",
          "Area of a circular ring (between outer radius R and inner radius r) = π(R² - r²).",
          "Area of a sector with central angle θ = (θ/360) * πr²."
        ],
        keyPointsBn: [
          "বৃত্তের ক্ষেত্রফল = πr² বর্গ একক।",
          "দুটি সমকেন্দ্রিক বৃত্তের মধ্যবর্তী বলয়ের ক্ষেত্রফল = π(R² - r²) বর্গ একক (যেখানে R বড় ব্যাসার্ধ, r ছোট ব্যাসার্ধ)।",
          "θ কোণবিশিষ্ট বৃত্তকলার ক্ষেত্রফল = (θ/৩৬০) * πr² বর্গ একক।"
        ]
      },
      {
        id: "coord-division",
        chapterNameEn: "Coordinate Geometry: Internal & External Division",
        chapterNameBn: "স্থানাঙ্ক জ্যামিতি: সরলরেখাংশের অন্তর্বিভক্ত ও বহির্বিভক্ত",
        summaryEn: "Section formula to find the coordinates of a point dividing a line segment in a given ratio.",
        summaryBn: "একটি সরলরেখাংশকে নির্দিষ্ট অনুপাতে অন্তর্বিভক্ত ও বহির্বিভক্তকারী বিন্দুর স্থানাঙ্ক নির্ণয়ের সূত্র।",
        keyPointsEn: [
          "Internal division formula: P(x, y) = ((mx₂ + nx₁)/(m+n), (my₂ + ny₁)/(m+n)).",
          "External division formula: P(x, y) = ((mx₂ - nx₁)/(m-n), (my₂ - ny₁)/(m-n)).",
          "Midpoint of segment joining (x₁, y₁) and (x₂, y₂) is ((x₁ + x₂)/2, (y₁ + y₂)/2)."
        ],
        keyPointsBn: [
          "অন্তর্বিভক্ত করার সূত্র: P(x, y) = ((mx₂ + nx₁)/(m+n), (my₂ + ny₁)/(m+n))।",
          "বহির্বিভক্ত করার সূত্র: P(x, y) = ((mx₂ - nx₁)/(m-n), (my₂ - ny₁)/(m-n))।",
          "দুটি বিন্দুর সংযোগকারী রেখাংশের মধ্যবিন্দুর স্থানাঙ্ক = ((x₁ + x₂)/২, (y₁ + y₂)/২)।"
        ]
      },
      {
        id: "coord-triangle-area",
        chapterNameEn: "Coordinate Geometry: Area of Triangular Region",
        chapterNameBn: "স্থানাঙ্ক জ্যামিতি: ত্রিভুজাকৃতি ক্ষেত্রের ক্ষেত্রফল",
        summaryEn: "Calculating the area of a triangle formed by three given coordinates on the Cartesian plane.",
        summaryBn: "কার্তেসীয় তলে তিনটি শীর্ষবিন্দুর স্থানাঙ্ক দেওয়া থাকলে ত্রিভুজের ক্ষেত্রফল এবং তিন বিন্দুর সমরেখতা যাচাইয়ের নিয়ম।",
        keyPointsEn: [
          "Area of triangle = 0.5 * |x₁(y₂ - y₃) + x₂(y₃ - y₁) + x₃(y₁ - y₂)| square units.",
          "If the area of the triangle is 0, the three coordinates are collinear (lie on a straight line).",
          "Centroid of triangle is given by ((x₁ + x₂ + x₃)/3, (y₁ + y₂ + y₃)/3)."
        ],
        keyPointsBn: [
          "ত্রিভুজের ক্ষেত্রফল = ০.৫ * |x₁(y₂ - y₃) + x₂(y₃ - y₁) + x₃(y₁ - y₂)| বর্গ একক।",
          "যদি এই ক্ষেত্রফলের মান ০ হয়, তবে বিন্দু তিনটি সমরেখ (একই সরলরেখায় অবস্থিত)।",
          "ত্রিভুজের ভরকেন্দ্রের স্থানাঙ্ক = ((x₁ + x₂ + x₃)/৩, (y₁ + y₂ + y₃)/৩)।"
        ]
      },
      {
        id: "logarithm-detail",
        chapterNameEn: "Logarithm (Advanced)",
        chapterNameBn: "লগারিদম (উন্নত)",
        summaryEn: "Comprehensive properties, change of base formula, and handling logarithmic equations.",
        summaryBn: "লগারিদমের ভিত্তি পরিবর্তন সূত্র, বিশেষ বৈশিষ্ট্যসমূহ এবং জটিল সমীকরণসমূহের বীজগাণিতিক সমাধান।",
        keyPointsEn: [
          "Change of base: log_a(b) * log_b(c) = log_a(c).",
          "log_a(b) = 1 / log_b(a).",
          "If log_a(x) = y, then x = a^y."
        ],
        keyPointsBn: [
          "ভিত্তি পরিবর্তন সূত্র: log_a(b) * log_b(c) = log_a(c)।",
          "log_a(b) = ১ / log_b(a)।",
          "যদি log_a(x) = y হয়, তবে x = a^y।"
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
      },
      {
        id: "force-motion",
        chapterNameEn: "Force and Motion",
        chapterNameBn: "বল ও গতি",
        summaryEn: "Concept of rest and motion, displacement, speed, velocity, acceleration, Newton's laws of motion, and linear momentum.",
        summaryBn: "স্থিতি ও গতি, সরণ, দ্রুতি, বেগ, ত্বরণ, নিউটনের গতিসূত্র এবং রৈখিক ভরবেগ সংক্রান্ত আলোচনা।",
        keyPointsEn: [
          "Equations of motion: v = u + at, s = ut + 0.5*at², v² = u² + 2as.",
          "Newton's First Law defines force and inertia. Second Law gives F = ma.",
          "Conservation of momentum: In the absence of an external force, total momentum is conserved."
        ],
        keyPointsBn: [
          "গতির সমীকরণসমূহ: v = u + at, s = ut + ০.৫*at², v² = u² + ২as।",
          "নিউটনের প্রথম সূত্র থেকে বল ও জাড্যের ধারণা পাওয়া যায়। দ্বিতীয় সূত্র দেয় F = ma।",
          "ভরবেগের সংরক্ষণ সূত্র: বাহ্যিক বল প্রয়োগ না করলে কোনো সংস্থার মোট রৈখিক ভরবেগ অপরিবর্তিত থাকে।"
        ]
      },
      {
        id: "atomic-structure-9",
        chapterNameEn: "Atomic Structure",
        chapterNameBn: "পরমাণুর গঠন",
        summaryEn: "Constituents of atom, subatomic particles, Thomson, Rutherford, and Bohr models, atomic number, and mass number.",
        summaryBn: "পরমাণুর মূল উপাদানসমূহ (ইলেকট্রন, প্রোটন ও নিউট্রন), রাদারফোর্ড ও বোরের পরমাণু মডেল এবং পরমাণু ও ভর সংখ্যা।",
        keyPointsEn: [
          "Rutherford's gold foil experiment discovered the atomic nucleus.",
          "Atomic Number is the number of protons; Mass Number is the sum of protons and neutrons.",
          "Isotopes have same atomic number but different mass numbers; Isobars have same mass numbers."
        ],
        keyPointsBn: [
          "রাদারফোর্ডের আলফা কণা বিচ্ছুরণ পরীক্ষার মাধ্যমে পরমাণুর নিউক্লিয়াস আবিষ্কৃত হয়।",
          "পরমাণু ক্রমাঙ্ক হল প্রোটনের সংখ্যা; ভর সংখ্যা হল প্রোটন ও নিউট্রনের সমষ্টি।",
          "আইসোটোপের প্রোটন সংখ্যা সমান কিন্তু ভর সংখ্যা ভিন্ন; আইসোবারের ভর সংখ্যা সমান কিন্তু প্রোটন সংখ্যা ভিন্ন।"
        ]
      },
      {
        id: "matter-structure",
        chapterNameEn: "Properties of Matter",
        chapterNameBn: "পদার্থের ভৌত ও রাসায়নিক ধর্ম",
        summaryEn: "Understanding elasticity, viscosity, surface tension, atmospheric pressure, and Archimedes' principle.",
        summaryBn: "স্থিতিস্থাপকতা, সান্দ্রতা, পৃষ্ঠটান, বায়ুমণ্ডলীয় চাপ এবং আর্কিমিডিসের সূত্র ও প্লবতার নীতি আলোচনা।",
        keyPointsEn: [
          "Elasticity: Stress is directly proportional to strain within the elastic limit.",
          "Viscosity: Internal friction of fluid resisting relative motion between layers.",
          "Surface Tension: Force per unit length acting perpendicular to line on liquid surface."
        ],
        keyPointsBn: [
          "স্থিতিস্থাপকতা: স্থিতিস্থাপক সীমার মধ্যে পীড়ন বিকৃতির সমানুপাতিক (হুকের সূত্র)।",
          "সান্দ্রতা: তরলের বিভিন্ন স্তরের আপেক্ষিক গতিতে বাধা সৃষ্টিকারী অভ্যন্তরীণ বল।",
          "পৃষ্ঠটান: তরল পৃষ্ঠের অণুগুলির পারস্পরিক আকর্ষণ বলের কারণে সৃষ্ট টান।"
        ]
      },
      {
        id: "solutions-9",
        chapterNameEn: "Solutions",
        chapterNameBn: "দ্রবণ",
        summaryEn: "True solutions, colloidal solutions, suspensions, solubility, and factors affecting solubility.",
        summaryBn: "প্রকৃত দ্রবণ, কোলয়েড দ্রবণ, প্রলম্বন বা সাসপেনশন এবং দ্রাব্যতা ও দ্রাব্যতার ওপর বিভিন্ন প্রভাবকসমূহ।",
        keyPointsEn: [
          "A colloidal solution displays the Tyndall effect (scattering of light).",
          "Solubility of most solids in liquids increases with rise in temperature.",
          "Saturated solution holds the maximum amount of solute at a given temperature."
        ],
        keyPointsBn: [
          "কোলয়েডীয় দ্রবণ টিন্ডাল প্রভাব (Tyndall Effect) বা আলোর বিচ্ছুরণ দেখায়।",
          "উষ্ণতা বাড়লে সাধারণত তরলে কঠিন পদার্থের দ্রাব্যতা বৃদ্ধি পায়।",
          "নির্দিষ্ট উষ্ণতায় সর্বোচ্চ পরিমাণ দ্রাব দ্রবীভূত থাকলে তাকে সম্পৃক্ত দ্রবণ বলে।"
        ]
      },
      {
        id: "acids-bases-salts",
        chapterNameEn: "Acids, Bases, and Salts",
        chapterNameBn: "অ্যাসিড, ক্ষার ও লবণ",
        summaryEn: "Arrhenius concept of acids and bases, indicators, pH scale, neutralization reaction, and salts.",
        summaryBn: "আরহেনিয়াসের তত্ত্ব অনুযায়ী অ্যাসিড ও ক্ষারকের সংজ্ঞা, নির্দেশক, pH স্কেল, প্রশমন বিক্রিয়া এবং লবণ।",
        keyPointsEn: [
          "Acids produce H+ ions in aqueous solution; Bases produce OH- ions.",
          "pH values: Acidic < 7, Neutral = 7, Alkaline > 7.",
          "Neutralization: Acid + Base -> Salt + Water."
        ],
        keyPointsBn: [
          "জলীয় দ্রবণে অ্যাসিড H+ আয়ন এবং ক্ষার বা ক্ষারক OH- আয়ন উৎপন্ন করে।",
          "pH স্কেল: অম্লীয় দ্রবণের pH < ৭, প্রসম দ্রবণের pH = ৭, এবং ক্ষারীয় দ্রবণের pH > ৭।",
          "প্রশমন বিক্রিয়া: অ্যাসিড + ক্ষার -> লবণ + জল।"
        ]
      },
      {
        id: "work-power-energy",
        chapterNameEn: "Work, Power, and Energy",
        chapterNameBn: "কার্য, ক্ষমতা ও শক্তি",
        summaryEn: "Scientific definition of work, kinetic and potential energy, power, and law of conservation of energy.",
        summaryBn: "কার্যের বৈজ্ঞানিক সংজ্ঞা, গতিশক্তি ও স্থিতিশক্তি, ক্ষমতা এবং যান্ত্রিক শক্তির সংরক্ষণ সূত্র।",
        keyPointsEn: [
          "Work done is the dot product of Force and Displacement (W = F * s * cosθ).",
          "Power is the rate of doing work (P = W/t). SI Unit is Watt.",
          "Law of Conservation of Energy: Energy can neither be created nor destroyed; only transformed."
        ],
        keyPointsBn: [
          "কার্য = প্রযুক্ত বল ও বলের অভিমুখে সরণের গুণফল (W = F * s)।",
          "ক্ষমতা হল কার্য করার হার (P = W/t)। ক্ষমতার SI একক হল ওয়াট।",
          "শক্তির সংরক্ষণ সূত্র: বিশ্ব ব্রহ্মাণ্ডের মোট শক্তির পরিমাণ ধ্রুবক, শক্তি কেবল এক রূপ থেকে অন্য রূপে পরিবর্তিত হয়।"
        ]
      },
      {
        id: "heat-9",
        chapterNameEn: "Heat",
        chapterNameBn: "তাপ",
        summaryEn: "Concepts of heat and temperature, calorimetry, latent heat, and anomalous expansion of water.",
        summaryBn: "তাপ ও উষ্ণতার ধারণা, ক্যালরিমিতির মূল নীতি, লীনতাপ এবং জলের ব্যতিক্রান্ত প্রসারণ।",
        keyPointsEn: [
          "Heat flows spontaneously from a body of higher temperature to lower temperature.",
          "Principle of Calorimetry: Heat lost by hot body = Heat gained by cold body.",
          "Anomalous expansion of water occurs between 0°C and 4°C, where its density is maximum at 4°C."
        ],
        keyPointsBn: [
          "তাপ সর্বদা উচ্চ উষ্ণতার বস্তু থেকে নিম্ন উষ্ণতার বস্তুর দিকে স্বতঃস্ফূর্তভাবে প্রবাহিত হয়।",
          "ক্যালরিমিতির মূল নীতি: উষ্ণ বস্তু দ্বারা বর্জিত তাপ = শীতল বস্তু দ্বারা গৃহীত তাপ।",
          "০ ডিগ্রি থেকে ৪ ডিগ্রি সেলসিয়াস পর্যন্ত জলের ব্যতিক্রান্ত প্রসারণ ঘটে এবং ৪ ডিগ্রি সেলসিয়াসে জলের ঘনত্ব সর্বাধিক হয়।"
        ]
      },
      {
        id: "sound-9",
        chapterNameEn: "Sound",
        chapterNameBn: "শব্দ",
        summaryEn: "Production and propagation of sound, longitudinal/transverse waves, echo, reverberation, and ultrasound.",
        summaryBn: "শব্দের উৎপত্তি ও বিস্তার, অনুদৈর্ঘ্য ও তীর্যক তরঙ্গ, প্রতিধ্বনি, অনুরণন এবং শব্দোত্তর তরঙ্গের ব্যবহার।",
        keyPointsEn: [
          "Sound requires a material medium for propagation; it cannot travel in a vacuum.",
          "Echo requires a minimum distance of approximately 17.2 meters between the source and the reflector.",
          "Infrasonic < 20 Hz; Audible range: 20 Hz to 20,000 Hz; Ultrasonic > 20,000 Hz."
        ],
        keyPointsBn: [
          "শব্দ বিস্তারের জন্য জড় মাধ্যমের প্রয়োজন; শব্দ শূন্য মাধ্যমের মধ্য দিয়ে যেতে পারে না।",
          "স্পষ্ট প্রতিধ্বনি শোনার জন্য উৎস ও প্রতিফলকের ন্যূনতম দূরত্ব প্রায় ১৭.২ মিটার হওয়া প্রয়োজন।",
          "শ্রুতিগোচর শব্দের কম্পাঙ্ক ২০ Hz থেকে ২০,০০০ Hz এর মধ্যে থাকে।"
        ]
      },
      {
        id: "water-9",
        chapterNameEn: "Water",
        chapterNameBn: "জল",
        summaryEn: "Importance of water, hard and soft water, removal of hardness, water pollution, and purification of drinking water.",
        summaryBn: "জলের গুরুত্ব, খর জল ও মৃদু জল, জল খরতাদূরীকরণ পদ্ধতিসমূহ, জল দূষণ এবং পানীয় জলের বিশুদ্ধিকরণ।",
        keyPointsEn: [
          "Hardness of water is caused by dissolved hydrogen carbonates, chlorides, and sulfates of Calcium and Magnesium.",
          "Temporary hardness is removed by boiling or Clark's method.",
          "Permanent hardness is removed by Ion-exchange or Permutit method."
        ],
        keyPointsBn: [
          "জলে ক্যালসিয়াম ও ম্যাগনেসিয়ামের বাইকার্বোনেট, ক্লোরাইড বা সালফেট লবণ দ্রবীভূত থাকলে জলের খড়তা সৃষ্টি হয়।",
          "অস্থায়ী খড়তা কেবল জল ফুটিয়ে বা ক্লার্ক পদ্ধতিতে দূর করা যায়।",
          "স্থায়ী খড়তা দূরীকরণে আয়ন বিনিময় পদ্ধতি বা পারমুটিট পদ্ধতি ব্যবহৃত হয়।"
        ]
      }
    ]
  },
  {
    id: "biology",
    nameEn: "Life Science",
    nameBn: "জীবন বিজ্ঞান",
    icon: "🌿",
    chapters: [
      {
        id: "life-diversity",
        chapterNameEn: "Life and its Diversity",
        chapterNameBn: "জীবন ও তার বৈচিত্র্য",
        summaryEn: "Concept of life, taxonomy, and five-kingdom classification of living organisms.",
        summaryBn: "জীবনের সংজ্ঞা, ট্যাক্সোনমি বা বিন্যাসবিধি এবং জীবজগতের পাঁচ-রাজ্য বিশিষ্ট শ্রেণীবিন্যাস আলোচনা।",
        keyPointsEn: [
          "The term 'Taxonomy' was coined by A.P. de Candolle.",
          "Five kingdoms are: Monera, Protista, Fungi, Plantae, and Animalia.",
          "Hierarchical groups: Kingdom, Phylum, Class, Order, Family, Genus, Species."
        ],
        keyPointsBn: [
          "ট্যাক্সোনমি শব্দের প্রবক্তা হলেন এ. পি. ডি ক্যান্ডোল।",
          "পাঁচটি রাজ্য হল: মনেরা, প্রোটিস্টা, ছত্রাক, প্ল্যান্টি এবং অ্যানিমেলিয়া।",
          "শ্রেণীবিন্যাসের ধাপসমূহ: রাজ্য, পর্ব, শ্রেণী, বর্গ, গোত্র, গণ, প্রজাতি।"
        ]
      },
      {
        id: "levels-organization",
        chapterNameEn: "Levels of Organization of Life",
        chapterNameBn: "জীবন সংগঠনের স্তর",
        summaryEn: "Prokaryotic vs Eukaryotic cell, details of cell organelles, biomolecules, and plant/animal tissues.",
        summaryBn: "প্রোক্যারিওটিক ও ইউক্যারিওটিক কোষের পার্থক্য, বিভিন্ন কোষ অঙ্গাণু, জৈব অণু এবং উদ্ভিদ ও প্রাণী কলার গঠন ও কাজ।",
        keyPointsEn: [
          "Mitochondria is known as the powerhouse of the cell because of ATP synthesis.",
          "Nucleus is the brain of the cell containing genetic material (DNA).",
          "Meristematic tissue in plants is responsible for growth, while permanent tissue provides support."
        ],
        keyPointsBn: [
          "মাইটোকন্ড্রিয়া কোষে ATP উৎপন্ন করার জন্য একে কোষের শক্তিঘর বলা হয়।",
          "নিউক্লিয়াস হল কোষের মস্তিষ্ক যা বংশগত বস্তু ধারণ করে।",
          "উদ্ভিদের ভাজক কলা বৃদ্ধির জন্য দায়ী এবং স্থায়ী কলা উদ্ভিদকে দৃঢ়তা প্রদান করে।"
        ]
      },
      {
        id: "physiological-processes",
        chapterNameEn: "Physiological Processes of Life",
        chapterNameBn: "জৈবনিক প্রক্রিয়া",
        summaryEn: "Detailed mechanisms of photosynthesis, respiration, human nutrition, blood circulation, and excretion in plants and animals.",
        summaryBn: "সালোকসংশ্লেষ, শ্বসন, মানুষের পুষ্টি ও বিপাক, রক্ত সংবহন এবং উদ্ভিদ ও প্রাণীর রেচন প্রক্রিয়া আলোচনা।",
        keyPointsEn: [
          "Photosynthesis has two phases: Light-dependent phase (Thylakoids) and Light-independent phase (Stroma).",
          "Respiration is a catabolic process which releases energy by oxidation of food.",
          "Double circulation in human heart prevents mixing of oxygenated and deoxygenated blood."
        ],
        keyPointsBn: [
          "সালোকসংশ্লেষের দুটি দশা: আলোক দশা (গ্রানা অংশে) এবং অন্ধকার বা আলোক-নিরপেক্ষ দশা (স্ট্রোমা অংশে)।",
          "শ্বসন একটি অপচিতিমূলক বিপাক ক্রিয়া যার মাধ্যমে শক্তির মুক্তি ঘটে।",
          "মানুষের হৃৎপিণ্ডে দ্বি-সংবহন ঘটে যা অক্সিজেনযুক্ত ও কার্বন ডাই-অক্সাইডযুক্ত রক্ত আলাদা রাখে।"
        ]
      },
      {
        id: "biology-welfare",
        chapterNameEn: "Biology and Human Welfare",
        chapterNameBn: "জীববিদ্যা ও মানবকল্যাণ",
        summaryEn: "Understanding immunity, vaccines, pathogens causing diseases like malaria and tuberculosis, and role of microbes.",
        summaryBn: "অনাক্রম্যতা বা রোগ প্রতিরোধ ক্ষমতা, টিকা, বিভিন্ন সংক্রামক রোগ (ম্যালেরিয়া, যক্ষ্মা) এবং অণুজীবদের ভূমিকা আলোচনা।",
        keyPointsEn: [
          "Active immunity is developed by vaccinations containing weakened or dead antigens.",
          "Malaria is caused by Plasmodium falciparum and transmitted by female Anopheles mosquito.",
          "Antibiotics are substances produced by microorganisms to destroy other harmful microbes."
        ],
        keyPointsBn: [
          "মৃত বা নিষ্ক্রিয় অ্যান্টিজেন শরীরে টিকার মাধ্যমে প্রবেশ করিয়ে সক্রিয় অনাক্রম্যতা তৈরি করা হয়।",
          "ম্যালেরিয়া রোগ সৃষ্টি করে প্লাসমোডিয়াম ভাইভ্যাক্স এবং বাহক হল স্ত্রী অ্যানোফিলিস মশা।",
          "অ্যান্টিবায়োটিক হল এমন রাসায়নিক বস্তু যা ক্ষতিকর রোগ সৃষ্টিকারী ব্যাকটেরিয়া ধ্বংস করে।"
        ]
      },
      {
        id: "environment-resources",
        chapterNameEn: "Environment and its Resources",
        chapterNameBn: "পরিবেশ ও তার সম্পদ",
        summaryEn: "Concept of ecosystems, food chains, ecological pyramids, natural resources, and conservation strategies.",
        summaryBn: "বাস্তুতন্ত্রের উপাদানসমূহ, খাদ্য শৃঙ্খল ও খাদ্য জাল, শক্তির প্রবাহ, প্রাকৃতিক সম্পদ এবং সংরক্ষণের বিভিন্ন উপায়।",
        keyPointsEn: [
          "10% Law (Lindeman's rule) states only 10% of energy is transferred to the next trophic level.",
          "Biogeochemical cycles like Carbon and Nitrogen cycle maintain ecosystem balance.",
          "Non-renewable resources like coal and petroleum should be used sustainably."
        ],
        keyPointsBn: [
          "লিল্ডেম্যানের ১০% সূত্র অনুযায়ী এক পুষ্টিস্তর থেকে পরবর্তী স্তরে মাত্র ১০% শক্তি স্থানান্তরিত হয়।",
          "কার্বন ও নাইট্রোজেন চক্রের মতো ভূ-রাসায়নিক চক্র পরিবেশের সমতা রক্ষা করে।",
          "কয়লা ও পেট্রোলিয়ামের মতো অনবায়নযোগ্য সম্পদগুলির সংরক্ষণ ও পরিমিত ব্যবহার একান্ত জরুরি।"
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
        id: "bhola-grandpa",
        chapterNameEn: "Tales of Bhola Grandpa",
        chapterNameBn: "Tales of Bhola Grandpa",
        summaryEn: "A funny and nostalgic story by Manoj Das recounting the hilarious forgetfulness of Bhola Grandpa.",
        summaryBn: "মনোজ দাস রচিত গল্প, যেখানে ভোলানাথ দাদুর চমৎকার ও মজার ভুলে যাওয়ার স্বভাব চমৎকারভাবে ফুটে উঠেছে।",
        keyPointsEn: [
          "Bhola Grandpa once lost his grandson at a festival and only realized it when someone asked what he was holding.",
          "He spent a night on a tree to escape a tiger, only to walk past the sleeping tiger the next morning.",
          "Kalam and the villagers always enjoyed Bhola Grandpa's simple, innocent nature."
        ],
        keyPointsBn: [
          "ভোলানাথ দাদু একবার মেলায় তাঁর নাতিকে হারিয়ে ফেলেছিলেন এবং অন্য কেউ জিজ্ঞাসা করার পর তাঁর মনে পড়ে।",
          "বাঘের ভয়ে তিনি সারারাত গাছে কাটান, অথচ পরের দিন সকালে বাঘটিকে ঘুমন্ত ভেবে তার পাশ দিয়েই হেঁটে চলে আসেন।",
          "গ্রামের মানুষ ভোলানাথ দাদুর সরল ও নিষ্পাপ স্বভাব খুব ভালোবাসতেন।"
        ]
      },
      {
        id: "about-dog",
        chapterNameEn: "All About a Dog",
        chapterNameBn: "All About a Dog",
        summaryEn: "A story by A.G. Gardiner about a cold winter night bus journey and a conflict over a small dog.",
        summaryBn: "এ. জি. গার্ডিনার রচিত গল্প যেখানে শীতের রাতে বাসে একটি ছোট কুকুর নিয়ে কন্ডাক্টরের সাথে যাত্রীদের বিতর্কের মানবিক বিশ্লেষণ রয়েছে।",
        keyPointsEn: [
          "The conductor forces a young lady to sit on the freezing open deck because she was carrying a small dog.",
          "The author observes that rules should be administered with a pinch of common sense and goodwill.",
          "Rules are meant for guidance, not to torture passengers."
        ],
        keyPointsBn: [
          "বাসের কন্ডাক্টর এক তরুণীকে তীব্র ঠান্ডায় ছাদের খোলা ডেকে বসতে বাধ্য করে কেবল তার সাথে থাকা ছোট কুকুরের জন্য।",
          "লেখক মন্তব্য করেন যে যেকোনো নিয়ম মানবিক দৃষ্টিভঙ্গি ও সাধারণ বুদ্ধি দিয়ে প্রয়োগ করা উচিত।",
          "নিয়ম মানুষের সুবিধার জন্য তৈরি, যাত্রীদের কষ্ট দেওয়ার জন্য নয়।"
        ]
      },
      {
        id: "autumn",
        chapterNameEn: "Autumn",
        chapterNameBn: "Autumn",
        summaryEn: "A beautiful poem by John Clare depicting the sights and sounds of the autumn season in rural England.",
        summaryBn: "জন ক্লার রচিত কবিতা যা গ্রামীণ ইংল্যান্ডের শরৎকালের রূপ, শব্দ এবং প্রকৃতির শান্ত রূপ তুলে ধরে।",
        keyPointsEn: [
          "The poet loves the 'fitful gust' that shakes the casement all day and blows the faded leaves away.",
          "Descriptions of the chirping sparrow on the cottage rig, the shaking twigs, and the smoke from chimney-stacks.",
          "Captures the quiet transition of nature before winter sets in."
        ],
        keyPointsBn: [
          "কবি শরৎকালের সেই দমকা হাওয়া পছন্দ করেন যা সারাদিন জানালার পাল্লা কাঁপায় এবং মরা পাতা উড়িয়ে দেয়।",
          "কুঁড়েঘরের চালের চড়ুই পাখির ডাক, গাছের ছোট ডালপালার দুলুনি এবং চিমনি থেকে নির্গত ধোঁয়ার মনোরম বর্ণনা।",
          "শীত আসার আগে প্রকৃতির শান্ত পরিবর্তনের চিত্র এখানে ফুটিয়ে তোলা হয়েছে।"
        ]
      },
      {
        id: "day-zoo",
        chapterNameEn: "A Day in the Zoo",
        chapterNameBn: "A Day in the Zoo",
        summaryEn: "An essay by Gerald Durrell describing the busy daily routine of a zoo owner and the behavior of the animals.",
        summaryBn: "জেরাল্ড ডুরেল রচিত প্রবন্ধ যেখানে একটি চিড়িয়াখানার প্রতিদিনের ব্যস্ত রুটিন ও পশুপাখিদের বিচিত্র স্বভাবের বর্ণনা দেওয়া হয়েছে।",
        keyPointsEn: [
          "The zoo day begins before dawn with birds singing, followed by feeding and cleaning routines.",
          "Animals show distinct personalities and are very observant of their human keepers.",
          "The author emphasizes that zoo management requires immense patience and dedication."
        ],
        keyPointsBn: [
          "ভোর হওয়ার আগেই পাখিদের গান দিয়ে চিড়িয়াখানার দিন শুরু হয়, এরপর শুরু হয় খাবার দেওয়া ও খাঁচা পরিষ্কারের কাজ।",
          "চিড়িয়াখানার প্রাণীদের নিজস্ব স্বভাব থাকে এবং তারা কর্মীদের খুব ভালোভাবে চেনে ও লক্ষ্য করে।",
          "চিড়িয়াখানা পরিচালনার জন্য অত্যন্ত ধৈর্য ও একাগ্রতার প্রয়োজন।"
        ]
      },
      {
        id: "summer-day",
        chapterNameEn: "All Summer in a Day",
        chapterNameBn: "All Summer in a Day",
        summaryEn: "A science fiction story by Ray Bradbury set on Venus, where the sun appears for only two hours once in seven years.",
        summaryBn: "রে ব্র্যাডবেরি রচিত কল্পবিজ্ঞান গল্প, যার পটভূমি শুক্রগ্রহ; যেখানে সাত বছরে মাত্র একবার দু-ঘণ্টার জন্য সূর্যের দেখা মেলে।",
        keyPointsEn: [
          "Margot, who came from Earth, remembers the sun and is treated as an outcast by other children born on Venus.",
          "Jealous children lock Margot in a closet just before the sun is about to emerge.",
          "The children run wild under the beautiful warm sun, only to feel intense guilt later upon remembering Margot."
        ],
        keyPointsBn: [
          "মার্গট পৃথিবী থেকে আসার কারণে সূর্যের কথা মনে রাখতে পেরেছিল, যা শুক্রগ্রহে জন্ম নেওয়া অন্য বাচ্চাদের হিংসার কারণ হয়।",
          "সূর্য ওঠার ঠিক আগে হিংসুটে সহপাঠীরা মার্গটকে একটি অন্ধকার ঘরে বন্দি করে রাখে।",
          "বাচ্চারা সূর্যের আলোয় খেলায় মেতে ওঠে এবং পরে মার্গটের কথা মনে পড়ায় তীব্র অনুশোচনা বোধ করে।"
        ]
      },
      {
        id: "mild-mist",
        chapterNameEn: "Mild the Mist Upon the Hill",
        chapterNameBn: "Mild the Mist Upon the Hill",
        summaryEn: "A reflective poem by Emily Brontë where mist on the hills brings back sweet childhood memories.",
        summaryBn: "এমিলি ব্রন্টি রচিত কবিতা যেখানে পাহাড়ের হালকা কুয়াশা কবিকে তাঁর শৈশবের মধুর দিনগুলিতে ফিরিয়ে নিয়ে যায়।",
        keyPointsEn: [
          "The mist on the hills does not foretell a storm, but suggests a quiet tomorrow.",
          "The damp grass reminds the poet of old times and her father's shelter.",
          "A beautiful fusion of landscape, nature, and deep personal memory."
        ],
        keyPointsBn: [
          "পাহাড়ের কুয়াশা কোনো ঝড়ের পূর্বাভাস দেয় না, বরং এক শান্ত ও মনোরম আগামীকালের ইঙ্গিত দেয়।",
          "ভিজে ঘাস কবিকে তাঁর ফেলে আসা শৈশব ও বাবার স্নেহের আশ্রয়ের কথা মনে করিয়ে দেয়।",
          "প্রকৃতির রূপ ও কবির অন্তরের স্মৃতির এক অপূর্ব মেলবন্ধন এই কবিতা।"
        ]
      },
      {
        id: "tom-tooth",
        chapterNameEn: "Tom Loses a Tooth",
        chapterNameBn: "Tom Loses a Tooth",
        summaryEn: "A humorous extract from Mark Twain's classic novel depicting Tom Sawyer's attempt to avoid school by pretending to be sick.",
        summaryBn: "মার্ক টোয়েন রচিত বিখ্যাত উপন্যাসের হাস্যরসাত্মক অংশ যেখানে টম স্কুল ফাঁকি দিতে অসুস্থতার অভিনয় করে।",
        keyPointsEn: [
          "Tom tries to pretend he has a sore toe, groaning loudly to wake his brother Sid.",
          "Aunt Polly quickly catches his trick but notices a loose tooth which she pulls out using a thread.",
          "Tom's schemes backfire, landing him in school anyway, but with a gap in his teeth."
        ],
        keyPointsBn: [
          "টম প্রথমে পায়ের আঙুল ব্যথার বাহানা করে এবং ভাই সিডকে ডাকার জন্য জোরে জোরে গোঙাতে শুরু করে।",
          "মাসি পলি সহজেই তাঁর চালাকি ধরে ফেলেন এবং তাঁর একটি নড়বড়ে দাঁত সুতো দিয়ে টেনে উপড়ে দেন।",
          "টমের সমস্ত পরিকল্পনা ভেস্তে যায় এবং ফাঁকি দেওয়া সত্ত্বেও তাকে স্কুলেই যেতে হয়।"
        ]
      },
      {
        id: "first-flight",
        chapterNameEn: "His First Flight",
        chapterNameBn: "His First Flight",
        summaryEn: "A story by Liam O'Flaherty about a young seagull overcoming his fear to take his very first flight.",
        summaryBn: "লিয়াম ও'ফ্লাহার্টি রচিত গল্প যেখানে একটি ছোট গাঙচিল কীভাবে নিজের ভয়কে জয় করে প্রথম আকাশে ওড়ে তা বর্ণিত হয়েছে।",
        keyPointsEn: [
          "The young seagull is too afraid to fly while his brothers and sister have already mastered it.",
          "His mother starves him for 24 hours to motivate him, enticing him with a piece of fish.",
          "Driven by extreme hunger, he dives for the food, spreads his wings, and successfully flies."
        ],
        keyPointsBn: [
          "গাঙচিলের ভাইবোনেরা উড়তে শিখলেও সে নিজে ডানার ওপর ভরসা করতে না পেরে পাথরের খাঁজে বসে থাকত।",
          "তার মা তাকে উড়ার অনুপ্রেরণা দিতে ২৪ ঘণ্টা উপোস করিয়ে রাখেন এবং এক টুকরো মাছ নিয়ে তার সামনে আসেন।",
          "ক্ষুধার জ্বালায় পাগল হয়ে সে মাছের ওপর ঝাঁপ দেয় এবং পড়ে যাওয়ার মুহূর্তে ডানা মেলে প্রথম উড্ডয়ন সম্পন্ন করে।"
        ]
      },
      {
        id: "north-ship",
        chapterNameEn: "The North Ship",
        chapterNameBn: "The North Ship",
        summaryEn: "Philip Larkin's symbolic poem about three ships sailing to different destinations under different winds.",
        summaryBn: "ফিলিপ লার্কিন রচিত প্রতীকী কবিতা যেখানে তিনটি জাহাজের ভিন্ন ভিন্ন দিকে যাত্রার মাধ্যমে মানুষের জীবনের লক্ষ্যের তুলনা করা হয়েছে।",
        keyPointsEn: [
          "The first ship sails to the west and finds a rich country; the second sails to the east but gets caught in a calm wind.",
          "The third ship, the North Ship, sails towards the dark and freezing north, prepared for a long journey.",
          "The North Ship represents resilience, determination, and pursuing a difficult but noble goal."
        ],
        keyPointsBn: [
          "প্রথম জাহাজটি পশ্চিমে গিয়ে সমৃদ্ধি লাভ করে; দ্বিতীয়টি পূর্বে গিয়ে এক শান্ত বাতাসে আটকে পড়ে।",
          "তৃতীয় জাহাজটি প্রতিকূল ও হিমশীতল উত্তরের দিকে দীর্ঘ ও কঠিন যাত্রার উদ্দেশ্যে যাত্রা করে।",
          "উত্তরের জাহাজটি মানুষের সহনশীলতা, কঠোর সংকল্প ও কঠিন লক্ষ্য অর্জনের লড়াইয়ের প্রতীক।"
        ]
      },
      {
        id: "price-bananas",
        chapterNameEn: "The Price of Bananas",
        chapterNameBn: "The Price of Bananas",
        summaryEn: "Mulk Raj Anand's amusing story about a monkey stealing a wealthy businessman's embroidered cap at a railway station.",
        summaryBn: "মুলক রাজ আনন্দ রচিত গল্প যেখানে এক ধনী ব্যবসায়ীর টুপি বানর কর্তৃক কেড়ে নেওয়া এবং এক ফল বিক্রেতার সাহায্যে তা উদ্ধারের ঘটনা বর্ণিত হয়েছে।",
        keyPointsEn: [
          "A monkey steals the cap of a proud, wealthy businessman named Sethji at Ayodhya station.",
          "A poor banana seller coaxes the monkey with bananas and retrieves the cap for Sethji.",
          "Sethji shows extreme ungratefulness by refusing to pay the banana seller the price of the bananas."
        ],
        keyPointsBn: [
          "অযোধ্যা রেলওয়ে স্টেশনে একটি বানর সেঠজি নামক এক অহংকারী ও ধনী ব্যবসায়ীর দামী টুপি কেড়ে নেয়।",
          "এক দরিদ্র কলা বিক্রেতা বানরটিকে কলার লোভ দেখিয়ে সেঠজির টুপিটি উদ্ধার করে দেয়।",
          "টুপিটি ফেরত পেয়েও সেঠজি কলা বিক্রেতাকে কলার ন্যায্য মূল্য দিতে অস্বীকার করে চরম অকৃতজ্ঞতা দেখায়।"
        ]
      },
      {
        id: "shipwrecked-sailor",
        chapterNameEn: "A Shipwrecked Sailor",
        chapterNameBn: "A Shipwrecked Sailor",
        summaryEn: "An exciting narrative based on Daniel Defoe's Robinson Crusoe, describing a sailor's survival on a deserted island.",
        summaryBn: "ড্যানিয়েল ডেফোর 'রবিনসন ক্রুসো'র ওপর ভিত্তি করে রচিত রোমাঞ্চকর কাহিনী যেখানে এক একা নাবিকের দ্বীপে বেঁচে থাকার লড়াই বর্ণিত হয়েছে।",
        keyPointsEn: [
          "The sailor survives a terrible shipwreck and is washed ashore on a lonely, uninhabited island.",
          "He builds a shelter, domesticates animals, and makes a calendar to keep track of time.",
          "The story celebrates human courage, inventiveness, and the urge to survive."
        ],
        keyPointsBn: [
          "এক ভয়াবহ জাহাজডুবির পর নাবিকটি অলৌকিকভাবে বেঁচে গিয়ে এক নির্জন দ্বীপে আশ্রয় পায়।",
          "সে সেখানে নিজের থাকার জন্য কেল্লা তৈরি করে, পশু পালন করে এবং সময় রাখার জন্য একটি ক্যালেন্ডার তৈরি করে।",
          "গল্পটি মানুষের অদম্য সাহস, উদ্ভাবনী শক্তি এবং প্রতিকূল পরিস্থিতিতে বেঁচে থাকার ইচ্ছাকে তুলে ধরে।"
        ]
      },
      {
        id: "hunting-snake",
        chapterNameEn: "Hunting Snake",
        chapterNameBn: "Hunting Snake",
        summaryEn: "Judith Wright's poem capturing the brief, intense experience of watching a black snake search for food.",
        summaryBn: "জুডিথ রাইট রচিত কবিতা যা একটি কালো সাপের শিকার খোঁজার দৃশ্য দেখে মানুষের মনে তৈরি হওয়া ভয় ও রোমাঞ্চকে তুলে ধরে।",
        keyPointsEn: [
          "The speaker and companion stand frozen in awe and fear as a majestic black snake slides past them.",
          "The snake is intent on its prey, ignoring the human observers completely.",
          "After the snake disappears, the observers draw a deep breath and walk on."
        ],
        keyPointsBn: [
          "একটি বিশাল কালো সাপ পাশ দিয়ে যাওয়ার সময় কবি ও তাঁর সঙ্গী ভয়ে ও বিস্ময়ে পাথর হয়ে দাঁড়িয়ে থাকেন।",
          "সাপটি তার নিজের শিকারের খোঁজে মত্ত ছিল এবং মানুষের দিকে কোনো নজর দেয়নি।",
          "সাপটি চলে যাওয়ার পর তাঁরা স্বস্তির নিশ্বাস ফেলেন এবং আবার নিজেদের পথে হাঁটতে শুরু করেন।"
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
        id: "kalinga-jhor",
        chapterNameEn: "Kalinga Deshe Jhor-Bristo",
        chapterNameBn: "কলিঙ্গদেশে ঝড়-বৃষ্টি",
        summaryEn: "Explanation and analysis of Kavikankan Mukundaram Chakrabarty's poem from Chandimangal.",
        summaryBn: "কবিকঙ্কণ মুকুন্দরাম চক্রবর্তী রচিত চণ্ডীমঙ্গল কাব্যের অন্তর্গত কবিতার বিস্তারিত ব্যাখ্যা ও প্রশ্নোত্তর।",
        keyPointsEn: [
          "Devi Chandi initiates a storm in Kalinga to force Kalaketu's city migration.",
          "Description of heavy continuous rain for seven days destroying crops.",
          "Highlights the helpless state of common citizens under natural calamity."
        ],
        keyPointsBn: [
          "দেবী চণ্ডীর ইচ্ছায় কলিঙ্গদেশে প্রলয়ংকর ঝড়-বৃষ্টি শুরু হয়েছিল।",
          "টানা সাতদিনের বৃষ্টিতে খেতখামার ও ঘরবাড়ি নষ্ট হয়ে ভেসে যায়।",
          "প্রাকৃতিক দুর্যোগের মুখে সাধারণ মানুষের অসহায়তা ও আরাধনা প্রকাশ পায়।"
        ]
      },
      {
        id: "dhibor-brittanto",
        chapterNameEn: "Dhibor-Brittanto",
        chapterNameBn: "ধীবর-বৃত্তান্ত",
        summaryEn: "A classic drama section by Kalidasa describing a poor fisherman finding a royal ring.",
        summaryBn: "মহাকবি কালিদাস রচিত নাট্যাংশ যেখানে এক দরিদ্র ধীবরের রাজকীয় আংটি পাওয়ার ঘটনা এবং সততার পরিচয় বর্ণিত হয়েছে।",
        keyPointsEn: [
          "A fisherman finds a precious royal ring inside a fish's belly, leading to his arrest by guards.",
          "King Dushyanta recognizes the ring (which recalls his memory of Shakuntala) and rewards the fisherman.",
          "Highlights class differences and the eventual triumph of honesty."
        ],
        keyPointsBn: [
          "এক দরিদ্র জেলে রুই মাছের পেট থেকে রাজকীয় আংটি খুঁজে পেয়ে বিক্রির সময় রক্ষীদের হাতে ধরা পড়ে।",
          "মহারাজ দুষ্মন্ত আংটিটি দেখে শকুন্তলার স্মৃতি ফিরে পান এবং ধীবরটিকে পুরস্কৃত করে মুক্তি দেন।",
          "সমাজে দরিদ্র মানুষের প্রতি সংশয় এবং সততার শেষ পর্যন্ত জয় এই নাটকের মূল বিষয়।"
        ]
      },
      {
        id: "ilias",
        chapterNameEn: "Ilias",
        chapterNameBn: "ইলিয়াস",
        summaryEn: "Leo Tolstoy's touching story of Ilias, a wealthy landlord who finds true happiness only after losing his riches.",
        summaryBn: "লিও তলস্তয় রচিত বিখ্যাত গল্প যেখানে ধনী ইলিয়াস তার সমস্ত সম্পত্তি হারিয়ে সর্বহারা হওয়ার পর আসল সুখ খুঁজে পায়।",
        keyPointsEn: [
          "Ilias works hard for thirty years to build a massive fortune in Ufa province.",
          "In old age, natural disasters and family disputes reduce him to a poor servant.",
          "Ilias and his wife realize that wealth brought worry, but simplicity brought peace of mind."
        ],
        keyPointsBn: [
          "ইলিয়াস দীর্ঘ ত্রিশ বছরের কঠোর পরিশ্রমে উফা প্রদেশে বিপুল ধনসম্পত্তির মালিক হয়ে উঠেছিল।",
          "বার্ধক্যে মহামারী ও পারিবারিক কারণে সর্বস্বান্ত হয়ে সে অন্যের বাড়িতে ভৃত্য হিসেবে কাজ শুরু করে।",
          "ইলিয়াস ও তার স্ত্রী স্বীকার করে যে সম্পত্তির মোহ তাদের অশান্তি দিত, কিন্তু আজ নিঃস্ব হয়ে তারা শান্তিতে আছে।"
        ]
      },
      {
        id: "daam",
        chapterNameEn: "Daam",
        chapterNameBn: "দাম",
        summaryEn: "Narayan Gangopadhyay's moving story about a strict schoolmaster and his student's realization of the value of teachings.",
        summaryBn: "নারায়ণ গঙ্গোপাধ্যায় রচিত অসাধারণ গল্প যেখানে অংকের এক কঠোর শিক্ষকের স্মৃতি এবং পরে তাঁর স্নেহের প্রতি ছাত্রের ঋণ স্বীকার বর্ণিত হয়েছে।",
        keyPointsEn: [
          "The narrator describes his extreme childhood fear of his school mathematics teacher.",
          "Years later, as a famous college professor, the narrator meets the aging teacher in a village function.",
          "The narrator realizes that the teacher's strictness was actually full of pure love and care."
        ],
        keyPointsBn: [
          "কথক শৈশবে তাঁর স্কুলের অঙ্কের মাস্টারমশাইয়ের কড়া শাসন ও মারের কথা অত্যন্ত ভয়ের সাথে স্মরণ করেছেন।",
          "বহু বছর পর এক গ্রাম্য সভায় বক্তা হিসেবে গিয়ে কথক তাঁর সেই বৃদ্ধ জীর্ণ মাস্টারমশাইয়ের দেখা পান।",
          "তিনি বুঝতে পারেন মাস্টারমশাইয়ের সেই শাসনের পেছনে ছিল এক অদ্ভুত পিতৃস্নেহ ও ছাত্রের মঙ্গল সাধনা।"
        ]
      },
      {
        id: "nobonobo-shristi",
        chapterNameEn: "Nobonobo Shristi",
        chapterNameBn: "নবনব সৃষ্টি",
        summaryEn: "Syed Mujtaba Ali's thought-provoking essay on the purity and assimilation of Bengali and other world languages.",
        summaryBn: "সৈয়দ মুজতবা আলী রচিত প্রবন্ধ যেখানে বাংলা ও বিশ্বের অন্যান্য ভাষায় নতুন নতুন শব্দ তৈরির ধারা ও সংস্কৃতির মিশ্রণ আলোচিত হয়েছে।",
        keyPointsEn: [
          "Bengali language is highly creative and assimilative, taking words from Sanskrit, Persian, and English.",
          "Languages like Sanskrit and Arabic are self-reliant as they don't borrow easily.",
          "Advocates for keeping language open and natural rather than artificially pure."
        ],
        keyPointsBn: [
          "বাংলা ভাষা নিজস্ব প্রয়োজনে সংস্কৃত, আরবি, ফারসি ও ইংরেজি থেকে প্রচুর শব্দ গ্রহণ করে সমৃদ্ধ হয়েছে।",
          "সংস্কৃত ও আরবি ভাষা নিজের শব্দভাণ্ডার তৈরিতে স্বয়ংসম্পূর্ণ ও আত্মনির্ভরশীল।",
          "ভাষা কৃত্রিমভাবে পরিশুদ্ধ রাখার চেয়ে তার স্বাভাবিক বহমানতা বজায় রাখা উচিত।"
        ]
      },
      {
        id: "noogor",
        chapterNameEn: "Noogor",
        chapterNameBn: "নোঙর",
        summaryEn: "Ajit Dutta's metaphorical poem depicting the human urge to sail ahead despite being anchored by worldly ties.",
        summaryBn: "অজিত দত্তের রূপকধর্মী কবিতা যেখানে জীবনের চলার আকাঙ্ক্ষা এবং সংসার বন্ধনে আটকে থাকার বেদনা চিত্রিত হয়েছে।",
        keyPointsEn: [
          "The poet rows his boat throughout the night, but the anchor (noogor) is stuck in the mud.",
          "The oars represent human effort, while the anchor represents worldly responsibilities and limitations.",
          "Highlights the eternal conflict between human dreams and cold reality."
        ],
        keyPointsBn: [
          "কবি সারারাত নৌকার দাঁড় টানলেও জোয়ারের স্রোতে নৌকাটি তীরের নোঙরে আটকে নিশ্চল হয়ে দাঁড়িয়ে থাকে।",
          "দাঁড় টানা হল মানুষের কর্মপ্রচেষ্টা আর নোঙর হল সংসারের মায়া-বন্ধন ও বাস্তব সীমাবদ্ধতা।",
          "মানুষের অন্তহীন স্বপ্ন ও কঠিন বাস্তবের টানাপোড়েন এই কবিতার মূল সুর।"
        ]
      },
      {
        id: "himalay-darshan",
        chapterNameEn: "Himalay Darshan",
        chapterNameBn: "হিমালয় দর্শন",
        summaryEn: "Begum Rokeya's travelogue describing her travel to Darjeeling and her spiritual awe at the Himalayas.",
        summaryBn: "বেগম রোকেয়া সাখাওয়াত হোসেন রচিত ভ্রমণকাহিনী যেখানে হিমালয়ের প্রাকৃতিক সৌন্দর্য ও স্রষ্টার প্রতি ভক্তি প্রকাশ পেয়েছে।",
        keyPointsEn: [
          "Begum Rokeya describes her journey to Darjeeling via Toy Train and her stay amidst clouds.",
          "She is mesmerized by the giant peaks, waterfalls, and diverse flora.",
          "The travelogue serves as a medium to reflect on the greatness of God and women's education."
        ],
        keyPointsBn: [
          "বেগম রোকেয়া ট্রেনে চেপে কার্শিয়াং ও দার্জিলিং ভ্রমণের অভিজ্ঞতা ও মেঘে ঢাকা পাহাড়ি পরিবেশের বর্ণনা দিয়েছেন।",
          "বিশাল পর্বতশৃঙ্গ, পাহাড়ি ঝর্ণা ও নাম না জানা গাছপালা দেখে তিনি মুগ্ধ হন।",
          "প্রকৃতির রূপ দেখে লেখিকার মনে ঈশ্বরচিন্তা ও বিশ্বব্রহ্মাণ্ডের মহিমা জাগ্রত হয়।"
        ]
      },
      {
        id: "kheya",
        chapterNameEn: "Kheya",
        chapterNameBn: "খেয়া",
        summaryEn: "Rabindranath Tagore's tranquil poem contrasting rural peace with global political conflicts.",
        summaryBn: "রবীন্দ্রনাথ ঠাকুর রচিত কবিতা যেখানে গ্রামীণ খেয়া পারাপারের সাধারণ ছবির মাধ্যমে চিরন্তন জীবনপ্রবাহ এবং ইতিহাসের উত্থান-পতন আলোচিত হয়েছে।",
        keyPointsEn: [
          "The ferry boat (kheya) quietly carries people across the river, connecting two villages.",
          "Meanwhile, empires rise and fall, and wars rage in the outer world.",
          "Tagore emphasizes that simple, daily human bonds outlive mighty kingdoms."
        ],
        keyPointsBn: [
          "খেয়ানৌকা প্রতিদিন সকাল-সন্ধ্যায় দুই তীরের মানুষকে মিলিয়ে দিয়ে নদী পারাপার করে।",
          "বাইরের পৃথিবীতে যুদ্ধ হয়, সাম্রাজ্যের ভাঙা-গড়া চলে, সোনার মুকুট ধুলোয় মেশে।",
          "নদী পারাপারের মতো শান্ত গ্রামীণ জীবনপ্রবাহ ও মানুষের পারস্পরিক ভালোবাসাই চিরন্তন।"
        ]
      },
      {
        id: "niruddesh",
        chapterNameEn: "Niruddesh",
        chapterNameBn: "নিরুদ্দেশ",
        summaryEn: "Jyotirindranath Nandi's story about a young runaway boy and his family's desperation to find him.",
        summaryBn: "জ্যোতিরিন্দ্র নন্দী রচিত গল্প যেখানে বাড়ি থেকে পালিয়ে যাওয়া ছেলের জন্য একটি মধ্যবিত্ত পরিবারের হাহাকার ও সংবাদপত্রে বিজ্ঞাপনের চিত্র ফুটে উঠেছে।",
        keyPointsEn: [
          "A son runs away from home after a minor scuffle with his strict father.",
          "The mother is heartbroken, forcing the father to post desperate advertisements in newspapers.",
          "The story explores the fragile emotional bonds of a middle-class family."
        ],
        keyPointsBn: [
          "পিতার বকুনি খেয়ে এক জেদি ছেলে বাড়ি থেকে অভিমানে পালিয়ে যায়।",
          "মায়ের কান্নাকাটি ও আকুলতায় পিতা বাধ্য হয়ে সংবাদপত্রে নিখোঁজ বিজ্ঞাপন দিতে ছোটেন।",
          "গল্পটিতে মধ্যবিত্ত পরিবারের আবেগ, জেদ ও স্নেহের সূক্ষ্ম সম্পর্কের প্রকাশ ঘটেছে।"
        ]
      },
      {
        id: "abohoman",
        chapterNameEn: "Abohoman",
        chapterNameBn: "আবহমান",
        summaryEn: "Nirendranath Chakraborty's beautiful poem about the eternal bond between a human and their rural homeland.",
        summaryBn: "নীরেন্দ্রনাথ চক্রবর্তী রচিত কবিতা যা গ্রামীণ ভিটেমাটি এবং নিজ জন্মভূমির প্রতি মানুষের নাড়ির টানকে নির্দেশ করে।",
        keyPointsEn: [
          "No matter where a person goes, they eventually yearn to return to the courtyard with the sweet star-jasmine tree.",
          "The soil, the grass, the simple night sky of the village remain unchanged over generations.",
          "Homeland is the ultimate solace for a tired human soul."
        ],
        keyPointsBn: [
          "মানুষ যেখানেই যাক না কেন, নিজের উঠোনের লাউমাচা আর শিউলি গাছের শান্ত আশ্রয়ে ফিরে আসার ইচ্ছা তার কখনো মরে না।",
          "গ্রামের হাওয়া, শান্ত অন্ধকার আর ভিজে মাটির গন্ধ বছরের পর বছর একইভাবে মানুষকে টানে।",
          "জন্মভিটে বা নিজের শেকড়ই হল মানুষের ক্লান্ত মনের একমাত্র শান্তিময় আশ্রয়।"
        ]
      },
      {
        id: "radharani",
        chapterNameEn: "Radharani",
        chapterNameBn: "রাধারাণী",
        summaryEn: "Bankim Chandra Chattopadhyay's classic story of a young girl's struggles during a wet chariot festival (Rath Yatra).",
        summaryBn: "বঙ্কিমচন্দ্র চট্টোপাধ্যায় রচিত বিখ্যাত কাহিনী যেখানে এক অসচ্ছল পরিবারের বালিকা রাধারাণীর রথের মেলায় ফুল বিক্রি ও এক সহৃদয় ব্যক্তির সাহায্যের কাহিনী বর্ণিত হয়েছে।",
        keyPointsEn: [
          "Radharani goes to the Mahesh Rath Yatra to sell hand-woven flower garlands to buy medicine for her sick mother.",
          "It rains heavily, and she gets lost in the dark without selling her garlands.",
          "A kind stranger meets her in the dark, buys her flowers at a high price, and secretly leaves help for them."
        ],
        keyPointsBn: [
          "রাধারাণী তার অসুস্থ বিধবা মায়ের পথের পথ্য জোগাতে মহেশের রথের মেলায় নিজের গাঁথা ফুলের মালা বিক্রি করতে যায়।",
          "প্রবল বৃষ্টিতে মেলা ভেঙে গেলে সে অন্ধকারে কাঁদতে কাঁদতে ফিরছিল, এমন সময় এক দয়ালু পথিক তার সমস্ত মালা কিনে নেয়।",
          "সেই মহৎ ব্যক্তি রুক্মিণীকুমার গোপনে রাধারাণীর কুটিরে টাকা ও নোট রেখে যান, যা তাদের জীবনে নতুন আশা দেয়।"
        ]
      },
      {
        id: "chithi",
        chapterNameEn: "Chithi (The Letter)",
        chapterNameBn: "চিঠি",
        summaryEn: "Swami Vivekananda's famous letter written to Miss Margaret Noble (Sister Nivedita) about working for India's upliftment.",
        summaryBn: "স্বামী বিবেকানন্দ কর্তৃক মিস নোবেলকে (ভগিনী নিবেদিতা) লেখা চিঠি যেখানে ভারতের সমাজসেবায় তাঁর আহ্বান ও সতর্কবার্তা রয়েছে।",
        keyPointsEn: [
          "Swamiji encourages Margaret Noble to come to India to work for the empowerment of Indian women.",
          "He realistically warns her about the extreme heat, poverty, and superstitions in India.",
          "He assures her of his lifelong support, regardless of her success or failure."
        ],
        keyPointsBn: [
          "স্বামীজি মার্গারেট নোবেলকে ভারতের নারী সমাজের কল্যাণে কাজ করার জন্য এগিয়ে আসার আহ্বান জানান।",
          "তিনি ভারতের চরম গরম, দারিদ্র্য ও কুসংস্কারের বাস্তব চিত্র তুলে ধরে তাঁকে আগে থেকেই সতর্ক করেন।",
          "তিনি আশ্বাস দেন যে সফল হোন বা ব্যর্থ—সব পরিস্থিতিতেই তিনি সর্বদা তাঁর পাশে থাকবেন।"
        ]
      },
      {
        id: "bhangar-gaan",
        chapterNameEn: "Bhangar Gaan",
        chapterNameBn: "ভাঙার গান",
        summaryEn: "Kazi Nazrul Islam's fiery patriotic poem calling upon the youth to break open the prison gates of British oppressors.",
        summaryBn: "কাজী নজরুল ইসলাম রচিত অগ্নিঝরা দেশাত্মবোধক কবিতা যা যুবসমাজকে পরাধীনতার শৃঙ্খল ও কারাগার ভেঙে ফেলার ডাক দেয়।",
        keyPointsEn: [
          "Nazrul urges the youth to demolish the prison walls built by colonial masters using their sheer strength.",
          "The poem is filled with revolutionary zeal, urging the worship of Lord Shiva (the destroyer).",
          "Slogans of freedom to shatter the silent passivity of the oppressed people."
        ],
        keyPointsBn: [
          "নজরুল যুবসমাজকে লাথি মেরে শৃঙ্খল ও অন্যায়ের প্রতীক লোহার কারাগার ভেঙে ফেলার আহ্বান জানিয়েছেন।",
          "কবিতাটি বিপ্লবী চেতনায় টগবগে এবং এতে ধ্বংসের দেবতা শিবের তাণ্ডবনৃত্যের রূপ ফুটিয়ে তোলা হয়েছে।",
          "পরাধীন দেশের মানুষকে ঘুম থেকে জাগিয়ে স্বাধীনতা ছিনিয়ে আনার এক বলিষ্ঠ আহ্বান এই কবিতা।"
        ]
      },
      {
        id: "aam-atier-bhepu",
        chapterNameEn: "Aam Aatier Bhepu (Supplementary)",
        chapterNameBn: "আম আঁটির ভেঁপু",
        summaryEn: "Extracts from Bibhutibhushan Bandyopadhyay's masterpiece Pather Panchali, centering on the childhood of Apu and Durga.",
        summaryBn: "বিভূতিভূষণ বন্দ্যোপাধ্যায় রচিত কালজয়ী উপন্যাস 'পথের পাঁচালী'র প্রথম অংশ যেখানে অপু ও দুর্গার সরল শৈশব জীবন ও প্রকৃতির বর্ণনা রয়েছে।",
        keyPointsEn: [
          "The siblings Apu and Durga explore their rural village Nischindipur with innocent wonder.",
          " Durga's protective care for her younger brother Apu and their shared joy over small things like a mango-stone whistle (bhepu).",
          "Depicts the rich beauty of Bengal's countryside amidst severe household poverty."
        ],
        keyPointsBn: [
          "অপু ও দুর্গা দুই ভাইবোন নিশ্চিন্দিপুর গ্রামের মাঠে-ঘাটে পরম কৌতুহল ও আনন্দে ঘুরে বেড়ায়।",
          "ছোট ভাই অপুর প্রতি দুর্গার স্নেহ এবং সস্তা খেলনা বা আম আঁটির ভেঁপু বাজানোর রোমাঞ্চকর অভিজ্ঞতা।",
          "নিদারুণ অভাবের মধ্যেও বাংলার সহজ-সরল পল্লীপ্রকৃতির কোলে বেড়ে ওঠার এক জীবন্ত চিত্র প্রকাশ পায়।"
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
        id: "french-revolution",
        chapterNameEn: "French Revolution",
        chapterNameBn: "ফরাসি বিপ্লব",
        summaryEn: "Political, social, and economic causes of the 1789 French Revolution, and the major phases of the movement.",
        summaryBn: "১৭৮৯ সালের ফরাসি বিপ্লবের রাজনৈতিক, সামাজিক ও অর্থনৈতিক কারণসমূহ এবং বিপ্লবের বিভিন্ন পর্যায়ের ইতিহাস।",
        keyPointsEn: [
          "Inequality among the Three Estates of French society was a primary trigger.",
          "Storming of the Bastille on July 14, 1789, symbolized the fall of tyranny.",
          "Declaration of the Rights of Man and of the Citizen established universal human rights."
        ],
        keyPointsBn: [
          "ফরাসি সমাজের যাজক, অভিজাত ও সাধারণ মানুষের মধ্যকার বৈষম্য ছিল প্রধান কারণ।",
          "১৭৮৯ সালের ১৪ই জুলাই বাস্‌তিল দুর্গের পতন রাজতন্ত্রের অবসান নির্দেশ করে।",
          "মানবাধিকার ঘোষণা পত্রের মাধ্যমে মানুষের স্বাধীনতা ও সাম্যের অধিকার স্বীকৃত হয়।"
        ]
      },
      {
        id: "napoleonic-empire",
        chapterNameEn: "Napoleonic Empire",
        chapterNameBn: "নেপোলিয়নীয় সাম্রাজ্য",
        summaryEn: "Rise of Napoleon Bonaparte, his administrative reforms (Napoleonic Code), and his eventual downfall at Waterloo.",
        summaryBn: "নেপোলিয়ন বোনাপার্টের উত্থান, তাঁর প্রশাসনিক সংস্কারসমূহ (কোড নেপোলিয়ন) এবং ওয়াটারলুর যুদ্ধে তাঁর পতন।",
        keyPointsEn: [
          "Napoleon consolidated French administrative system through the 'Code Napoleon' of 1804.",
          "He conquered most of continental Europe, spreading the ideals of the French Revolution.",
          "His invasion of Russia in 1812 was a major tactical failure, leading to his decline."
        ],
        keyPointsBn: [
          "১৮০৪ সালের 'কোড নেপোলিয়ন' বা আইন সংহিতার মাধ্যমে তিনি শাসন ব্যবস্থা পুনর্গঠন করেন।",
          "তিনি ইউরোপের বিস্তীর্ণ অঞ্চল জয় করে ফরাসি বিপ্লবের উদার আদর্শ ছড়িয়ে দেন।",
          "১৮১২ সালে রাশিয়ার ওপর আক্রমণ ছিল তাঁর জীবনের এক মস্ত ভুল যা তাঁর পতন ডেকে আনে।"
        ]
      },
      {
        id: "nineteenth-century-europe",
        chapterNameEn: "19th Century Europe",
        chapterNameBn: "ঊনবিংশ শতকের ইউরোপ",
        summaryEn: "Unification of Italy and Germany, the Concert of Europe, and the rise of nationalism.",
        summaryBn: "ইতালি ও জার্মানির ঐক্য আন্দোলন, মেটারনিক ব্যবস্থা এবং ইউরোপে জাতীয়তাবাদের বিকাশ।",
        keyPointsEn: [
          "Unification of Italy was led by Mazzini, Cavour, and Garibaldi.",
          "Otto von Bismarck unified Germany using his famous 'Blood and Iron' policy.",
          "Nationalism transformed Europe from multi-ethnic empires to modern nation-states."
        ],
        keyPointsBn: [
          "মাজ্জিনি, কাভুর এবং গ্যারিবল্ডির নেতৃত্বে ইতালির ঐক্যবদ্ধকরণ সম্পন্ন হয়।",
          "অটো ভন বিসমার্ক তাঁর বিখ্যাত 'রক্ত ও লৌহ' নীতির দ্বারা জার্মানিকে ঐক্যবদ্ধ করেন।",
          "জাতীয়তাবাদী আন্দোলনের ফলে ইউরোপের সাম্রাজ্যগুলি আধুনিক জাতি রাষ্ট্রে পরিণত হয়।"
        ]
      },
      {
        id: "industrial-revolution-imperialism",
        chapterNameEn: "Industrial Revolution and Imperialism",
        chapterNameBn: "শিল্প বিপ্লব ও উপনিবেশবাদ",
        summaryEn: "Origins of the Industrial Revolution in England, key inventions, and the subsequent rise of colonies.",
        summaryBn: "ইংল্যান্ডে শিল্প বিপ্লবের সূচনা ও কারণসমূহ, নতুন বৈজ্ঞানিক আবিষ্কার এবং বিশ্বজুড়ে উপনিবেশ স্থাপনের লড়াই।",
        keyPointsEn: [
          "The steam engine invented by James Watt revolutionized manufacturing and transport.",
          "Industrialization led to a division of society into Capitalists (Bourgeoisie) and Workers (Proletariat).",
          "Imperialist powers colonized Asia and Africa to secure raw materials and markets."
        ],
        keyPointsBn: [
          "জেমস ওয়াট আবিষ্কৃত স্টিম ইঞ্জিন উৎপাদন ও পরিবহন ব্যবস্থায় বৈপ্লবিক পরিবর্তন আনে।",
          "শিল্প বিপ্লব সমাজকে পুঁজিপতি এবং সর্বহারা—এই দুটি প্রধান শ্রেণীতে বিভক্ত করেছিল।",
          "ইউরোপীয় শক্তিগুলি কাঁচামাল এবং বিক্রয় বাজারের জন্য এশিয়া ও আফ্রিকায় উপনিবেশ বিস্তার করে।"
        ]
      },
      {
        id: "twentieth-century-europe",
        chapterNameEn: "20th Century Europe",
        chapterNameBn: "বিশ শতকের ইউরোপ",
        summaryEn: "Outbreak of the First World War, the Russian Revolution of 1917, and the rise of Fascism and Nazism.",
        summaryBn: "প্রথম বিশ্বযুদ্ধের কারণসমূহ, ১৯১৭ সালের রুশ বিপ্লব এবং ইতালিতে ফ্যাসিবাদ ও জার্মানিতে নাৎসিবাদের উত্থান।",
        keyPointsEn: [
          "WWI was triggered by the assassination of Archduke Franz Ferdinand in 1914.",
          "Bolshevik Revolution led by Vladimir Lenin established the world's first socialist state.",
          "Economic depression after WWI paved the way for totalitarian leaders like Mussolini and Hitler."
        ],
        keyPointsBn: [
          "১৯১৪ সালে আর্চডিউক ফ্রাঞ্জ ফার্দিনান্দের হত্যাকাণ্ড প্রথম বিশ্বযুদ্ধের তাৎক্ষণিক কারণ ছিল।",
          "ভ্লাদিমির লেলিনের নেতৃত্বে বলশেভিক বিপ্লব বিশ্বের প্রথম সমাজতান্ত্রিক রাষ্ট্র গঠন করে।",
          "মহাযুদ্ধোত্তর অর্থনৈতিক মন্দা ইতালি ও জার্মানিতে একনায়কতন্ত্রের পথ প্রশস্ত করে।"
        ]
      },
      {
        id: "wwii-un",
        chapterNameEn: "Second World War and United Nations",
        chapterNameBn: "দ্বিতীয় বিশ্বযুদ্ধ ও সম্মিলিত জাতিপুঞ্জ",
        summaryEn: "Causes of WWII, the Axis vs Allied powers, and the formation of the United Nations to maintain global peace.",
        summaryBn: "দ্বিতীয় বিশ্বযুদ্ধের পটভূমি, অক্ষশক্তি ও মিত্রশক্তির লড়াই এবং বিশ্বশান্তি রক্ষায় সম্মিলিত জাতিপুঞ্জের প্রতিষ্ঠা।",
        keyPointsEn: [
          "WWII began in 1939 with Hitler's invasion of Poland.",
          "The atomic bombings of Hiroshima and Nagasaki in 1945 led to the end of the war.",
          "The United Nations (UN) was established on October 24, 1945, to prevent future global conflicts."
        ],
        keyPointsBn: [
          "১৯৩৯ সালে হিটলারের পোল্যান্ড আক্রমণের মাধ্যমে দ্বিতীয় বিশ্বযুদ্ধ শুরু হয়।",
          "১৯৪৫ সালে হিরোশিমা ও নাগাসাকিতে পারমাণবিক বোমা নিক্ষেপের পর যুদ্ধের অবসান ঘটে।",
          "ভবিষ্যতে বিশ্বযুদ্ধ এড়াতে ১৯৪৫ সালের ২৪শে অক্টোবর সম্মিলিত জাতিপুঞ্জ (UN) প্রতিষ্ঠিত হয়।"
        ]
      }
    ]
  },
  {
    id: "geography",
    nameEn: "Geography",
    nameBn: "ভূগোল",
    icon: "🌍",
    chapters: [
      {
        id: "planets-earth",
        chapterNameEn: "Earth as a Planet",
        chapterNameBn: "গ্রহরূপী পৃথিবী",
        summaryEn: "Spherical shape of Earth, proofs, coordinates, and rotation vs revolution.",
        summaryBn: "পৃথিবীর গোলকাকার আকৃতির প্রমাণ, অক্ষাংশ ও দ্রাঘিমাংশ এবং পৃথিবীর আহ্নিক ও বার্ষিক গতি।",
        keyPointsEn: [
          "Eratosthenes first measured the circumference of the Earth.",
          "Bedford Level Experiment proved the Earth's curved surface.",
          "The Earth's shape is technically a Geoid (Earth-shaped)."
        ],
        keyPointsBn: [
          "এরাটোস্থেনিস প্রথম পৃথিবীর পরিধি পরিমাপ করেন।",
          "বেডফোর্ড লেভেল পরীক্ষা পৃথিবীর বক্রতার প্রমাণ দেয়।",
          "পৃথিবীর প্রকৃত আকৃতি জিয়ড (Geoid) বা পৃথিবীর মতোই।"
        ]
      },
      {
        id: "earth-motions",
        chapterNameEn: "Motions of the Earth",
        chapterNameBn: "পৃথিবীর গতি",
        summaryEn: "Detailed study of rotation and revolution, solstices, equinoxes, and changing of seasons.",
        summaryBn: "আহ্নিক ও বার্ষিক গতির খুঁটিনাটি, অয়নান্ত দিবস, বিষুব এবং ঋতু পরিবর্তন প্রক্রিয়া।",
        keyPointsEn: [
          "Rotation causes day and night; Revolution causes seasons and changing length of days.",
          "Equinoxes occur on March 21 (Vernal Equinox) and September 23 (Autumnal Equinox) when day and night are equal.",
          "Summer Solstice is on June 21 and Winter Solstice is on December 21."
        ],
        keyPointsBn: [
          "আহ্নিক গতির ফলে দিন ও রাত্রি হয়; বার্ষিক গতির ফলে ঋতু পরিবর্তন ও দিন-রাত্রির দৈর্ঘ্যের হ্রাস-বৃদ্ধি ঘটে।",
          "২১শে মার্চ (মহাবিষুব) এবং ২৩শে সেপ্টেম্বর (জলবিষুব) পৃথিবীর সর্বত্র দিন ও রাত্রি সমান হয়।",
          "২১শে জুন কর্কটক্রান্তি দিবস এবং ২২শে ডিসেম্বর মকরক্রান্তি দিবস।"
        ]
      },
      {
        id: "earth-location",
        chapterNameEn: "Determination of Location on Earth's Surface",
        chapterNameBn: "স্থান নির্ণয়",
        summaryEn: "Understanding latitude, longitude, Prime Meridian, International Date Line, and calculation of local time.",
        summaryBn: "অক্ষাংশ, দ্রাঘিমাংশ, মূলমধ্যরেখা ও আন্তর্জাতিক তারিখরেখার ধারণা এবং স্থানভেদে সময় গণনার নিয়ম।",
        keyPointsEn: [
          "Latitudes run horizontally (parallels of latitude); Longitudes run vertically (meridians of longitude).",
          "1 degree of longitude difference corresponds to 4 minutes of time difference.",
          "International Date Line (180° meridian) is deviated to avoid cutting through landmasses."
        ],
        keyPointsBn: [
          "অক্ষরেখাগুলি পূর্ব-পশ্চিমে বিস্তৃত এবং দ্রাঘিমারেখাগুলি উত্তর-দক্ষিণে বিস্তৃত।",
          "১ ডিগ্রি দ্রাঘিমার পার্থক্যে ৪ মিনিট সময়ের পার্থক্য ঘটে।",
          "আন্তর্জাতিক তারিখরেখাকে (১৮০ ডিগ্রি দ্রাঘিমা) স্থলভাগ এড়াতে সমুদ্রের ওপর দিয়ে বাঁকিয়ে দেওয়া হয়েছে।"
        ]
      },
      {
        id: "landforms",
        chapterNameEn: "Geomorphic Processes & Landforms",
        chapterNameBn: "ভূমিরূপ গঠনকারী প্রক্রিয়া ও পৃথিবীর প্রধান ভূমিরূপ",
        summaryEn: "Endogenetic and exogenetic processes, and formation of fold, block, and volcanic mountains, plateaus, and plains.",
        summaryBn: "অভ্যন্তরীণ ও বাহ্যিক প্রক্রিয়া এবং ভঙ্গিল, স্তূপ ও আগ্নেয় পর্বত, মালভূমি ও সমভূমির সৃষ্টি রহস্য।",
        keyPointsEn: [
          "Endogenetic forces (like tectonic movements) create major relief features; exogenetic forces (like weathering) sculpt them.",
          "Fold mountains (e.g., Himalayas) are formed by compressive tectonic forces.",
          "Plateaus are often called tablelands due to their flat tops and steep sides."
        ],
        keyPointsBn: [
          "অভ্যন্তরীণ শক্তি বড় বড় ভূমিরূপ গঠন করে আর বাহ্যিক শক্তি (যেমন নদী, বায়ু) তাদের ক্ষয় করে ভাস্কর্য দান করে।",
          "ভাঁজ বা ভঙ্গিল পর্বত (যেমন হিমালয়) ভূ-গাঠনিক সংকোচনের ফলে গঠিত হয়।",
          "মালভূমিকে তাদের সমতল মাথা ও খাড়া ঢালের জন্য 'টেবিলল্যান্ড' বা টেবিল আকৃতির ভূমি বলা হয়।"
        ]
      },
      {
        id: "weathering-9",
        chapterNameEn: "Weathering",
        chapterNameBn: "আবহবিকার",
        summaryEn: "Processes of mechanical and chemical weathering, mass wasting, and soil formation.",
        summaryBn: "যান্ত্রিক ও রাসায়নিক আবহবিকার, পুঞ্জিত ক্ষয় এবং মাটি গঠনের প্রক্রিয়া আলোচনা।",
        keyPointsEn: [
          "Mechanical weathering breaks rocks into smaller pieces without chemical changes (e.g., Exfoliation).",
          "Chemical weathering alters the mineral composition of rocks (e.g., Carbonation, Oxidation).",
          "Weathering is the prerequisite for soil formation as it creates regolith."
        ],
        keyPointsBn: [
          "যান্ত্রিক আবহবিকারে খনিজ গঠন পরিবর্তন না করে শিলা খণ্ড খণ্ড হয়ে ভেঙে যায় (যেমন শল্কমোচন)।",
          "রাসায়নিক আবহবিকার শিলার খনিজ উপাদানের রাসায়নিক পরিবর্তন ঘটায় (যেমন অঙ্গারযোজন, জারণ)।",
          "আবহবিকার মৃত্তিকা গঠনের প্রথম ধাপ, যা রেগোলিথ সৃষ্টি করে।"
        ]
      },
      {
        id: "hazards-disasters",
        chapterNameEn: "Hazards and Disasters",
        chapterNameBn: "দুর্যোগ ও বিপর্যয়",
        summaryEn: "Natural and man-made hazards, difference between hazard and disaster, and management of cyclones, earthquakes, and landslides.",
        summaryBn: "প্রাকৃতিক ও মানবসৃষ্ট দুর্যোগের ধারণা, দুর্যোগ ও বিপর্যয়ের পার্থক্য এবং ভূমিকম্প, ধস ও ঘূর্ণিঝড় মোকাবিলা।",
        keyPointsEn: [
          "A hazard is a dangerous event that has potential to cause harm; a disaster is the actual occurrence causing massive damage.",
          "Earthquakes are measured using the Richter scale (magnitude) and Mercalli scale (intensity).",
          "Preparedness and warning systems can significantly reduce disaster casualties."
        ],
        keyPointsBn: [
          "দুর্যোগ হল একটি সম্ভাব্য আশঙ্কাজনক ঘটনা, আর বিপর্যয় হল সেই ঘটনার বাস্তব রূপ যা ব্যাপক ক্ষয়ক্ষতি ঘটায়।",
          "ভূমিকম্পের তীব্রতা রিখটার স্কেলে মাপা হয়।",
          "পূর্বপ্রস্তুতি এবং দ্রুত সতর্কতা ব্যবস্থার মাধ্যমে ক্ষয়ক্ষতি বহুলকাংশে কমানো সম্ভব।"
        ]
      },
      {
        id: "resources-india-9",
        chapterNameEn: "Resources of India",
        chapterNameBn: "ভারতের সম্পদ",
        summaryEn: "Classification of resources, mineral resources (iron ore, bauxite, coal, petroleum), and non-conventional energy sources.",
        summaryBn: "সম্পদের শ্রেণীবিভাগ, খনিজ সম্পদ (লোহা, বক্সাইট, কয়লা, খনিজ তেল) এবং অপ্রচলিত শক্তির ব্যবহার।",
        keyPointsEn: [
          "Resources can be biotic/abiotic, renewable (solar, wind) or non-renewable (fossil fuels).",
          "India is rich in iron ore (found in Odisha and Jharkhand) and coal (Damodar valley).",
          "Promoting solar and wind energy is crucial for green and sustainable development."
        ],
        keyPointsBn: [
          "সম্পদ সজীব/নির্জীব এবং নবায়নযোগ্য (সৌর, বায়ু) বা অনবায়নযোগ্য (কয়লা, খনিজ তেল) হতে পারে।",
          "ভারত লৌহ আকরিক (ওড়িশা ও ঝাড়খণ্ড) এবং কয়লা উৎপাদনে (দামোদর উপত্যকা) বেশ সমৃদ্ধ।",
          "পরিবেশ বান্ধব উন্নয়নের জন্য সৌরশক্তি ও বায়ুশক্তির প্রসার অত্যন্ত জরুরি।"
        ]
      },
      {
        id: "west-bengal-geography-9",
        chapterNameEn: "Geography of West Bengal",
        chapterNameBn: "পশ্চিমবঙ্গের ভূগোল",
        summaryEn: "Physical geography of West Bengal: mountains, rivers, plateau region, plains, agriculture, and economic resources.",
        summaryBn: "পশ্চিমবঙ্গের প্রাকৃতিক অবস্থান, হিমালয় অঞ্চল, রাঢ় অঞ্চল, সুন্দরবন, কৃষিকাজ এবং অর্থনৈতিক পরিবেশ।",
        keyPointsEn: [
          "Sandakphu is the highest mountain peak of West Bengal, located in the Singalila ridge.",
          "Teesta, Jaldhaka, and Torsa are major north-flowing rivers.",
          "Sundarbans delta is the world's largest mangrove forest, declared a UNESCO World Heritage site."
        ],
        keyPointsBn: [
          "সান্দাকফু হল পশ্চিমবঙ্গের সর্বোচ্চ শৃঙ্গ, যা সিঙ্গা লিলা পর্বতশ্রেণীতে অবস্থিত।",
          "তিস্তা, জলঢাকা এবং তোর্সা হল উত্তরবঙ্গের প্রধান নদী।",
          "সুন্দরবন geography-র দিক থেকে পৃথিবীর বৃহত্তম ম্যানগ্রোভ অরণ্য এবং ইউনেস্কো ওয়ার্ল্ড হেরিটেজ সাইট।"
        ]
      },
      {
        id: "maps-scales",
        chapterNameEn: "Maps and Scales",
        chapterNameBn: "মানচিত্র ও স্কেল",
        summaryEn: "Basics of cartography, types of maps, scale calculation, and representative fractions (RF).",
        summaryBn: "মানচিত্র অঙ্কন বিদ্যা, বিভিন্ন ধরনের মানচিত্র, স্কেল গণনা এবং ভগ্নাংশসূচক স্কেলের (RF) ব্যবহার।",
        keyPointsEn: [
          "Scale is the ratio between distance on the map and actual distance on the ground.",
          "Scales can be verbal, linear (graphical), or Representative Fraction (e.g., 1:50,000).",
          "Topographical maps use precise contour lines to show elevations and reliefs."
        ],
        keyPointsBn: [
          "স্কেল বা মানচিত্রের অনুপাত হল মানচিত্রের দূরত্ব ও ভূমির প্রকৃত দূরত্বের অনুপাত।",
          "স্কেল তিনভাবে দেখানো যায়: বিবৃতিমূলক, রৈখিক এবং ভগ্নাংশসূচক স্কেল (যেমন ১:৫০,০০০)।",
          "টোপোগ্রাফিক্যাল বা ভূসংস্থানিক মানচিত্রে সমন্বতি রেখার সাহায্যে ভূমির উচ্চতা নিখুঁতভাবে দেখানো হয়।"
        ]
      }
    ]
  }
];

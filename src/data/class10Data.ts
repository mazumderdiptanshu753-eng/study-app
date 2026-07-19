import { SubjectData } from "./class9Data";

export const class10Subjects: SubjectData[] = [
  {
    id: "math",
    nameEn: "Mathematics",
    nameBn: "গণিত",
    icon: "📐",
    chapters: [
      {
        id: "quadratic-eq",
        chapterNameEn: "Quadratic Equation with One Variable (Ch 1)",
        chapterNameBn: "একচল বিশিষ্ট দ্বিঘাত সমীকরণ (অধ্যায় ১)",
        summaryEn: "Detailed look into quadratic equations of form ax² + bx + c = 0, finding roots using factorization and Sridhara Acharya's formula.",
        summaryBn: "ax² + bx + c = ০ আকারের দ্বিঘাত সমীকরণ, উৎপাদকে বিশ্লেষণ এবং শ্রীধর আচার্যের সূত্রের সাহায্যে বীজ নির্ণয়।",
        keyPointsEn: [
          "Sridhara Acharya's formula: x = [-b ± √(b² - 4ac)] / 2a.",
          "Discriminant (D) = b² - 4ac determines the nature of the roots.",
          "If D > 0: roots are real and unequal. If D = 0: roots are real and equal. If D < 0: roots are imaginary."
        ],
        keyPointsBn: [
          "শ্রীধর আচার্যের সূত্র: x = [-b ± √(b² - ৪ac)] / ২a।",
          "নিরূপক (D) = b² - ৪ac বীজের প্রকৃতি নির্ধারণ করে।",
          "D > ০ হলে বীজদ্বয় বাস্তব ও অসমান; D = ০ হলে বাস্তব ও সমান; D < ০ হলে কাল্পনিক।"
        ]
      },
      {
        id: "simple-interest",
        chapterNameEn: "Simple Interest (Ch 2)",
        chapterNameBn: "সরল সুদকষা (অধ্যায় ২)",
        summaryEn: "Calculation of simple interest, principal, rate of interest, and time period with practical problems.",
        summaryBn: "সরল সুদ, আসল, সুদের হার এবং সময়কাল গণনা এবং বাস্তব সমস্যার সমাধান।",
        keyPointsEn: [
          "Simple Interest Formula: I = (P * R * T) / 100.",
          "Total amount (A) = Principal (P) + Interest (I).",
          "The interest remains the same for every year if the principal does not change."
        ],
        keyPointsBn: [
          "সরল সুদের সূত্র: I = (P * R * T) / ১০০।",
          "সুদ-আসল (A) = আসল (P) + মোট সুদ (I)।",
          "আসল অপরিবর্তিত থাকলে প্রতি বছরের সুদের পরিমাণ সমান থাকে।"
        ]
      },
      {
        id: "theorems-circle-10",
        chapterNameEn: "Theorems Related to Circle (Ch 3)",
        chapterNameBn: "বৃত্ত সম্পর্কিত উপপাদ্য (অধ্যায় ৩)",
        summaryEn: "Theorems regarding chords of circles, perpendicular from the centre to a chord, and properties of equal chords.",
        summaryBn: "বৃত্তের জ্যা সংক্রান্ত উপপাদ্য, কেন্দ্র থেকে জ্যা-এর ওপর অঙ্কিত লম্ব এবং সমান জ্যা-এর বৈশিষ্ট্যসমূহ।",
        keyPointsEn: [
          "A line drawn from the centre to bisect a chord (not a diameter) is perpendicular to the chord.",
          "Equal chords of a circle are equidistant from the centre.",
          "The perpendicular from the centre of a circle to a chord bisects the chord."
        ],
        keyPointsBn: [
          "বৃত্তের কেন্দ্র থেকে ব্যাস নয় এমন কোনো জ্যা-কে সমদ্বিখণ্ডিত করার জন্য অঙ্কিত সরলরেখা জ্যা-এর ওপর লম্ব হয়।",
          "বৃত্তের সমান সমান জ্যা কেন্দ্র থেকে সমদূরবর্তী।",
          "বৃত্তের কেন্দ্র থেকে জ্যা-এর ওপর অঙ্কিত লম্ব জ্যাটিকে সমদ্বিখণ্ডিত করে।"
        ]
      },
      {
        id: "cuboid-10",
        chapterNameEn: "Rectangular Parallelopiped or Cuboid (Ch 4)",
        chapterNameBn: "আয়তঘন (অধ্যায় ৪)",
        summaryEn: "Mensuration of rectangular parallelopiped or cuboid, total surface area, volume, and diagonal length.",
        summaryBn: "আয়তঘন বা সমকোণী চৌপলের সমগ্রতলের ক্ষেত্রফল, আয়তন এবং কর্ণের দৈর্ঘ্য নির্ণয় সংক্রান্ত আলোচনা।",
        keyPointsEn: [
          "Total Surface Area of Cuboid = 2(ab + bc + ca) square units (where a, b, c are length, width, height).",
          "Volume of Cuboid = Length × Width × Height = abc cubic units.",
          "Diagonal of Cuboid = √(a² + b² + c²) units."
        ],
        keyPointsBn: [
          "আয়তঘনের সমগ্রতলের ক্ষেত্রফল = ২(ab + bc + ca) বর্গ একক (যেখানে a, b, c হল দৈর্ঘ্য, প্রস্থ ও উচ্চতা)।",
          "আয়তঘনের আয়তন = দৈর্ঘ্য × প্রস্থ × উচ্চতা = abc ঘন একক।",
          "আয়তঘনের কর্ণের দৈর্ঘ্য = √(a² + b² + c²) একক।"
        ]
      },
      {
        id: "ratio-proportion-10",
        chapterNameEn: "Ratio and Proportion (Ch 5)",
        chapterNameBn: "অনুপাত ও সমানুপাত (অধ্যায় ৫)",
        summaryEn: "Concepts of ratio and proportion, continued proportion, and theorems like Componendo & Dividendo.",
        summaryBn: "অনুপাত ও সমানুপাতের ধারণা, ক্রমিক সমানুপাত এবং যোগ-ভাগ প্রক্রিয়ার গাণিতিক প্রয়োগ।",
        keyPointsEn: [
          "If a, b, c, d are in proportion, then a/b = c/d which implies ad = bc.",
          "If a, b, c are in continued proportion, then b² = ac, where b is the mean proportional.",
          "Componendo and Dividendo: If a/b = c/d, then (a + b)/(a - b) = (c + d)/(c - d)."
        ],
        keyPointsBn: [
          "যদি a, b, c, d সমানুপাতে থাকে, তবে a/b = c/d অর্থাৎ ad = bc।",
          "যদি a, b, c ক্রমিক সমানুপাতে থাকে, তবে b² = ac, যেখানে b হল মধ্যসমানুপাতী।",
          "যোগ-ভাগ প্রক্রিয়া: যদি a/b = c/d হয়, তবে (a + b)/(a - b) = (c + d)/(c - d)।"
        ]
      },
      {
        id: "compound-interest",
        chapterNameEn: "Compound Interest and Uniform Growth/Decay (Ch 6)",
        chapterNameBn: "চক্রবৃদ্ধি সুদ ও সমহার বৃদ্ধি বা হ্রাস (অধ্যায় ৬)",
        summaryEn: "Calculation of compound interest with annual, semi-annual, or quarterly intervals, and appreciation or depreciation of assets.",
        summaryBn: "বার্ষিক, ষান্মাসিক বা ত্রৈমাসিক পর্বে চক্রবৃদ্ধি সুদ এবং জনসংখ্যা বা যন্ত্রপাতির সমহার বৃদ্ধি ও হ্রাস নির্ণয়।",
        keyPointsEn: [
          "Amount under compound interest: A = P(1 + r/100)^n.",
          "Compound Interest (CI) = Amount (A) - Principal (P).",
          "Uniform Rate of Decrease (Depreciation): V = P(1 - r/100)^n."
        ],
        keyPointsBn: [
          "চক্রবৃদ্ধি সুদে সমূল চক্রবৃদ্ধি: A = P(১ + r/১০০)^n।",
          "চক্রবৃদ্ধি সুদ (CI) = সমূল চক্রবৃদ্ধি (A) - আসল (P)।",
          "সমহার হ্রাস বা অবচয়-এর ক্ষেত্রে বর্তমান মূল্য বা জনসংখ্যা: V = P(১ - r/১০০)^n।"
        ]
      },
      {
        id: "angles-circle",
        chapterNameEn: "Theorems Related to Angles in a Circle (Ch 7)",
        chapterNameBn: "বৃত্তস্থ কোণ সম্পর্কিত উপপাদ্য (অধ্যায় ৭)",
        summaryEn: "Establishing relationships between angles at the centre and circumference subtended by the same arc.",
        summaryBn: "একই বৃত্তচাপের ওপর অবস্থিত কেন্দ্রস্থ কোণ এবং বৃত্তস্থ কোণের মধ্যকার সম্পর্ক ও উপপাদ্যসমূহ।",
        keyPointsEn: [
          "The angle subtended by an arc at the centre is double the angle subtended at the remaining circumference.",
          "Angles in the same segment of a circle are equal.",
          "Angle in a semi-circle is a right angle (90°)."
        ],
        keyPointsBn: [
          "একই বৃত্তচাপের দ্বারা গঠিত কেন্দ্রস্থ কোণ বৃত্তস্থ কোণের দ্বিগুণ হয়।",
          "একই বৃত্তাংশস্থ সকল কোণের মান সমান হয়।",
          "অর্ধবৃত্তস্থ কোণ সর্বদা সমকোণ (৯০°) হয়।"
        ]
      },
      {
        id: "cylinder-10",
        chapterNameEn: "Right Circular Cylinder (Ch 8)",
        chapterNameBn: "লম্ব বৃত্তাকার চোঙ (অধ্যায় ৮)",
        summaryEn: "Formulas and calculations for curved surface, total surface, and volume of right circular cylinders.",
        summaryBn: "লম্ব বৃত্তাকার চোঙের পার্শ্বতলের ক্ষেত্রফল, সমগ্রতলের ক্ষেত্রফল এবং আয়তন পরিমাপের পদ্ধতি।",
        keyPointsEn: [
          "Curved Surface Area = 2πrh square units.",
          "Total Surface Area = 2πr(r + h) square units.",
          "Volume of Right Circular Cylinder = πr²h cubic units."
        ],
        keyPointsBn: [
          "পার্শ্বতলের বা বক্রতলের ক্ষেত্রফল = ২πrh বর্গ একক।",
          "সমগ্রতলের ক্ষেত্রফল = ২πr(r + h) বর্গ একক।",
          "লম্ব বৃত্তাকার চোঙের আয়তন = πr²h ঘন একক।"
        ]
      },
      {
        id: "quadratic-surd",
        chapterNameEn: "Quadratic Surd (Ch 9)",
        chapterNameBn: "দ্বিঘাত করণী (অধ্যায় ৯)",
        summaryEn: "Properties of pure and mixed quadratic surds, operations (addition, subtraction, multiplication, division), and rationalization.",
        summaryBn: "শুদ্ধ ও মিশ্র দ্বিঘাত করণী, করণীর যোগ, বিয়োগ, গুণ ও ভাগ এবং হরের করণী নিরসন প্রণালী।",
        keyPointsEn: [
          "Rationalising Factor of (√a + √b) is (√a - √b).",
          "If x = a + √b is a root of a rational equation, then its conjugate a - √b is also a root.",
          "Surds can only be added or subtracted if they are similar surds."
        ],
        keyPointsBn: [
          "(√a + √b) এর করণী নিরসক উৎপাদক হল (√a - √b)।",
          "যদি x = a + √b একটি মূলদ সহগবিশিষ্ট সমীকরণের বীজ হয়, তবে এর অনুবন্ধী করণী a - √b-ও অপর একটি বীজ হবে।",
          "কেবলমাত্র সদৃশ করণীগুলির মধ্যেই যোগ ও বিয়োগ করা সম্ভব।"
        ]
      },
      {
        id: "cyclic-quadrilateral",
        chapterNameEn: "Theorems Related to Cyclic Quadrilateral (Ch 10)",
        chapterNameBn: "বৃত্তস্থ চতুর্ভুজ সংক্রান্ত উপপাদ্য (অধ্যায় ১০)",
        summaryEn: "Theorems proving properties of cyclic quadrilaterals and their angles.",
        summaryBn: "বৃত্তস্থ চতুর্ভুজের বিভিন্ন জ্যামিতিক ধর্ম এবং কোণগুলির পারস্পরিক সম্পর্ক সংক্রান্ত উপপাদ্য।",
        keyPointsEn: [
          "The opposite angles of a cyclic quadrilateral are supplementary (sum is 180°).",
          "If one side of a cyclic quadrilateral is produced, the exterior angle is equal to the interior opposite angle.",
          "Any rectangle or square is always a cyclic quadrilateral."
        ],
        keyPointsBn: [
          "বৃত্তস্থ চতুর্ভুজের বিপরীত কোণগুলি পরস্পর সম্পূরক (সমষ্টি ১৮০ ডিগ্রি) হয়।",
          "বৃত্তস্থ চতুর্ভুজের একটি বাহুকে বর্ধিত করলে উৎপন্ন বহিঃস্থ কোণটি বিপরীত অন্তঃস্থ কোণের সমান হয়।",
          "যেকোনো আয়তক্ষেত্র বা বর্গক্ষেত্র সর্বদা একটি বৃত্তস্থ চতুর্ভুজ।"
        ]
      },
      {
        id: "construction-circum-in",
        chapterNameEn: "Construction: Circumcircle and Incircle (Ch 11)",
        chapterNameBn: "সম্পাদ্য: ত্রিভুজের পরিবৃত্ত ও অন্তর্বৃত্ত অঙ্কন (অধ্যায় ১১)",
        summaryEn: "Practical steps to construct the circumcircle and incircle of various types of triangles using compass and ruler.",
        summaryBn: "রুলার ও কম্পাসের সাহায্যে বিভিন্ন ত্রিভুজের পরিবৃত্ত এবং অন্তর্বৃত্ত অঙ্কনের জ্যামিতিক ধাপসমূহ।",
        keyPointsEn: [
          "To construct a Circumcircle: Find the intersection of perpendicular bisectors of any two sides (Circumcentre).",
          "To construct an Incircle: Find the intersection of angle bisectors of any two angles (Incentre).",
          "The radius of the circumcircle is the distance from the circumcentre to any vertex."
        ],
        keyPointsBn: [
          "পরিবৃত্ত অঙ্কনের নিয়ম: যেকোনো দুটি বাহুর লম্ব সমদ্বিখণ্ডকের ছেদবিন্দু (পরিকেন্দ্র) নির্ণয় করতে হয়।",
          "অন্তর্বৃত্ত অঙ্কনের নিয়ম: যেকোনো দুটি কোণের অন্তসমদ্বিখণ্ডকের ছেদবিন্দু (অন্তকেন্দ্র) নির্ণয় করতে হয়।",
          "পরিকেন্দ্র থেকে ত্রিভুজের যেকোনো শীর্ষবিন্দুর দূরত্বই হল পরিবৃত্তের ব্যাসার্ধ।"
        ]
      },
      {
        id: "sphere-10",
        chapterNameEn: "Sphere (Ch 12)",
        chapterNameBn: "গোলক (অধ্যায় ১২)",
        summaryEn: "Formulas for surface area and volume of solid/hollow spheres and hemispheres.",
        summaryBn: "নিরেট ও ফাঁপা গোলক এবং অর্ধগোলকের পৃষ্ঠতলের ক্ষেত্রফল এবং আয়তন নির্ণয়ের সূত্রাবলী।",
        keyPointsEn: [
          "Surface Area of a Sphere = 4πr² square units.",
          "Volume of a Sphere = (4/3)πr³ cubic units.",
          "Total Surface Area of a Solid Hemisphere = 3πr² square units."
        ],
        keyPointsBn: [
          "গোলকের সমগ্রতলের ক্ষেত্রফল = ৪πr² বর্গ একক।",
          "গোলকের আয়তন = (৪/৩)πr³ ঘন একক।",
          "নিরেট অর্ধগোলকের সমগ্রতলের ক্ষেত্রফল = ৩πr² বর্গ একক।"
        ]
      },
      {
        id: "variation-10",
        chapterNameEn: "Variation (Ch 13)",
        chapterNameBn: "ভেদ (অধ্যায় ১৩)",
        summaryEn: "Direct variation, inverse variation, joint variation, and variation constants with applications.",
        summaryBn: "সরল ভেদ, ব্যস্ত ভেদ এবং যৌগিক ভেদের নিয়মাবলী এবং ভেদ ধ্রুবকের সাহায্যে গাণিতিক সমস্যার সমাধান।",
        keyPointsEn: [
          "Direct variation: x ∝ y implies x = ky (where k is a non-zero variation constant).",
          "Inverse variation: x ∝ 1/y implies xy = k.",
          "Theorem of Joint Variation: If x ∝ y when z is constant, and x ∝ z when y is constant, then x ∝ yz when both vary."
        ],
        keyPointsBn: [
          "সরল ভেদ: x ∝ y অর্থাৎ x = ky (যেখানে k হল অশূন্য ভেদ ধ্রুবক)।",
          "ব্যস্ত ভেদ: x ∝ ১/y অর্থাৎ xy = k।",
          "যৌগিক ভেদের উপপাদ্য: x ∝ y (যখন z ধ্রুবক) এবং x ∝ z (যখন y ধ্রুবক) হলে, x ∝ yz হবে যখন উভয়ই পরিবর্তিত হয়।"
        ]
      },
      {
        id: "partnership-business",
        chapterNameEn: "Partnership Business (Ch 14)",
        chapterNameBn: "অংশীদারি কারবার (অধ্যায় ১৪)",
        summaryEn: "Simple and compound partnership business, division of profit based on investment ratios and time periods.",
        summaryBn: "সরল ও মিশ্র অংশীদারি কারবার এবং মূলধন ও সময়ের অনুপাত অনুযায়ী লাভ-ক্ষতি বণ্টনের নিয়ম।",
        keyPointsEn: [
          "In simple partnership, profits are divided strictly in the ratio of the invested capitals.",
          "In compound partnership, capital is multiplied by the respective time periods to find equivalent monthly investment ratio.",
          "Equivalent Capital for 1 month = Capital × Investment duration in months."
        ],
        keyPointsBn: [
          "সরল অংশীদারি কারবারে অংশীদারদের লাভ বা ক্ষতি তাদের মূলধনের অনুপাতে বণ্টিত হয়।",
          "মিশ্র অংশীদারি কারবারে মূলধন এবং তা নিয়োজিত থাকার সময়ের গুণফলের অনুপাতে লভ্যাংশ বণ্টিত হয়।",
          "১ মাসের সমতুল্য মূলধন = অংশীদারের মূলধন × মূলধন নিয়োজিত থাকার মাস।"
        ]
      },
      {
        id: "tangent-circle",
        chapterNameEn: "Theorems Related to Tangent to a Circle (Ch 15)",
        chapterNameBn: "বৃত্তের স্পর্শক সংক্রান্ত উপপাদ্য (অধ্যায় ১৫)",
        summaryEn: "Theorems concerning the radius and tangent at the point of contact, and tangents from an external point.",
        summaryBn: "বৃত্তের স্পর্শবিন্দুতে স্পর্শক ও ব্যাসার্ধের পারস্পরিক সম্পর্ক এবং বহিঃস্থ বিন্দু থেকে অঙ্কিত স্পর্শকের ধর্মাবলী।",
        keyPointsEn: [
          "The tangent at any point of a circle is perpendicular to the radius through the point of contact.",
          "From an external point, only two tangents can be drawn to a circle, and they are equal in length.",
          "Tangents drawn from an external point subtend equal angles at the centre."
        ],
        keyPointsBn: [
          "বৃত্তের যেকোনো বিন্দুতে স্পর্শক এবং স্পর্শবিন্দুগামী ব্যাসার্ধ পরস্পর লম্ব হয়।",
          "বৃত্তের বহিঃস্থ কোনো বিন্দু থেকে কেবল দুটি স্পর্শক অঙ্কন করা সম্ভব এবং স্পর্শক দুটির দৈর্ঘ্য সমান হয়।",
          "বহিঃস্থ বিন্দু থেকে অঙ্কিত স্পর্শক দুটি কেন্দ্রের সাথে সমান কোণ উৎপন্ন করে।"
        ]
      },
      {
        id: "cone-10",
        chapterNameEn: "Right Circular Cone (Ch 16)",
        chapterNameBn: "লম্ব বৃত্তাকার শঙ্কু (অধ্যায় ১৬)",
        summaryEn: "Formulas for slant height, curved surface, total surface, and volume of right circular cones.",
        summaryBn: "লম্ব বৃত্তাকার শঙ্কুর তির্যক উচ্চতা, পার্শ্বতলের ক্ষেত্রফল, সমগ্রতলের ক্ষেত্রফল এবং আয়তন নির্ণয়ের সূত্রাবলী।",
        keyPointsEn: [
          "Slant height (l) = √(r² + h²) units (where r is radius, h is height).",
          "Curved Surface Area = πrl square units.",
          "Volume of Cone = (1/3)πr²h cubic units."
        ],
        keyPointsBn: [
          "তির্যক উচ্চতা (l) = √(r² + h²) একক (যেখানে r ব্যাসার্ধ, h উচ্চতা)।",
          "পার্শ্বতলের বা বক্রতলের ক্ষেত্রফল = πrl বর্গ একক।",
          "শঙ্কুর আয়তন = (১/৩)πr²h ঘন একক।"
        ]
      },
      {
        id: "construction-tangent",
        chapterNameEn: "Construction: Tangent to a Circle (Ch 17)",
        chapterNameBn: "সম্পাদ্য: বৃত্তের স্পর্শক অঙ্কন (অধ্যায় ১৭)",
        summaryEn: "Geometrical construction of tangents to a circle from a point on the circumference or from an external point.",
        summaryBn: "বৃত্তের ওপরিস্থিত কোনো বিন্দুতে অথবা বৃত্তের বহিঃস্থ কোনো বিন্দু থেকে স্পর্শক অঙ্কন করার পদ্ধতি।",
        keyPointsEn: [
          "To draw a tangent at a point on the circle, construct a perpendicular (90° angle) to the radius at that point.",
          "For an external point P, join P to the centre O, find midpoint M, draw a circle with diameter OP, and join P to the intersection points."
        ],
        keyPointsBn: [
          "বৃত্তের পরিধিস্থ কোনো বিন্দুতে স্পর্শক অঙ্কনের জন্য ওই বিন্দুগামী ব্যাসার্ধের ওপর একটি লম্ব (৯০° কোণ) আঁকতে হয়।",
          "বহিঃস্থ বিন্দু P থেকে স্পর্শক আঁকতে হলে OP রেখাংশকে সমদ্বিখণ্ডিত করে OP ব্যাসযুক্ত বৃত্ত অঙ্কন করে ছেদবিন্দুর সাথে P যোগ করতে হয়।"
        ]
      },
      {
        id: "similarity-10",
        chapterNameEn: "Similarity (Ch 18)",
        chapterNameBn: "সদৃশতা (অধ্যায় ১৮)",
        summaryEn: "Concept of similar triangles, Thales theorem (Basic Proportionality Theorem), and properties of similar polygons.",
        summaryBn: "সদৃশ ত্রিভুজের ধারণা, থ্যালাসের উপপাদ্য (মৌলিক সমানুপাতিকতা সূত্র) এবং জ্যামিতিক সদৃশতার নীতিসমূহ।",
        keyPointsEn: [
          "Thales Theorem: A line drawn parallel to one side of a triangle divides the other two sides in the same ratio.",
          "Two triangles are similar if their corresponding angles are equal and corresponding sides are in the same ratio (AAA, SAS, SSS similarity).",
          "The ratio of the areas of two similar triangles is equal to the ratio of the squares of their corresponding sides."
        ],
        keyPointsBn: [
          "থ্যালাসের উপপাদ্য: ত্রিভুজের কোনো বাহুর সমান্তরাল সরলরেখা অপর দুটি বাহুকে সমান অনুপাতে বিভক্ত করে।",
          "দুটি ত্রিভুজ সদৃশ হবে যদি তাদের অনুরূপ কোণগুলি সমান হয় এবং অনুরূপ বাহুগুলি সমানুপাতে থাকে।",
          "দুটি সদৃশ ত্রিভুজের ক্ষেত্রফলের অনুপাত তাদের অনুরূপ বাহুগুলির বর্গের অনুপাতের সমান।"
        ]
      },
      {
        id: "solid-problems",
        chapterNameEn: "Real Problems Regarding Different Solid Objects (Ch 19)",
        chapterNameBn: "বিভিন্ন ঘনবস্তু সংক্রান্ত বাস্তব সমস্যা (অধ্যায় ১৯)",
        summaryEn: "Solving composite word problems involving melting, casting, or combining different solid shapes (cuboid, cylinder, cone, sphere).",
        summaryBn: "বিভিন্ন আকারের ঘনবস্তু গলানো, নতুন আকার দেওয়া অথবা সম্মিলিত ঘনবস্তুর ক্ষেত্রফল ও আয়তন নির্ণয়ের বাস্তব গাণিতিক সমস্যা।",
        keyPointsEn: [
          "When one solid is melted and recast into another solid, the total volume remains constant.",
          "Total surface area of combined shapes requires careful summation of only the exposed surfaces.",
          "Volume of material in a hollow pipe = Outer Volume - Inner Volume."
        ],
        keyPointsBn: [
          "একটি ঘনবস্তু গলিয়ে অন্য ঘনবস্তুতে রূপান্তর করা হলে উভয়ের মোট আয়তন সর্বদা সমান থাকে।",
          "সম্মিলিত ঘনবস্তুর সমগ্রতলের ক্ষেত্রফল নির্ণয়ে কেবল বাইরে উন্মুক্ত তলগুলির ক্ষেত্রফল যোগ করতে হয়।",
          "ফাঁপা পাইপের উপাদানের আয়তন = বহিরাগত আয়তন - অভ্যন্তরীণ আয়তন।"
        ]
      },
      {
        id: "trig-angle-measure",
        chapterNameEn: "Trigonometry: Measurement of Angle (Ch 20)",
        chapterNameBn: "ত্রিকোণমিতি: কোণ পরিমাপের ধারণা (অধ্যায় ২০)",
        summaryEn: "Introduction to trigonometric angles, sexagesimal system (degree, minute, second) and circular system (radian).",
        summaryBn: "ত্রিকোণমিতিক কোণ, ষাটমূলক পদ্ধতি (ডিগ্রি, মিনিট, সেকেন্ড) এবং বৃত্তীয় পদ্ধতিতে (রেডিয়ান) কোণ পরিমাপের নিয়মাবলী।",
        keyPointsEn: [
          "1 Radian (1c) is a constant angle. Relation: π radians = 180°.",
          "Sexagesimal units: 1 degree (1°) = 60 minutes (60'), 1 minute = 60 seconds (60\").",
          "Arc length s = rθ (where θ is in radians)."
        ],
        keyPointsBn: [
          "১ রেডিয়ান একটি ধ্রুবক কোণ। সম্পর্ক: π রেডিয়ান = ১৮০ ডিগ্রি।",
          "ষাটমূলক একক: ১ ডিগ্রি = ৬০ মিনিট, ১ মিনিট = ৬০ সেকেন্ড।",
          "বৃত্তচাপের দৈর্ঘ্য s = rθ (যেখানে θ কোণটি রেডিয়ানে প্রকাশিত)।"
        ]
      },
      {
        id: "construction-mean-prop",
        chapterNameEn: "Construction: Mean Proportional (Ch 21)",
        chapterNameBn: "সম্পাদ্য: মধ্যসমানুপাতী নির্ণয় (অধ্যায় ২১)",
        summaryEn: "Constructing the mean proportional of two line segments geometrically, and finding square roots of numbers like √12 or √15.",
        summaryBn: "জ্যামিতিক পদ্ধতিতে দুটি সরলরেখাংশের মধ্যসমানুপাতী এবং বিভিন্ন সংখ্যার (যেমন √১২ বা √১৫) বর্গমূলের মান নির্ণয়।",
        keyPointsEn: [
          "Draw a line segment equal to the sum of the two given lengths, find its midpoint to draw a semicircle.",
          "Erect a perpendicular at the junction of the two lengths to meet the semicircle; this perpendicular represents the mean proportional.",
          "Useful to construct a square equal in area to a given rectangle."
        ],
        keyPointsBn: [
          "প্রদত্ত দুটি দৈর্ঘ্যের যোগফলের সমান রেখাংশ নিয়ে তাকে ব্যাস করে একটি অর্ধবৃত্ত অঙ্কন করতে হয়।",
          "দৈর্ঘ্য দুটির সংযোগস্থলে অঙ্কিত লম্বটি অর্ধবৃত্তকে যেখানে ছেদ করে, সেই লম্বের দৈর্ঘ্যই হল মধ্যসমানুপাতী।",
          "এটি আয়তক্ষেত্রের ক্ষেত্রফলের সমান বর্গক্ষেত্র অঙ্কন করার মূল ভিত্তি।"
        ]
      },
      {
        id: "pythagoras-theorem",
        chapterNameEn: "Pythagoras Theorem (Ch 22)",
        chapterNameBn: "পিথাগোরাসের উপপাদ্য (অধ্যায় ২২)",
        summaryEn: "Statement and geometric proof of Pythagoras Theorem and its converse, with applications in right-angled triangles.",
        summaryBn: "পিথাগোরাসের উপপাদ্য ও তার বিপরীত উপপাদ্যের বিবৃতি, জ্যামিতিক প্রমাণ এবং সমকোণী ত্রিভুজে এর প্রয়োগ।",
        keyPointsEn: [
          "In a right-angled triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides (c² = a² + b²).",
          "Converse: If the square of one side of a triangle is equal to the sum of the squares of the other two sides, the angle opposite to the first side is a right angle.",
          "Pythagorean Triplets (e.g., 3,4,5 or 5,12,13) satisfy the relation."
        ],
        keyPointsBn: [
          "যেকোনো সমকোণী ত্রিভুজের অতিভুজের ওপর অঙ্কিত বর্গক্ষেত্রের ক্ষেত্রফল অপর দুই বাহুর ওপর অঙ্কিত বর্গক্ষেত্রদ্বয়ের ক্ষেত্রফলের সমষ্টির সমান।",
          "বিপরীত উপপাদ্য: কোনো ত্রিভুজের একটি বাহুর ওপর অঙ্কিত বর্গক্ষেত্রের ক্ষেত্রফল অপর দুই বাহুর ওপর অঙ্কিত বর্গক্ষেত্রের সমষ্টির সমান হলে, প্রথম বাহুর বিপরীত কোণটি সমকোণ হবে।",
          "পিথাগোরাসীয় ত্রয়ী (যেমন ৩, ৪, ৫ অথবা ৫, ১২, ১৩) এই উপপাদ্য সিদ্ধ করে।"
        ]
      },
      {
        id: "trig-ratios-identities",
        chapterNameEn: "Trigonometric Ratios and Identities (Ch 23)",
        chapterNameBn: "ত্রিকোণমিতিক অনুপাত এবং ত্রিকোণমিতিক অভেদাবলী (অধ্যায় ২৩)",
        summaryEn: "Defining sine, cosine, tangent, cotangent, secant, cosecant of acute angles, and proving basic identities.",
        summaryBn: "সূক্ষ্মকোণের সাপেক্ষে ত্রিকোণমিতিক অনুপাতসমূহের সংজ্ঞা এবং মৌলিক অভেদাবলীর প্রমাণ ও প্রয়োগ।",
        keyPointsEn: [
          "Fundamental identities: sin²θ + cos²θ = 1.",
          "sec²θ - tan²θ = 1.",
          "cosec²θ - cot²θ = 1."
        ],
        keyPointsBn: [
          "মৌলিক অভেদসমূহ: sin²θ + cos²θ = ১।",
          "sec²θ - tan²θ = ১।",
          "cosec²θ - cot²θ = ১।"
        ]
      },
      {
        id: "complementary-angles",
        chapterNameEn: "Trigonometric Ratios of Complementary Angles (Ch 24)",
        chapterNameBn: "পূরক কোণের ত্রিকোণমিতিক অনুপাত (অধ্যায় ২৪)",
        summaryEn: "Understanding complementary angles (sum = 90°) and establishing relationships between their trigonometric ratios.",
        summaryBn: "পূরক কোণের (সমষ্টি ৯০°) ধারণা এবং তাদের ত্রিকোণমিতিক অনুপাতগুলির মধ্যকার সম্পর্ক আলোচনা।",
        keyPointsEn: [
          "sin(90° - θ) = cos θ; cos(90° - θ) = sin θ.",
          "tan(90° - θ) = cot θ; cot(90° - θ) = tan θ.",
          "sec(90° - θ) = cosec θ; cosec(90° - θ) = sec θ."
        ],
        keyPointsBn: [
          "sin(৯০° - θ) = cos θ; cos(৯০° - θ) = sin θ।",
          "tan(৯০° - θ) = cot θ; cot(৯০° - θ) = tan θ।",
          "sec(৯০° - θ) = cosec θ; cosec(৯০° - θ) = sec θ।"
        ]
      },
      {
        id: "height-distance-trig",
        chapterNameEn: "Application of Trigonometric Ratios: Height & Distance (Ch 25)",
        chapterNameBn: "উচ্চতা ও দূরত্ব (অধ্যায় ২৫)",
        summaryEn: "Real-world application of trigonometry to find height of towers, trees, or width of rivers using angle of elevation and angle of depression.",
        summaryBn: "উন্নতি কোণ এবং অবনতি কোণ ব্যবহারের মাধ্যমে পাহাড়, স্তম্ভের উচ্চতা বা নদীর প্রস্থ নির্ণয়ের ব্যবহারিক অংক।",
        keyPointsEn: [
          "Angle of Elevation: The angle formed by the line of sight with the horizontal when looking up at an object.",
          "Angle of Depression: The angle formed by the line of sight with the horizontal when looking down at an object.",
          "Tan ratio (Opposite/Adjacent) is most frequently used in solving height and distance problems."
        ],
        keyPointsBn: [
          "উন্নতি কোণ: দর্শক যখন অনুভূমিক রেখার ওপরের কোনো বস্তুর দিকে তাকায়, তখন দৃষ্টিরেখা অনুভূমিক রেখার সাথে যে কোণ উৎপন্ন করে।",
          "অবনতি কোণ: দর্শক যখন অনুভূমিক রেখার নিচের কোনো বস্তুর দিকে তাকায়, তখন দৃষ্টিরেখা অনুভূমিক রেখার সাথে যে কোণ উৎপন্ন করে।",
          "উচ্চতা ও দূরত্বের অধিকাংশ অংক সমাধানে Tan অনুপাত (লম্ব/ভূমি) সবচেয়ে বেশি ব্যবহৃত হয়।"
        ]
      },
      {
        id: "statistics-10",
        chapterNameEn: "Statistics: Mean, Median, Ogive, Mode (Ch 26)",
        chapterNameBn: "রাশিবিজ্ঞান: গড়, মধ্যমা, ওজাইভ, সংখ্যাগুরুমান (অধ্যায় ২৬)",
        summaryEn: "Comprehensive calculation of central tendency: Mean (direct, assumed mean, step-deviation), Median, Mode, and graphical Ogive representation.",
        summaryBn: "কেন্দ্রীয় প্রবণতার পরিমাপসমূহ: যৌগিক গড় (প্রত্যক্ষ, কল্পিত গড় ও ক্রমবিচ্যুতি পদ্ধতি), মধ্যমা, সংখ্যাগুরুমান এবং ওজাইভ অঙ্কন।",
        keyPointsEn: [
          "Mean (Assumed Mean Method): x̄ = A + (Σf_i d_i / Σf_i).",
          "Median = l + [((N/2) - cf) / f] * h.",
          "Mode = l + [(f₁ - f₀) / (2f₁ - f₀ - f₂)] * h."
        ],
        keyPointsBn: [
          "যৌগিক গড় (কল্পিত গড় পদ্ধতি): x̄ = A + (Σf_i d_i / Σf_i)।",
          "মধ্যমা = l + [((N/২) - cf) / f] * h।",
          "সংখ্যাগুরুমান = l + [(f₁ - f₀) / (২f₁ - f₀ - f₂)] * h।"
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
        id: "concern-environment",
        chapterNameEn: "Concern about Our Environment (Ch 1)",
        chapterNameBn: "পরিবেশের জন্য ভাবনা (অধ্যায় ১)",
        summaryEn: "Layers of the atmosphere, greenhouse effect, global warming, ozone layer depletion, and non-conventional energy resources.",
        summaryBn: "বায়ুমণ্ডলের বিভিন্ন স্তর, গ্রিনহাউস প্রভাব, গ্লোবাল ওয়ার্মিং, ওজোন স্তর ধ্বংস এবং পরিবেশবান্ধব অচলিত শক্তির ব্যবহার।",
        keyPointsEn: [
          "Troposphere contains 75% of atmospheric mass and experiences all weather events.",
          "Ozone Layer in Stratosphere absorbs harmful UV rays from the sun.",
          "Methane hydrate is a crystalline solid cage of water containing methane, known as 'fire ice'."
        ],
        keyPointsBn: [
          "ট্রপোস্ফিয়ারে বায়ুমণ্ডলের প্রায় ৭৫% ভর থাকে এবং এখানেই জলবায়ুর সমস্ত পরিবর্তন ঘটে।",
          "স্ট্র্যাটোস্ফিয়ারের ওজোন স্তর ক্ষতিকারক অতিবেগুনি রশ্মি শোষণ করে জীবজগৎ রক্ষা করে।",
          "মিথেন হাইড্রেট হল এক ধরণের কঠিন বরফ-সদৃশ ক্লাস যা থেকে মিথেন গ্যাস পাওয়া যায়, একে 'ফায়ার আইস' বলে।"
        ]
      },
      {
        id: "behavior-gases",
        chapterNameEn: "Behavior of Gases (Ch 2)",
        chapterNameBn: "গ্যাসের আচরণ (অধ্যায় ২)",
        summaryEn: "Understanding gas laws: Boyle's Law, Charles's Law, Avogadro's Law, and the ideal gas equation (PV = nRT).",
        summaryBn: "গ্যাসের চাপ ও আয়তন সংক্রান্ত সূত্রসমূহ: বয়েলের সূত্র, চার্লসের সূত্র, অ্যাভোগাড্রোর সূত্র এবং আদর্শ গ্যাস সমীকরণ (PV = nRT)।",
        keyPointsEn: [
          "Boyle's Law: V ∝ 1/P at constant temperature.",
          "Charles's Law: V ∝ T at constant pressure. Absolute zero temperature is -273°C (0 K).",
          "Ideal Gas Equation: PV = nRT where R is the universal gas constant (8.314 J/mol K)."
        ],
        keyPointsBn: [
          "বয়েলের সূত্র: স্থির উষ্ণতায় গ্যাসের আয়তন তার চাপের সাথে ব্যস্তানুপাতে পরিবর্তিত হয় (V ∝ ১/P)।",
          "চার্লসের সূত্র: স্থির চাপে গ্যাসের আয়তন পরম উষ্ণতার সাথে সরলানুপাতে পরিবর্তিত হয় (V ∝ T)। পরম শূন্য উষ্ণতার মান -২৭৩°C।",
          "আদর্শ গ্যাস সমীকরণ: PV = nRT যেখানে R হল সর্বজনীন গ্যাস ধ্রুবক (৮.৩১৪ J/mol K)।"
        ]
      },
      {
        id: "chemical-calc-10",
        chapterNameEn: "Chemical Calculations (Ch 3)",
        chapterNameBn: "রাসায়নিক গণনা (অধ্যায় ৩)",
        summaryEn: "Stoichiometry, law of conservation of mass, calculations of weights of reactants and products in chemical equations.",
        summaryBn: "রাসায়নিক সমীকরণ ভিত্তিক গাণিতিক হিসাবনিকাশ, ভরের সংরক্ষণ সূত্র এবং রাসায়নিক বিক্রিয়া থেকে উৎপাদের পরিমাণ নির্ণয়।",
        keyPointsEn: [
          "Mass of Reactants is always equal to the Mass of Products.",
          "1 Mole of any gas at STP occupies 22.4 liters.",
          "Vapour Density (VD) = Molecular Weight (M) / 2."
        ],
        keyPointsBn: [
          "বিক্রিয়কগুলির মোট ভর বিক্রিয়াজাত পদার্থগুলির মোট ভরের সমান হয়।",
          "STP-তে যেকোনো গ্যাসের ১ মোল ২২.৪ লিটার আয়তন দখল করে।",
          "বাষ্প ঘনত্ব (VD) = আণবিক গুরুত্ব (M) / ২।"
        ]
      },
      {
        id: "thermal-phenomena",
        chapterNameEn: "Thermal Phenomena (Ch 4)",
        chapterNameBn: "তাপের ঘটনাসমূহ (অধ্যায় ৪)",
        summaryEn: "Expansion of solids, liquids, and gases, thermal conductivity, and coefficient of thermal expansion.",
        summaryBn: "কঠিন, তরল ও গ্যাসীয় পদার্থের তাপীয় প্রসারণ, তাপ পরিবাহিতা এবং তাপ পরিবাহিতাঙ্কের ব্যবহারিক গুরুত্ব।",
        keyPointsEn: [
          "Solids have three types of expansion: Linear (α), Superficial (β), and Volume (γ). Relation: α = β/2 = γ/3.",
          "Liquids have apparent and real expansion. Real expansion = Apparent expansion + Expansion of vessel.",
          "Thermal Conductivity (K) measures a material's ability to conduct heat."
        ],
        keyPointsBn: [
          "কঠিনের তিন প্রকার প্রসারণ গুণাঙ্ক রয়েছে: দৈর্ঘ্য (α), ক্ষেত্রফল (β) এবং আয়তন (γ)। এদের সম্পর্ক: α = β/২ = γ/৩।",
          "তরলের আপাত ও প্রকৃত প্রসারণ দেখা যায়। প্রকৃত প্রসারণ = আপাত প্রসারণ + পাত্রের প্রসারণ।",
          "তাপ পরিবাহিতাঙ্ক (K) পদার্থের তাপ পরিবহনের ক্ষমতা নির্দেশ করে।"
        ]
      },
      {
        id: "light-10",
        chapterNameEn: "Light (Ch 5)",
        chapterNameBn: "আলো (অধ্যায় ৫)",
        summaryEn: "Reflection on spherical mirrors, refraction through glass slab/prism, lenses, dispersion of light, and scattering.",
        summaryBn: "গোলীয় দর্পণে প্রতিফলন, কাচের স্ল্যাব ও প্রিজমে আলোর প্রতিসরণ, উত্তল ও অবতল লেন্স এবং আলোর বিচ্ছুরণ ও বিক্ষেপণ।",
        keyPointsEn: [
          "Snell's Law: sin i / sin r = constant (Refractive Index, μ).",
          "Convex lens acts as a converging lens; Concave lens acts as a diverging lens.",
          "Dispersion: White light splits into seven constituent colors (VIBGYOR) when passing through a prism."
        ],
        keyPointsBn: [
          "স্নেলের সূত্র: sin i / sin r = ধ্রুবক (প্রতিসরাঙ্ক, μ)।",
          "উত্তল লেন্স আলোর অভিসারী রশ্মিগুচ্ছে এবং অবতল লেন্স অপসারী রশ্মিগুচ্ছে পরিণত করে।",
          "বিচ্ছুরণ: প্রিজমের মধ্য দিয়ে যাওয়ার সময় সাদা আলো তার সাতটি উপাদান বর্ণে বিভক্ত হয়ে যায়।"
        ]
      },
      {
        id: "current-electricity-10",
        chapterNameEn: "Current Electricity (Ch 6)",
        chapterNameBn: "চলতড়িৎ (অধ্যায় ৬)",
        summaryEn: "Ohm's Law, electrical resistance, Joule's heating effect, electric power, electromagnetism, and household wiring.",
        summaryBn: "ওহমের সূত্র, তড়িৎ রোধ, তড়িৎপ্রবাহের তাপীয় ফল (জুলের সূত্র), তড়িৎ ক্ষমতা, তড়িৎ চুম্বকত্ব এবং গৃহস্থালির বৈদ্যুতিক বর্তনী।",
        keyPointsEn: [
          "Ohm's Law: V = IR (where R is Resistance).",
          "Joule's Law of Heating: H = I²Rt / J.",
          "Household electrical appliances are connected in parallel combination. Live, Neutral, and Earth wires are used."
        ],
        keyPointsBn: [
          "ওহমের সূত্র: V = IR (যেখানে R হল পরিবাহীর রোধ)।",
          "তড়িৎপ্রবাহের তাপীয় ফল সংক্রান্ত জুলের সূত্র: H = I²Rt / J।",
          "গৃহস্থালির সমস্ত বৈদ্যুতিক সরঞ্জাম সমান্তরাল সমবায়ে যুক্ত থাকে। লাইভ, নিউট্রাল ও আর্থিং তার ব্যবহার করা হয়।"
        ]
      },
      {
        id: "atomic-nucleus-10",
        chapterNameEn: "Atomic Nucleus (Ch 7)",
        chapterNameBn: "পরমাণুর নিউক্লিয়াস (অধ্যায় ৭)",
        summaryEn: "Radioactivity, α, β, and γ emissions, mass defect, nuclear fission, and nuclear fusion.",
        summaryBn: "তেজস্ক্রিয়তা, আলফা, বিটা ও গামা রশ্মি নির্গমন, ভর বিচ্যুতি, নিউক্লীয় বিভাজন এবং নিউক্লীয় সংযোজন।",
        keyPointsEn: [
          "Radioactivity is a spontaneous nuclear process unaffected by chemical or physical changes.",
          "Nuclear Fission splits a heavy nucleus into lighter ones (basis of Atom Bomb and Nuclear Reactors).",
          "Nuclear Fusion combines light nuclei to form a heavier one, releasing immense energy (powers the Sun)."
        ],
        keyPointsBn: [
          "তেজস্ক্রিয়তা একটি স্বতঃস্ফূর্ত নিউক্লীয় ঘটনা যা বাইরের কোনো ভৌত বা রাসায়নিক অবস্থার ওপর নির্ভর করে না।",
          "নিউক্লীয় বিভাজনে ভারী নিউক্লিয়াস ভেঙে হালকা নিউক্লিয়াস গঠিত হয় (পারমাণবিক বোমা ও চুল্লির ভিত্তি)।",
          "নিউক্লীয় সংযোজনে হালকা নিউক্লিয়াস যুক্ত হয়ে ভারী নিউক্লিয়াস গঠন করে (সূর্য ও নক্ষত্রের শক্তির উৎস)।"
        ]
      },
      {
        id: "matter-properties-chemical",
        chapterNameEn: "Physical & Chemical Properties of Matter (Ch 8)",
        chapterNameBn: "পদার্থের উপরিভাগ ও রাসায়নিক ধর্মাবলি (অধ্যায় ৮)",
        summaryEn: "Periodic Table, ionic and covalent bonding, electrolysis, inorganic chemistry (ammonia, hydrogen sulfide), metallurgy, and organic chemistry.",
        summaryBn: "পর্যায় সারণি, আয়নীয় ও সমযোজী বন্ধন, তড়িৎ বিশ্লেষণ, অজৈব রসায়ন (অ্যামোনিয়া, হাইড্রোজেন সালফাইড), ধাতুবিদ্যা এবং জৈব রসায়ন।",
        keyPointsEn: [
          "Mendeleev's Periodic Law was based on atomic mass; Modern Periodic Law is based on atomic number.",
          "Electrolysis is the decomposition of an electrolyte by passing direct current (DC) through it.",
          "Organic compounds contain carbon; functional groups determine their chemical reactivity."
        ],
        keyPointsBn: [
          "মেন্ডেলিভের পর্যায় সূত্রটি পারমাণবিক গুরুত্বের ওপর এবং আধুনিক পর্যায় সূত্রটি পরমাণু ক্রমাঙ্কের ওপর ভিত্তি করে প্রতিষ্ঠিত।",
          "তড়িৎ বিশ্লেষণ হল তড়িৎ প্রবাহের সাহায্যে গলিত বা দ্রবীভূত তড়িৎবিশ্লেষ্য পদার্থের রাসায়নিক বিয়োজন।",
          "জৈব যৌগসমূহ কার্বন দ্বারা গঠিত; কার্যকরী মূলক তাদের রাসায়নিক ধর্ম নির্ধারণ করে।"
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
        id: "control-coordination",
        chapterNameEn: "Control and Coordination in Living Organisms (Ch 1)",
        chapterNameBn: "জীবজগতে নিয়ন্ত্রণ ও সমন্বয় (অধ্যায় ১)",
        summaryEn: "Sensitivity and response in plants (tropisms, phytohormones) and animals (nervous system, endocrine hormones, reflex actions, eye).",
        summaryBn: "উদ্ভিদের সংবেদনশীলতা ও সাড়া প্রদান (চলন, হরমোন) এবং প্রাণীদের নিয়ন্ত্রণ ও সমন্বয় (স্নায়ুতন্ত্র, হরমোন, প্রতিবর্ত ক্রিয়া ও চোখ)।",
        keyPointsEn: [
          "Plant hormones (Auxin, Gibberellin, Cytokinin) regulate growth and tropic movements.",
          "Endocrine glands secrete hormones directly into the bloodstream (e.g., Insulin, Adrenaline, Thyroxine).",
          "The human brain regulates body balance (Cerebellum) and involuntary functions (Medulla Oblongata)."
        ],
        keyPointsBn: [
          "উদ্ভিদ হরমোন (অক্সিন, জিব্বেরেলিন, সাইটোকাইনিন) উদ্ভিদের বৃদ্ধি ও ট্রপিক চলন নিয়ন্ত্রণ করে।",
          "অনাল গ্রন্থি বা অন্তঃক্ষরা গ্রন্থি থেকে নিঃসৃত হরমোন সরাসরি রক্তে মেশে (যেমন- ইনসুলিন, অ্যাড্রেনালিন)।",
          "মানুষের লঘু মস্তিষ্ক দেহের ভারসাম্য নিয়ন্ত্রণ করে এবং সুষুম্নাশীর্ষক অনৈচ্ছিক কার্যসমূহ নিয়ন্ত্রণ করে।"
        ]
      },
      {
        id: "continuity-life",
        chapterNameEn: "Continuity of Life (Ch 2)",
        chapterNameBn: "জীবনের প্রবাহমানতা (অধ্যায় ২)",
        summaryEn: "Cell division, chromosomes, mitosis and meiosis, asexual and sexual reproduction in plants, alternation of generations.",
        summaryBn: "কোষ বিভাজন, ক্রোমোজোমের গঠন, মাইটোসিস ও মিয়োসিস বিভাজন, উদ্ভিদের অযৌন ও যৌন জনন এবং জনুঃক্রম।",
        keyPointsEn: [
          "Mitosis is equational division occurring in somatic cells; Meiosis is reductional division in germ cells.",
          "DNA replication occurs during the Interphase (S-phase) of the cell cycle.",
          "Meiosis leads to genetic variation due to crossing over in prophase I."
        ],
        keyPointsBn: [
          "মাইটোসিস হল সমবিভাজন যা দেহকোষে ঘটে; মিয়োসিস হল হ্রাসবিভাজন যা জনন মাতৃকোষে ঘটে।",
          "কোষ চক্রের ইন্টারফেজের S-দশায় DNA-এর স্বতন্ত্রীকরণ বা অনুলিপিকরণ সম্পন্ন হয়।",
          "মিয়োসিস বিভাজনে ক্রসিং ওভার ঘটার ফলে নতুন জিনগত বৈশিষ্ট্যের সৃষ্টি হয় যা বিবর্তনে সাহায্য করে।"
        ]
      },
      {
        id: "heredity-diseases-10",
        chapterNameEn: "Heredity and Some Common Genetic Diseases (Ch 3)",
        chapterNameBn: "বংশগতি এবং কয়েকটি সাধারণ জিনগত রোগ (অধ্যায় ৩)",
        summaryEn: "Mendelian inheritance, monohybrid and dihybrid crosses, sex determination in humans, and genetic disorders like Thalassemia, Hemophilia, and Color Blindness.",
        summaryBn: "মেন্ডেলের বংশগতির সূত্রসমূহ, একসংকর ও দ্বিসংকর জনন, লিঙ্গ নির্ধারণ এবং থ্যালাসেমিয়া, হিমোফিলিয়া ও বর্ণান্ধতা রোগ।",
        keyPointsEn: [
          "Mendel's laws: Law of Segregation and Law of Independent Assortment.",
          "Thalassemia is an autosomal recessive blood disorder leading to anemia.",
          "Hemophilia is an X-linked recessive bleeding disorder where blood fails to clot."
        ],
        keyPointsBn: [
          "মেন্ডেলের বংশগতির প্রধান দুটি সূত্র হল পৃথকীভবন সূত্র এবং স্বাধীন সঞ্চারণ সূত্র।",
          "থ্যালাসেমিয়া একটি অটোজোম-ঘটিত প্রচ্ছন্ন রক্তাল্পতার রোগ।",
          "হিমোফিলিয়া একটি এক্স-ক্রোমোজোম ঘটিত প্রচ্ছন্ন রোগ যার ফলে রক্ত তঞ্চিত হয় না ও রক্তপাত বন্ধ হয় না।"
        ]
      },
      {
        id: "evolution-adaptation-10",
        chapterNameEn: "Evolution and Adaptation (Ch 4)",
        chapterNameBn: "অভিব্যক্তি ও অভিযোজন (অধ্যায় ৪)",
        summaryEn: "Lamarckism vs Darwinism, homologous and analogous organs, and physiological/anatomical adaptations in cactus, Sundari tree, fish, pigeon, and chimpanzee.",
        summaryBn: "ল্যামার্কবাদ ও ডারউইনবাদ, সমসংস্থ ও সমবৃত্তীয় অঙ্গ এবং ক্যাকটাস, সুন্দরী গাছ, রুই মাছ, পায়রা ও শিম্পাঞ্জির অভিযোজনগত বৈশিষ্ট্য।",
        keyPointsEn: [
          "Lamarck proposed 'use and disuse' of organs; Darwin proposed 'natural selection' and 'survival of the fittest'.",
          "Homologous organs show common ancestry (different functions, same origin); Analogous organs show convergent evolution.",
          "Sundari tree has pneumatophores (breathing roots) to cope with saline, oxygen-deficient soil."
        ],
        keyPointsBn: [
          "ল্যামার্ক অর্জিত বৈশিষ্ট্যের বংশানুসরণের কথা বলেন; ডারউইন প্রাকৃতিক নির্বাচন ও যোগ্যতমের উদ্বর্তনের তত্ত্ব দেন।",
          "সমসংস্থ অঙ্গ পূর্বপুরুষের একতা প্রমাণ করে (ভিন্ন কাজ, একই উৎপত্তি); সমবৃত্তীয় অঙ্গ অভিসারী বিবর্তন প্রমাণ করে।",
          "লবণাক্ত ও অক্সিজেনহীন মাটিতে শ্বাস নেওয়ার জন্য সুন্দরী গাছে শ্বাসমূল বা নিউম্যাটোফোর থাকে।"
        ]
      },
      {
        id: "environment-conservation",
        chapterNameEn: "Environment, Resources, and Conservation (Ch 5)",
        chapterNameBn: "পরিবেশ, তার সম্পদ এবং তাদের সংরক্ষণ (অধ্যায় ৫)",
        summaryEn: "Nitrogen cycle, environmental pollution, biodiversity loss, endangered species of India, and conservation strategies (National Parks, Biosphere Reserves).",
        summaryBn: "নাইট্রোজেন চক্র, পরিবেশ দূষণ, জীববৈচিত্র্য হ্রাস, ভারতের বিপন্ন প্রজাতি এবং সংরক্ষণ ব্যবস্থা (অভয়ারণ্য, বায়োস্ফিয়ার রিজার্ভ)।",
        keyPointsEn: [
          "Nitrogen-fixing bacteria like Rhizobium convert atmospheric nitrogen into usable organic forms.",
          "Biomagnification is the increasing concentration of toxic substances (like DDT) in organisms at higher trophic levels.",
          "In-situ conservation keeps species in their natural habitat (e.g., Corbett National Park); Ex-situ conservation is outside (e.g., Zoo, Seed Bank)."
        ],
        keyPointsBn: [
          "রাইজোবিয়ামের মতো নাইট্রোজেন সংবন্ধনকারী ব্যাকটেরিয়া বায়ুর নাইট্রোজেনকে মাটিতে নাইট্রেটে রূপান্তর করে।",
          "জৈব বিবর্ধন বা বায়োম্যাগনিফিকেশন হল খাদ্যশৃঙ্খলের উচ্চ স্তরে ক্ষতিকর রাসায়নিকের (যেমন DDT) ঘনত্ব বৃদ্ধি পাওয়া।",
          "ইন-সিটু সংরক্ষণ হল প্রাকৃতিক বাসস্থানে প্রজাতি রক্ষা (যেমন জাতীয় উদ্যান); এক্স-সিটু সংরক্ষণ হল কৃত্রিম উপায়ে বাইরে রক্ষা (যেমন চিড়িয়াখানা)।"
        ]
      }
    ]
  },
  {
    id: "english",
    nameEn: "English (Bliss)",
    nameBn: "ইংরেজি",
    icon: "📚",
    chapters: [
      {
        id: "fathers-help",
        chapterNameEn: "Lesson 1: Father's Help",
        chapterNameBn: "Lesson 1: Father's Help",
        summaryEn: "A story by R. K. Narayan centering around Swami, a young boy who makes excuses to avoid school but is forced to go by his strict father.",
        summaryBn: "আর. কে. নারায়ণ রচিত গল্প যেখানে স্বামী নামের এক বালক স্কুল এড়ানোর অজুহাত দিলেও তার বাবার জেদের কারণে অবশেষে তাকে স্কুলে যেতে হয়।",
        keyPointsEn: [
          "Swami fabricates a story about his teacher Samuel being extremely violent to escape school.",
          "His father writes a letter of complaint to the headmaster and orders Swami to deliver it.",
          "Swami's conscience troubles him as he realizes Samuel is actually gentle and friendly."
        ],
        keyPointsBn: [
          "স্বামী স্কুল ফাঁকি দিতে তার শিক্ষক স্যামুয়েল ভীষণ রাগী ও মারকুটে বলে মিথ্যা গল্প বানায়।",
          "তার বাবা প্রধান শিক্ষককে দেওয়ার জন্য একটি অভিযোগপত্র লিখে স্বামীর হাতে দিয়ে তাকে স্কুলে পাঠায়।",
          "স্যামুয়েলের প্রতি অবিচার করার অনুশোচনায় স্বামীর বিবেক তাকে তাড়িত করে।"
        ]
      },
      {
        id: "fable",
        chapterNameEn: "Lesson 2: Fable",
        chapterNameBn: "Lesson 2: Fable",
        summaryEn: "A poem by Ralph Waldo Emerson depicting a conversation between a mountain and a squirrel, emphasizing that everyone has their unique importance.",
        summaryBn: "রালফ ওয়াল্ডো এমারসন রচিত কবিতা যেখানে একটি পর্বত ও কাঠবিড়ালির কথোপকথনের মাধ্যমে ব্যক্ত হয়েছে যে জগতে প্রতিটি জিনিসেরই নিজস্ব গুরুত্ব আছে।",
        keyPointsEn: [
          "The mountain mocks the squirrel calling it 'Little Prig'.",
          "The squirrel replies that although it is small, it is active, spry, and can crack nuts which the mountain cannot.",
          "Different talents exist; all are well and wisely put."
        ],
        keyPointsBn: [
          "পর্বত কাঠবিড়ালিকে উপহাস করে 'ক্ষুদ্র নীতিবাগীশ' বলে সম্বোধন করে।",
          "কাঠবিড়ালি উত্তর দেয় যে সে আকারে ছোট হলেও অনেক বেশি চটপটে এবং সে বাদাম ভাঙতে পারে যা পর্বত পারে না।",
          "জগতে সবার প্রতিভা আলাদা; বিধাতা সবাইকে সুনিপুণভাবে নিজস্ব দায়িত্ব দিয়েছেন।"
        ]
      },
      {
        id: "passing-bapu",
        chapterNameEn: "Lesson 3: The Passing Away of Bapu",
        chapterNameBn: "Lesson 3: The Passing Away of Bapu",
        summaryEn: "An extract from Nayantara Sehgal's memoir describing the shock, grief, and subsequent realization following Mahatma Gandhi's assassination.",
        summaryBn: "নয়নতারা সহগালের স্মৃতিকথা থেকে সংকলিত যেখানে মহাত্মা গান্ধীর প্রয়াণের পর মানুষের শোক এবং পরবর্তীতে তাঁর আদর্শকে এগিয়ে নিয়ে যাওয়ার দৃঢ় সংকল্পের কথা বলা হয়েছে।",
        keyPointsEn: [
          "The author receives the news of Gandhiji's death on January 30, 1948.",
          "The funeral procession is attended by thousands of weeping followers.",
          "The author realizes that even though Bapu has passed away, his values and India live on in the youth."
        ],
        keyPointsBn: [
          "লেখিকা ১৯৪৮ সালের ৩০শে জানুয়ারি গান্ধীজীর মৃত্যুর খবর পেয়ে স্তম্ভিত হয়ে যান।",
          "হাজার হাজার শোকার্ত মানুষ গান্ধীজীর শেষযাত্রায় অংশ নেয় ও তাঁর চিতাভস্ম গঙ্গায় বিসর্জন দেওয়া হয়।",
          "লেখিকা উপলব্ধি করেন যে বাপু মারা গেলেও তাঁর আদর্শ ভারতের ভবিষ্যৎ প্রজন্মের মধ্যে চিরকাল বেঁচে থাকবে।"
        ]
      },
      {
        id: "true-family",
        chapterNameEn: "Lesson 4: My Own True Family",
        chapterNameBn: "Lesson 4: My Own True Family",
        summaryEn: "A symbolic poem by Ted Hughes depicting a child's magical experience in an oakwood, conveying a strong message about environmental conservation.",
        summaryBn: "টেড হিউজ রচিত রূপক কবিতা যেখানে ওক বনে একটি শিশুর জাদুকরী অভিজ্ঞতার মধ্য দিয়ে প্রকৃতির সাথে মানুষের অবিচ্ছেদ্য সম্পর্কের কথা তুলে ধরা হয়েছে।",
        keyPointsEn: [
          "The child enters an oakwood looking for a stag and is captured by oak trees.",
          "The trees accuse humans of relentlessly chopping them down without any remorse.",
          "The child takes a solemn oath to plant two trees whenever one is cut down."
        ],
        keyPointsBn: [
          "একটি শিশু ওক বনে হরিণ খুঁজতে গিয়ে ওক গাছের আত্মাদের দ্বারা ঘেরাও হয়ে পড়ে।",
          "গাছেরা মানুষকে তাদের নির্বিচারে কেটে ফেলার জন্য এবং সেই বেদনায় মানুষের উদাসীনতার জন্য অভিযুক্ত করে।",
          "শিশুটিকে শপথ করতে হয় যে একটি ওক গাছ কাটা পড়লে সে দুটি নতুন ওক গাছ লাগাবে।"
        ]
      },
      {
        id: "runaway-kite",
        chapterNameEn: "Lesson 5: Our Runaway Kite",
        chapterNameBn: "Lesson 5: Our Runaway Kite",
        summaryEn: "A touching story by Lucy Maud Montgomery about family bonding, separation, and reconciliation brought about by a runaway kite.",
        summaryBn: "লুসি মড মন্টগোমারি রচিত একটি হৃদয়স্পর্শী গল্প যেখানে একটি হারিয়ে যাওয়া ঘুড়ির সুতো ধরে বিচ্ছিন্ন একটি পরিবার আবার এক হয়ে ওঠার কাহিনী বর্ণিত হয়েছে।",
        keyPointsEn: [
          "Claude and Philippa live isolated on Big Half Moon island with their father.",
          "They patch their torn red kite with an old letter containing names and addresses.",
          "The kite flies away, is found by their aunt Esther, leading to a happy family reunion."
        ],
        keyPointsBn: [
          "ক্লদ এবং ফিলিপা তাদের বাবার সাথে বিগ হাফ মুন দ্বীপে একাকী জীবনযাপন করত।",
          "তারা তাদের একটি ছেঁড়া লাল ঘুড়িকে একটি পুরোনো চিঠির কাগজ দিয়ে জোড়াতালি দেয়।",
          "ঘুড়িটি উড়ে চলে যায় এবং পিসি এস্থারের হাতে পড়ে, যা অবশেষে তাদের হারিয়ে যাওয়া পরিবারের পুনর্মিলন ঘটায়।"
        ]
      },
      {
        id: "sea-fever",
        chapterNameEn: "Lesson 6: Sea Fever",
        chapterNameBn: "Lesson 6: Sea Fever",
        summaryEn: "John Masefield's classic lyric poem capturing the speaker's intense longing to return to the sea and the adventurous life of a sailor.",
        summaryBn: "জন মেসফিল্ডের বিখ্যাত গীতিকবিতা যেখানে সমুদ্রের রোমাঞ্চকর জীবন ও মুক্ত প্রকৃতির প্রতি কবির তীব্র ব্যাকুলতা প্রকাশ পেয়েছে।",
        keyPointsEn: [
          "The poet feels an irresistible call of the running tide that cannot be denied.",
          "He desires a tall ship, a star to steer her by, and a windy day with white clouds flying.",
          "He longs for a sailor's companion, a merry yarn, and a quiet sleep when the voyage ends."
        ],
        keyPointsBn: [
          "কবি সমুদ্রে যাওয়ার জন্য এবং জোয়ারের ডাক শোনার জন্য এক অমোঘ আকর্ষণ অনুভব করছেন।",
          "তিনি একটি বড় জাহাজ, দিক নির্ণয়ের জন্য ধ্রুবতারা এবং বাতাসে সাদা মেঘ ভেসে বেড়ানোর মতো সুন্দর আবহাওয়া চান।",
          "তিনি সহযাত্রী নাবিকের হাসিমুখের গল্প এবং সমুদ্রযাত্রা শেষে এক বুক প্রশান্তির ঘুম আশা করেন।"
        ]
      },
      {
        id: "the-cat",
        chapterNameEn: "Lesson 7: The Cat",
        chapterNameBn: "Lesson 7: The Cat",
        summaryEn: "Andrew Barton Paterson's humorous essay analyzing the cat's real personality, showing it is not a simple, lazy pet but a fierce, agile animal.",
        summaryBn: "অ্যান্ড্রু বার্টন প্যাটারসন রচিত হাস্যরসাত্মক প্রবন্ধ যেখানে বিড়ালের আসল ব্যক্তিত্ব প্রকাশ করে দেখানো হয়েছে যে সে কোনো অলস জীব নয়, বরং অত্যন্ত চতুর ও সাহসী যোদ্ধা।",
        keyPointsEn: [
          "People think cats are dull and only care for milk and mice; the author argues they have more character than most humans.",
          "During tea time, the cat politely but firmly demands its share from the guests, sometimes scratching them gently.",
          "At night, the cat drops its domestic facade and transforms into a grim, agile athlete in the backyard."
        ],
        keyPointsBn: [
          "সাধারণ মানুষ মনে করে বিড়াল অলস ও কেবল দুধ ও ইঁদুর নিয়ে সন্তুষ্ট থাকে; কিন্তু কবি দেখিয়েছেন বিড়াল অত্যন্ত ব্যক্তিত্বসম্পন্ন প্রাণী।",
          "চায়ের আসরে বিড়াল অত্যন্ত বিনয়ের সাথে অতিথিদের কাছে তার খাবারের ভাগ চায় এবং না পেলে নখ দিয়ে আঁচড় কাটে।",
          "রাত্রিবেলায় বিড়াল তার শান্ত রূপ ছেড়ে বাড়ির ছাদে ও বাগানে এক ক্ষিপ্র ক্রীড়াবিদে পরিণত হয়।"
        ]
      },
      {
        id: "the-snail",
        chapterNameEn: "Lesson 8: The Snail",
        chapterNameBn: "Lesson 8: The Snail",
        summaryEn: "A short, descriptive poem by William Cowper highlighting the self-contained and secure life of a snail.",
        summaryBn: "উইলিয়াম কাউপার রচিত কবিতা যা শামুকের নিজের মধ্যে গুটিয়ে থাকার স্বয়ংসম্পূর্ণ ও নিরাপদ জীবনযাত্রাকে নিখুঁতভাবে ফুটিয়ে তোলে।",
        keyPointsEn: [
          "The snail lives closely attached to grass, leaf, or wall, carrying its home on its back.",
          "At the slightest hint of danger, it shrinks into its shell for safety and security.",
          "It lives a solitary, self-satisfied life, needing no external assets."
        ],
        keyPointsBn: [
          "শামুক ঘাস, পাতা বা দেয়ালে শক্তভাবে সেঁটে থাকে এবং নিজের ঘর নিজের পিঠেই বহন করে।",
          "সামান্যতম বিপদের আভাস পেলেই সে নিরাপত্তার জন্য নিজের খোলসের মধ্যে নিজেকে গুটিয়ে নেয়।",
          "সে সম্পূর্ণ একাকী অথচ নিজের ছোট্ট পরিমণ্ডলেই পরম সুখে ও সন্তুষ্টিতে জীবন কাটায়।"
        ]
      }
    ]
  },
  {
    id: "bengali",
    nameEn: "Bengali (Sahitya Sanchayan & Koni)",
    nameBn: "বাংলা",
    icon: "✍️",
    chapters: [
      {
        id: "gyanchakshu",
        chapterNameEn: "Gyan-Chakshu",
        chapterNameBn: "জ্ঞানচক্ষু (আশাপূর্ণা দেবী)",
        summaryEn: "A story of a young boy named Tapon whose illusions about writers are shattered when his own story is altered and published by his uncle.",
        summaryBn: "আশাপূর্ণা দেবীর রচিত গল্প যেখানে তপন নামের এক কিশোরের লেখক হওয়ার স্বপ্ন এবং নিজের লেখা গল্প মেসোমশাইয়ের মাধ্যমে ছেপে বের হওয়ার পর এক চরম সত্যের মুখোমুখি হওয়া।",
        keyPointsEn: [
          "Tapon believes writers belong to another world until he meets his new uncle who is a writer.",
          "Tapon writes a story, which his uncle promises to publish after making some minor 'corrections'.",
          "When the magazine arrives, Tapon is devastated to find his entire story rewritten, opening his eyes to the harsh truth of credit."
        ],
        keyPointsBn: [
          "তপন ভাবত লেখকেরা ভিনগ্রহের মানুষ, কিন্তু নতুন লেখক মেসোমশাইকে দেখে তার সেই ধারণা দূর হয়।",
          "তপনের লেখা একটি গল্প মেসোমশাই একটু 'কারেকশন' করে দেওয়ার নাম করে 'সন্ধ্যাতারা' পত্রিকায় ছাপিয়ে দেন।",
          "পত্রিকায় নিজের নামের তলায় অন্যের লেখা পড়ে তপনের আত্মসম্মান ক্ষুণ্ণ হয় এবং তার সত্যিকারের জ্ঞানচক্ষু উন্মীলিত হয়।"
        ]
      },
      {
        id: "ay-bendhe-thaki",
        chapterNameEn: "Ay Aro Bendhe Bendhe Thaki",
        chapterNameBn: "আয় আরো বেঁধে বেঁধে থাকি (শঙ্খ ঘোষ)",
        summaryEn: "A call for unity and solidarity among ordinary people facing instability, violence, and uncertainty in society.",
        summaryBn: "শঙ্খ ঘোষের একটি বিখ্যাত কবিতা যা যুদ্ধবিধ্বস্ত ও চরম সংকটের সময়ে সাধারণ শ্রমজীবী মানুষকে ঐক্যবদ্ধভাবে বেঁচে থাকার আহ্বান জানায়।",
        keyPointsEn: [
          "The poem describes a bleak reality where our paths are closed, and death looms close.",
          "The powerful have destroyed homes; ordinary citizens have lost their history.",
          "In such desperate times, our only strength is holding hands and staying united."
        ],
        keyPointsBn: [
          "কবিতাটি এমন এক কঠিন বাস্তবকে দেখায় যেখানে আমাদের ডাইনে ধস, বাঁয়ে গিরিখাদ আর মাথার ওপর বোমারু বিমান।",
          "ইতিহাস বিকৃত হয়েছে এবং সাধারণ মানুষের বেঁচে থাকার আশ্রয়টুকু কেড়ে নেওয়া হয়েছে।",
          "এই চরম সংকটে কবি আমাদের হাত ধরাধরি করে ঐক্যবদ্ধভাবে পরস্পরকে ভালোবেসে বেঁচে থাকার ডাক দিয়েছেন।"
        ]
      },
      {
        id: "africa",
        chapterNameEn: "Africa",
        chapterNameBn: "আফ্রিকা (রবীন্দ্রনাথ ঠাকুর)",
        summaryEn: "Rabindranath Tagore's powerful poem tracing the creation of Africa, its colonial exploitation, and a call for repentance from Europe.",
        summaryBn: "রবীন্দ্রনাথ ঠাকুর রচিত অত্যন্ত গভীর ও তাৎপর্যপূর্ণ কবিতা যেখানে আফ্রিকার সৃষ্টি রহস্য, ইউরোপীয় শক্তির দ্বারা উপনিবেশ স্থাপন ও অত্যাচারের করুণ ইতিহাস বর্ণিত হয়েছে।",
        keyPointsEn: [
          "Africa was carved out from the main continent by the turbulent hands of nature and kept in isolation.",
          "Imperialist European powers arrived with iron handcuffs, plundering its resources and blood.",
          "The poet urges the civilized world to stand before the dishonoured continent and ask for forgiveness."
        ],
        keyPointsBn: [
          "সৃষ্টির শুরুতে রুদ্র সমুদ্রের তাণ্ডবে মূল ভূখণ্ড থেকে বিচ্ছিন্ন হয়ে আফ্রিকা এক রহস্যময় অন্ধকারের অন্তরালে বন্দি ছিল।",
          "ইউরোপীয় দস্যুরা লোহার হাতকড়ি নিয়ে এসে আফ্রিকার আদিম অরণ্যের সহজ-সরল মানুষের রক্ত ও চোখের জলে মাটি কাদা করল।",
          "কিম্ভূত সভ্যতার সেই বর্বরতার প্রায়শ্চিত্ত করতে কবি আফ্রিকার অবমানিত দ্বারে দাঁড়িয়ে ক্ষমা চাওয়ার আহ্বান জানান।"
        ]
      },
      {
        id: "kali-kolom",
        chapterNameEn: "Hariye Jawa Kali Kolom",
        chapterNameBn: "হারিয়ে যাওয়া কালি কলম (শ্রীপান্থ)",
        summaryEn: "A nostalgic essay detailing the transition from traditional pen and ink to the digital era of computers and typing.",
        summaryBn: "শ্রীপান্থ (নিখিল সরকার) রচিত স্মৃতিকথামূলক প্রবন্ধ যা বাঁশের কঞ্চি, দোয়াত-কালি থেকে শুরু করে বলপেন ও কম্পিউটারের আগমনে কলমের অবলুপ্তির কাহিনী শোনায়।",
        keyPointsEn: [
          "The author recalls preparing homemade ink from roasted rice or leaves in his childhood.",
          "The arrival of fountain pens changed the writing experience; the subsequent rise of cheap ballpoints killed traditional calligraphy.",
          "In the age of computers, the pen has largely lost its daily presence, raising concern over losing this historical craft."
        ],
        keyPointsBn: [
          "লেখক শৈশবে কলাপাতায় বাঁশের কঞ্চির কলম দিয়ে লেখা এবং উনুনের ঝুলকালি দিয়ে কালি তৈরির কথা স্মরণ করেছেন।",
          "ফাউন্টেন পেন বা ঝরনা কলম লেখার জগতে জোয়ার এনেছিল; কিন্তু পরে সস্তা বলপেন সেই রাজকীয় কলমকে হটিয়ে দিল।",
          "কম্পিউটারের যুগে এসে কলম আজ হারিয়ে যাওয়ার মুখে, যা লেখককে ব্যথিত করে।"
        ]
      },
      {
        id: "bohurupi",
        chapterNameEn: "Bohurupi",
        chapterNameBn: "বহুরূপী (সুবোধ ঘোষ)",
        summaryEn: "A story of Hari Da, a poor man who lives life on his own terms by dressing up in various disguises and performing on the streets.",
        summaryBn: "সুবোধ ঘোষের একটি চমৎকার গল্প যেখানে হরিদা নামের এক দরিদ্র কিন্তু স্বাধীনচেতা মানুষের বহুরূপী সেজে অভিনয়ের মাধ্যমে জীবিকা অর্জনের কাহিনী বর্ণিত।",
        keyPointsEn: [
          "Hari Da hates fixed schedule jobs and prefers the uncertain earnings of a Bohurupi (disguise artist).",
          "He dresses as a madman, a Baul, a Kapalik, or a beautiful girl to entertain and collect small change.",
          "In his finest act, he disguises as a holy Biragi to visit Jagadish Babu's house, rejecting a huge sum of money to preserve the dignity of his role."
        ],
        keyPointsBn: [
          "হরিদা বাঁধা ধরা চাকরি পছন্দ করতেন না; তিনি বহুরূপী সেজে মানুষকে আনন্দ দিয়ে অল্প উপার্জনেই খুশি থাকতেন।",
          "তিনি কখনো পাগল, কখনো বাউল, কখনো কাবুলিওয়ালা সেজে রাস্তায় ঘুরে পয়সা রোজগার করতেন।",
          "জগদীশ বাবুর বাড়িতে বিরাগী সেজে গিয়ে হাড়ভাঙা খাটুনি আর ১০০ টাকার প্রণামী প্রত্যাখ্যান করে তিনি একজন সত্যিকারের শিল্পীর মর্যাদা রক্ষা করেছিলেন।"
        ]
      },
      {
        id: "abhishek",
        chapterNameEn: "Abhishek",
        chapterNameBn: "অভিষেক (মাইকেল মধুসূদন দত্ত)",
        summaryEn: "An epic extract from 'Meghnad Badh Kabya' depicting Indrajit preparing for the battle against Rama after hearing of his brother's death.",
        summaryBn: "মাইকেল মধুসূদন দত্তের অমর সৃষ্টি 'মেঘনাদবধ কাব্য'-এর প্রথম সর্গ থেকে সংকলিত কবিতা যেখানে বীর মেঘনাদের লঙ্কা রক্ষায় যুদ্ধযাত্রার বিবরণ রয়েছে।",
        keyPointsEn: [
          "Indrajit is relaxing in Pramod Udyan when Devi Lakshmi disguises as his stepmother to give the tragic news of Birbahu's death.",
          "Ashamed of his luxury while Lanka is under attack, Indrajit resolves to destroy Rama in battle.",
          "His father Ravana is initially reluctant to send him but ultimately performs his formal war coronation (Abhishek)."
        ],
        keyPointsBn: [
          "ইন্দ্রজিৎ প্রমোদ উদ্যানে থাকার সময় দেবী লক্ষ্মী তাঁর ধাত্রীমাতার ছদ্মবেশে এসে বীরবাহুর বীরগতি প্রাপ্তির খবর দেন।",
          "লঙ্কার ঘোর সংকটে নিজের বিলাসিতায় লজ্জিত হয়ে মেঘনাদ রামচন্দ্রকে সসৈন্যে বিনাশ করার কঠোর প্রতিজ্ঞা নেন।",
          "রাবণ পুত্রশোকে কাতর হয়ে প্রথমে পাঠাতে না চাইলেও শেষে মহাসমারোহে মেঘনাদের সেনাপতিত্বে যুদ্ধাভিষেক সম্পন্ন করেন।"
        ]
      },
      {
        id: "pather-dabi",
        chapterNameEn: "Pather Dabi",
        chapterNameBn: "পথের দাবী (শরৎচন্দ্র চট্টোপাধ্যায়)",
        summaryEn: "An intense excerpt from the novel centering around Sabyasachi, a revolutionary leader, and the interrogation of suspects by police under Nimai Babu.",
        summaryBn: "শরৎচন্দ্র চট্টোপাধ্যায়ের রাজনৈতিক উপন্যাস 'পথের দাবী' থেকে সংকলিত অংশ যেখানে বিপ্লবী সব্যসাচী মল্লিককে ধরার জন্য পুলিশের তল্লাশি ও অপূর্বের অভিজ্ঞতার কথা রয়েছে।",
        keyPointsEn: [
          "The British police inspect a group of Indian workers at a railway station to capture Sabyasachi.",
          "Girish Mahapatra, a bizarrely dressed and highly eccentric man, is thoroughly searched but let go.",
          "In reality, Girish's eccentric appearance was a perfect disguise of Sabyasachi to bypass the police."
        ],
        keyPointsBn: [
          "পুলিশের বড়কর্তা নিমাই বাবু সন্দেহভাজন এক রুগ্ন ও বিচিত্র পোশাকধারী গিরিশ মহাপাত্রকে জেরা করেন।",
          "গিরিশের অদ্ভুত পোশাক ও গাঁজার কলকে রাখা সত্ত্বেও পুলিশ তাকে নিরীহ লোক ভেবে ছেড়ে দেয়।",
          "প্রকৃতপক্ষে গিরিশ মহাপাত্রের এই ছদ্মবেশ ছিল অত্যন্ত চতুর বিপ্লবী সব্যসাচীর নিখুঁত চাল যা পুলিশ ধরতে পারেনি।"
        ]
      },
      {
        id: "adol-bodol",
        chapterNameEn: "Adol-Bodol",
        chapterNameBn: "অদল বদল (পান্নালাল প্যাটেল)",
        summaryEn: "A heartwarming story of the deep, selfless friendship between two young boys, Amrit and Isab, who belong to different religions.",
        summaryBn: "পান্নালাল প্যাটেল রচিত অসাধারণ গল্প যা অমৃত ও ইসব নামের দুই ভিন্ন ধর্মের বালকের নিঃস্বার্থ ও অকৃত্রিম বন্ধুত্বের কথা তুলে ধরে।",
        keyPointsEn: [
          "Amrit and Isab wear identical new clothes on Holi; they are challenged by other boys to a wrestle.",
          "During the fight, Isab's shirt gets torn. To protect Isab from his father's anger, Amrit swaps his clean shirt with Isab's torn one.",
          "This pure act of love unites the entire village and dissolves religious barriers."
        ],
        keyPointsBn: [
          "হোলির দিনে অমৃত ও ইসব একই রঙের নতুন জামা পরে ঘুরছিল; এক উশৃঙ্খল ছেলে তাদের মধ্যে কুস্তির লড়াই বাঁধিয়ে দেয়।",
          "ইসবের জামাটি ছিঁড়ে গেলে, তার বাবার মারের হাত থেকে বাঁচাতে অমৃত নিজের ভালো জামাটি ইসবের ছেঁড়া জামার সাথে অদল বদল করে নেয়।",
          "এই ঘটনার মধ্য দিয়ে ধর্মের ভেদাভেদ ভুলে দুই বন্ধুর পবিত্র ভালোবাসা গোটা গ্রামকে এক অনন্য মানবতার শিক্ষা দেয়।"
        ]
      },
      {
        id: "astro-shiel-gan",
        chapterNameEn: "Astro-Shield er Biruddhe Gan",
        chapterNameBn: "অস্ত্রের বিরুদ্ধে গান (জয় গোস্বামী)",
        summaryEn: "A deeply peaceful poem asserting that music and art are the ultimate weapons against violence, war, and weapons.",
        summaryBn: "জয় গোস্বামী রচিত যুদ্ধবিরোধী ও শান্তিকামী কবিতা যেখানে অস্ত্রের আস্ফালনের বিরুদ্ধে গানকে বা সুরকে একমাত্র রক্ষাকবচ হিসেবে দেখানো হয়েছে।",
        keyPointsEn: [
          "The poet urges humanity to lay down weapons and instead embrace the soothing, non-violent path of music.",
          "Weapons are symbols of destruction; song is a protective shield that heals wounds and unites hearts.",
          "Even if one is wounded, music remains an invincible armor for the soul."
        ],
        keyPointsBn: [
          "কবি সাধারণ মানুষকে যুদ্ধ ও হিংসার উন্মাদনা ছেড়ে গানের মাধ্যমে অহিংসার পথ বেছে নেওয়ার আর্জি জানিয়েছেন।",
          "অস্ত্র যেখানে ধ্বংসের প্রতীক, গান সেখানে একটি অদৃশ্য বর্ম যা ক্ষত নিরাময় করে মানুষের হৃদয়কে বেঁধে রাখে।",
          "সমস্ত আগ্রাসনের মুখেও গানের সুর চিরকাল অপরাজিত বর্মের মতো মানবসভ্যতাকে রক্ষা করবে।"
        ]
      },
      {
        id: "bangla-bhashay-vigyan",
        chapterNameEn: "Bangla Bhashay Vigyan",
        chapterNameBn: "বাংলা ভাষায় বিজ্ঞান (রাজশেখর বসু)",
        summaryEn: "An analytical essay addressing the challenges, constraints, and recommendations for writing scientific literature in Bengali.",
        summaryBn: "রাজশেখর বসু (পরশুরাম) রচিত প্রবন্ধ যা বাংলা ভাষায় বিজ্ঞানচর্চা ও বিজ্ঞান বিষয়ক প্রবন্ধ রচনার বিভিন্ন সমস্যা ও পরিভাষা ব্যবহারের ওপর আলোকপাত করে।",
        keyPointsEn: [
          "The first major challenge is the lack of proper, universally accepted Bengali scientific terminology.",
          "Translating English terms literally often leads to confusion; it is better to adopt widely-used international terms.",
          "Scientific writing must be precise, clear, and direct, avoiding excessive poetic expressions."
        ],
        keyPointsBn: [
          "বাংলায় বিজ্ঞান রচনার ক্ষেত্রে প্রথম প্রধান বাধা হল উপযুক্ত এবং সর্বজনগ্রাহ্য পারিভাষিক শব্দের অভাব।",
          "ইংরেজি পরিভাষা হুবহু আক্ষরিক অনুবাদ না করে আন্তর্জাতিক পরিভাষা গ্রহণ করা অনেক বেশি যুক্তিযুক্ত।",
          "বিজ্ঞানের লেখার ভাষা হতে হবে স্পষ্ট, সরল ও যুক্তিপূর্ণ; অলংকার বা কাব্যিকতা বর্জন করা বাঞ্ছনীয়।"
        ]
      },
      {
        id: "nodir-bidroho",
        chapterNameEn: "Nodir Bidroho",
        chapterNameBn: "নদীর বিদ্রোহ (মানিক বন্দ্যোপাধ্যায়)",
        summaryEn: "A symbolic story centering on Noderchand, a stationmaster who loves a local river, reflecting on human dominance over nature.",
        summaryBn: "মানিক বন্দ্যোপাধ্যায়ের বিখ্যাত গল্প যেখানে স্টেশনমাস্টার নদেরচাঁদের নদীর প্রতি গভীর ভালোবাসার মধ্য দিয়ে মানুষের দ্বারা নদীর ওপর বাঁধ দিয়ে কৃত্রিম নিয়ন্ত্রণের বিদ্রোহ প্রকাশ পেয়েছে।",
        keyPointsEn: [
          "Noderchand has spent his life near the river and feels an almost human bond with it.",
          "Seeing the turbulent river threatening the railway bridge, he realizes the river is rebelling against its concrete confinement.",
          "In the end, Noderchand is crushed by a train, showing how man-made industrialization ruthlessly overrides natural harmony."
        ],
        keyPointsBn: [
          "নদেরচাঁদ তার জীবনের দীর্ঘ সময় নদীর তীরে কাটিয়েছে এবং নদীর সাথে তার এক নিবিড় আত্মিক সম্পর্ক গড়ে উঠেছে।",
          "বর্ষায় উন্মত্ত নদীকে রেলব্রিজের তলা দিয়ে বইতে দেখে সে বুঝতে পারে নদী মানুষের গড়া কংক্রিটের বাঁধের বিরুদ্ধে বিদ্রোহ ঘোষণা করেছে।",
          "অবশেষে নদেরচাঁদের নিজের তৈরি ট্রেনের চাকায় পিষ্ট হয়ে মৃত্যু প্রকৃতির ওপর মানুষের যান্ত্রিক অত্যাচারের নির্মম জয় নির্দেশ করে।"
        ]
      },
      {
        id: "sirajuddoula",
        chapterNameEn: "Sirajuddoula (Play)",
        chapterNameBn: "সিরাজদ্দৌলা (শচীন্দ্রনাথ সেনগুপ্ত)",
        summaryEn: "A historical play depicting the internal betrayal, tragedy, and courage of Nawab Sirajuddoula in the Battle of Plassey.",
        summaryBn: "শচীন্দ্রনাথ সেনগুপ্ত রচিত ঐতিহাসিক নাটক যা পলাশীর যুদ্ধের পূর্বে নবাব সিরাজদ্দৌলার দরবারে ষড়যন্ত্র, মিরজাফরের বিশ্বাসঘাতকতা এবং সিরাজের দেশপ্রেমের ট্র্যাজেডি ফুটিয়ে তোলে।",
        keyPointsEn: [
          "The play shows Siraj's helplessness amidst widespread betrayal by his own ministers like Mir Jafar and Jagat Seth.",
          "Siraj makes a passionate plea for unity between Hindus and Muslims to defend the freedom of Bengal.",
          "Nawab Siraj is portrayed not as a weak king, but as a tragic patriot facing an inevitable defeat due to betrayal."
        ],
        keyPointsBn: [
          "নাটকে মিরজাফর, জগৎশেঠ ও ঘসেটি বেগমের মতো নিজের মানুষদের চরম কুৎসিত দেশদ্রোহিতা ও ষড়যন্ত্রের মুখে সিরাজের অসহায়তা চিত্রিত হয়েছে।",
          "বাংলার স্বাধীনতা রক্ষার্থে সিরাজ হিন্দু ও মুসলমান উভয় সম্প্রদায়ের মানুষকে ঐক্যবদ্ধ হওয়ার আবেগময় ডাক দেন।",
          "নবাবকে কোনো দুর্বল রাজা নয়, বরং চরম বিশ্বাসঘাতকতার শিকার এক ট্র্যাজিক দেশপ্রেমিক হিরো হিসেবে দেখানো হয়েছে।"
        ]
      },
      {
        id: "koni-novel",
        chapterNameEn: "Koni (Supplementary Reader)",
        chapterNameBn: "কোনি (মতি নন্দী)",
        summaryEn: "An inspirational story of Koni, a poor girl from North Kolkata slums, who overcomes extreme poverty and politics to become a swimming champion under her coach Khitish Sinha.",
        summaryBn: "মতি নন্দীর লেখা অত্যন্ত অনুপ্রেরণামূলক উপন্যাস যেখানে উত্তর কলকাতার বস্তির দরিদ্র মেয়ে কোনি এবং তার জেদি কোচ ক্ষিতীশ সিংহের লড়াইয়ের মাধ্যমে সাঁতারে জাতীয় চ্যাম্পিয়ন হওয়ার জয়গাথা চিত্রিত হয়েছে।",
        keyPointsEn: [
          "Khitish Sinha spots Koni's natural speed in the Ganges and takes her under his wing despite her extreme poverty.",
          "Koni faces continuous social and political hurdles from local club authorities but persists under Khitish's mantra: 'Fight, Koni, fight!'.",
          "In the national championship in Madras, Koni wins the gold medal for Bengal, proving that determination defeats adversity."
        ],
        keyPointsBn: [
          "গঙ্গাবক্ষে কোনির সাঁতার কাটার অদম্য ক্ষমতা দেখে জেদি ও সৎ কোচ ক্ষিতীশ সিংহ তাকে খুঁজে নেন এবং সাঁতারের প্রশিক্ষণ দিতে শুরু করেন।",
          "কোনিকে সাঁতারের ক্লাবের নোংরা রাজনীতি, চরম দরিদ্রতা এবং সামাজিক নানা বাধার মুখোমুখি হতে হয়।",
          "ক্ষিতীশের বিখ্যাত স্লোগান 'ফাইট কোনি ফাইট'-কে সম্বল করে মাদ্রাজে অনুষ্ঠিত জাতীয় সাঁতারে কোনি বাংলার হয়ে সোনা জেতে ও নিজেকে প্রমাণ করে।"
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
        id: "concept-history",
        chapterNameEn: "Concept of History (Ch 1)",
        chapterNameBn: "ইতিহাসের ধারণা (অধ্যায় ১)",
        summaryEn: "Modern trends in historiography, subaltern history, social, environmental, sports, and food history, and usage of primary sources.",
        summaryBn: "ইতিহাস রচনার আধুনিক রূপরেখা, নিম্নবর্গের ইতিহাসচর্চা, খেলাধুলো, খাদ্যসামগ্রী, পোশাক-পরিচ্ছদ, পরিবেশের ইতিহাস এবং চিঠিপত্র ও স্মৃতিকথার ভূমিকা।",
        keyPointsEn: [
          "New Social History focuses on the lives of ordinary citizens, not just kings and wars.",
          "Subaltern Studies was pioneered by Ranajit Guha to study oppressed classes.",
          "Important primary sources include Bipinchandra Pal's '70 Batsar' and Rabindranath's 'Jibansmriti'."
        ],
        keyPointsBn: [
          "নতুন সামাজিক ইতিহাস কেবল রাজা-রানীর যুদ্ধের বাইরে সাধারণ খেটে খাওয়া মানুষের জীবনযাত্রার ওপর গুরুত্ব দেয়।",
          "রণজিৎ গুহের নেতৃত্বে নিম্নবর্গীয় ইতিহাসচর্চা (Subaltern Studies) অবহেলিত ও নিপীড়িত শ্রেণীর ইতিহাসকে সামনে আনে।",
          "ইতিহাসের উপাদান হিসেবে বিপিনচন্দ্র পালের 'সত্তর বৎসর' এবং রবীন্দ্রনাথের 'জীবনস্মৃতি' অত্যন্ত মূল্যবান দলিল।"
        ]
      },
      {
        id: "reform-evaluation",
        chapterNameEn: "Reform: Characteristics and Evaluation (Ch 2)",
        chapterNameBn: "সংস্কার: বৈশিষ্ট্য ও মূল্যায়ন (অধ্যায় ২)",
        summaryEn: "Social and educational reforms in 19th-century Bengal, Bengal Renaissance, Bramho Samaj, Vidyasagar, and Ramakrishna.",
        summaryBn: "উনিশ শতকের বাংলার সমাজ ও শিক্ষা সংস্কার আন্দোলন, বাংলার নবজাগরণ, ব্রাহ্ম সমাজ, বিদ্যাসাগর ও রামকৃষ্ণ পরমহংসদেবের সর্বধর্মসমন্বয়।",
        keyPointsEn: [
          "Raja Rammohan Roy was instrumental in the abolition of Sati (1829) and spread of English education.",
          "Ishwar Chandra Vidyasagar successfully legalized Hindu Widow Remarriage (1856).",
          "Lalan Fakir propagated humanist spiritual values through his Baul songs."
        ],
        keyPointsBn: [
          "রাজা রামমোহন রায় সতীদাহ প্রথা রদ (১৮২৯) এবং ভারতে ইংরেজি শিক্ষার বিস্তারে অন্যতম অগ্রপথিক ছিলেন।",
          "ঈশ্বরচন্দ্র বিদ্যাসাগরের নিরলস প্রচেষ্টায় বিধবা বিবাহ আইন সিদ্ধ (১৮৫৬) হয়েছিল।",
          "লালন ফকির তাঁর বাউল গানের মাধ্যমে জাতপাতহীন অসাম্প্রদায়িক মানবধর্ম প্রচার করেন।"
        ]
      },
      {
        id: "resistance-rebellion",
        chapterNameEn: "Resistance and Rebellion: Characteristics (Ch 3)",
        chapterNameBn: "প্রতিরোধ ও বিদ্রোহ: বৈশিষ্ট্য ও বিশ্লেষণ (অধ্যায় ৩)",
        summaryEn: "Peasant and tribal uprisings against British colonial rule, Chuar rebellion, Kol rebellion, Santhal rebellion, and Indigo revolt.",
        summaryBn: "ঔপনিবেশিক শাসনের বিরুদ্ধে ভারতের বিভিন্ন কৃষক ও আদিবাসী বিদ্রোহ যেমন চুয়াড়, কোল, সাঁওতাল, ওয়াহাবি আন্দোলন ও নীল বিদ্রোহের কারণ।",
        keyPointsEn: [
          "Santhal Rebellion (1855) led by Sidhu and Kanhu was against British land taxes and money-lender exploitation.",
          "Indigo Revolt (1859) saw Bengal farmers refusing to cultivate indigo; Bishnucharan Biswas and Digambar Biswas were key leaders.",
          "Wahabi Movement in Bengal was led by Titu Mir, who constructed the famous Bamboo Fort (Banser Kella) in Narkelberia."
        ],
        keyPointsBn: [
          "১৮৫৫ সালের সাঁওতাল বিদ্রোহের নেতৃত্ব দেন সিধু ও কানহু, যা ছিল ব্রিটিশদের উচ্চ কর ও মহাজনদের শোষণের বিরুদ্ধে।",
          "১৮৫৯ সালের নীল বিদ্রোহে বাংলার কৃষকেরা নীল চাষ করতে অস্বীকার করে; প্রধান নেতা ছিলেন দিগম্বর বিশ্বাস ও বিষ্ণুচরণ বিশ্বাস।",
          "বাংলায় ওয়াহাবি আন্দোলনের নেতৃত্ব দেন তিতুমীর, যিনি নারকেলবেড়িয়ায় বিখ্যাত বাঁশের কেল্লা তৈরি করেছিলেন।"
        ]
      },
      {
        id: "early-organization",
        chapterNameEn: "Early Stages of Collective Action (Ch 4)",
        chapterNameBn: "সংঘবদ্ধতার গোড়ার কথা (অধ্যায় ৪)",
        summaryEn: "The Great Revolt of 1857, Queen's Proclamation (1858), rise of political associations (Sabha-Samiti), and representation through literature and art.",
        summaryBn: "১৮৫৭ সালের মহাবিদ্রোহ বা সিপাহী বিদ্রোহ, মহারানীর ঘোষণাপত্র (১৮৫৮), উনিশ শতকের সভা-সমিতি যুগ এবং আনন্দমঠ ও ভারতমাতা চিত্র।",
        keyPointsEn: [
          "The Revolt of 1857 marked the transition of power from the British East India Company to the British Crown.",
          "Bankim Chandra's 'Anandamath' containing 'Vande Mataram' became the holy book of national patriotism.",
          "Abanindranath Tagore painted 'Bharat Mata' in 1905, representing the motherland as a peaceful, four-armed goddess."
        ],
        keyPointsBn: [
          "১৮৫৭ সালের মহাবিদ্রোহের পর ব্রিটিশ ইস্ট ইন্ডিয়া কোম্পানির শাসনের অবসান ঘটে ও মহারানীর ঘোষণাপত্রের মাধ্যমে রানীর শাসন শুরু হয়।",
          "বঙ্কিমচন্দ্র চট্টোপাধ্যায়ের 'আনন্দমঠ' উপন্যাসের 'বন্দে মাতরম' সঙ্গীতটি বিপ্লবীদের মূল চালিকাশক্তি হয়ে উঠেছিল।",
          "অবনীন্দ্রনাথ ঠাকুর ১৯০৫ সালে 'ভারতমাতা' চিত্রটি আঁকেন যা স্বদেশী আন্দোলনের সময়ে জাতীয়তাবাদের প্রতীক হয়ে ওঠে।"
        ]
      },
      {
        id: "alternative-initiatives",
        chapterNameEn: "Alternative Ideas & Initiatives (Ch 5)",
        chapterNameBn: "বিকল্প চিন্তা ও উদ্যোগ (অধ্যায় ৫)",
        summaryEn: "Development of printing press in Bengal, science education (IACS, Bose Institute), Visva-Bharati, and technical education.",
        summaryBn: "বাংলায় ছাপাখানার বিকাশ, উপেন্দ্রকিশোর রায়চৌধুরী, বিজ্ঞান শিক্ষার প্রসার (IACS, বসু বিজ্ঞান মন্দির) এবং রবীন্দ্রনাথ ঠাকুরের বিশ্বভারতী ধারণা।",
        keyPointsEn: [
          "Upendrakishore Raychaudhuri pioneered modern halftone block printing through U. Ray & Sons.",
          "Indian Association for the Cultivation of Science (IACS) was founded by Dr. Mahendralal Sircar in 1876.",
          "Rabindranath Tagore established Visva-Bharati at Shantiniketan to blend nature with open-air education."
        ],
        keyPointsBn: [
          "উপেন্দ্রকিশোর রায়চৌধুরী 'ইউ. রায় অ্যান্ড সন্স' এর মাধ্যমে উন্নত মানের রঙিন হাফটোন ব্লক প্রিন্টিং প্রযুক্তির সূচনা করেন।",
          "ডাঃ মহেন্দ্রলাল সরকারের উদ্যোগে ১৮৭৬ সালে বিজ্ঞান গবেষণার পীঠস্থান IACS প্রতিষ্ঠিত হয়।",
          "রবীন্দ্রনাথ ঠাকুর শান্তিনিকেতনে প্রকৃতির মুক্তাঙ্গনে বিশ্বভারতী বিদ্যালয় প্রতিষ্ঠা করে শিক্ষার এক বিকল্প আদর্শ দেখান।"
        ]
      },
      {
        id: "peasant-worker-movements",
        chapterNameEn: "Peasants, Workers, and Left Movements (Ch 6)",
        chapterNameBn: "কৃষক, শ্রমিক ও বামপন্থী আন্দোলন (অধ্যায় ৬)",
        summaryEn: "Role of peasants and workers in Indian anti-colonial movements, Non-cooperation, Civil Disobedience, Quit India, and rise of Left politics.",
        summaryBn: "ভারতের স্বাধীনতা সংগ্রামে কৃষক ও শ্রমিক শ্রেণীর অবদান, অহিংস অসহযোগ, আইন অমান্য ও ভারত ছাড়ো আন্দোলন এবং বামপন্থী রাজনীতির বিকাশ।",
        keyPointsEn: [
          "Eka Movement (1921) led by Madari Pasi was a strong peasant protest against high rent in Uttar Pradesh.",
          "The All India Trade Union Congress (AITUC) was founded in 1920 with Lala Lajpat Rai as its first president.",
          "Manabendra Nath Roy played a key role in founding the Communist Party of India (1925)."
        ],
        keyPointsBn: [
          "১৯২১ সালের একা আন্দোলনের নেতৃত্ব দেন মাদারী পাশী, যা ছিল উত্তরপ্রদেশের জমিদারদের অতিরিক্ত কর আদায়ের বিরুদ্ধে প্রতিবাদ।",
          "১৯২০ সালে নিখিল ভারত ট্রেড ইউনিয়ন কংগ্রেস (AITUC) গঠিত হয়, যার প্রথম সভাপতি ছিলেন লালা লাজপত রায়।",
          "মানবেন্দ্রনাথ রায়ের উদ্যোগে ১৯২৫ সালে ভারতের কমিউনিস্ট পার্টি প্রতিষ্ঠিত হয় যা বামপন্থী মতাদর্শের বিকাশ ঘটায়।"
        ]
      },
      {
        id: "women-students-marginalized",
        chapterNameEn: "Women, Students, and Marginalized Movements (Ch 7)",
        chapterNameBn: "নারী, ছাত্র ও প্রান্তিক আন্দোলন (অধ্যায় ৭)",
        summaryEn: "Role of women and student organizations in revolutionary movements, Pritilata Waddedar, Bina Das, and Dalit/Namasudra movements.",
        summaryBn: "বিপ্লবী আন্দোলনে নারীদের সক্রিয় অংশগ্রহণ (প্রীতিলতা ওয়াদ্দেদার, বীণা দাস), সশস্ত্র সংগ্রামে ছাত্র সমাজ এবং দলিত ও নমঃশূদ্র আন্দোলন।",
        keyPointsEn: [
          "Pritilata Waddedar led the raid on Pahartali European Club in Chittagong (1932).",
          "Bina Das shot at Bengal Governor Stanley Jackson during the convocation ceremony (1932).",
          "Harichand Thakur and Guruchand Thakur initiated the Matua/Namasudra movement in Bengal for the social rights of untouchables."
        ],
        keyPointsBn: [
          "প্রীতিলতা ওয়াদ্দেদার ১৯৩২ সালে চট্টগ্রামের পাহাড়তলী ইউরোপীয় ক্লাব আক্রমণে বীরত্বের সাথে নেতৃত্ব দেন।",
          "বীণা দাস ১৯৩২ সালে কলকাতা বিশ্ববিদ্যালয়ের সমাবর্তন উৎসবে বাংলার গভর্নর স্ট্যানলি জ্যাকসনকে লক্ষ্য করে গুলি ছোড়েন।",
          "হরিচাঁদ ঠাকুর ও গুরুচাঁদ ঠাকুর বাংলায় নমঃশূদ্র বা মতুয়া আন্দোলনের সূচনা করেন যা দলিতদের সামাজিক অধিকার আদায়ের লড়াই ছিল।"
        ]
      },
      {
        id: "post-colonial-india",
        chapterNameEn: "Post-Colonial India: 1947-1964 (Ch 8)",
        chapterNameBn: "উত্তর-ঔপনিবেশিক ভারত (অধ্যায় ৮)",
        summaryEn: "Partition of India, refugee rehabilitation crisis, integration of princely states (Hyderabad, Junagadh, Kashmir), and linguistic reorganization of states.",
        summaryBn: "দেশভাগ ও উদ্বাস্তু সমস্যা, জুনাগড়, হায়দরাবাদ ও কাশ্মীরকে ভারতের সাথে সংযুক্তিকরণ এবং ভাষাভিত্তিক রাজ্য পুনর্গঠন কমিশন।",
        keyPointsEn: [
          "Sardar Vallabhbhai Patel, the 'Iron Man of India', successfully integrated over 560 princely states.",
          "Operation Polo was conducted in 1948 to integrate the princely state of Hyderabad into India.",
          "State Reorganization Commission (SRC) of 1953 recommended linguistic states, leading to Andhra Pradesh being the first."
        ],
        keyPointsBn: [
          "ভারতের লৌহমানব সর্দার বল্লভভাই প্যাটেলের কূটনীতি ও সঙ্কল্পের ফলে ৫৬০টিরও বেশি দেশীয় রাজ্য ভারতে যুক্ত হয়।",
          "১৯৪৮ সালে 'অপারেশন পোলো' সামরিক অভিযানের মাধ্যমে হায়দরাবাদ রাজ্যকে ভারতভুক্ত করা হয়।",
          "ভাষাভিত্তিক রাজ্য পুনর্গঠন কমিশনের সুপারিশে প্রথম ভাষাভিত্তিক রাজ্য হিসেবে অন্ধ্রপ্রদেশের জন্ম হয়।"
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
        id: "exogenetic-processes",
        chapterNameEn: "Exogenetic Processes & Landforms (Ch 1)",
        chapterNameBn: "বহির্জাত প্রক্রিয়া ও সৃষ্ট ভূমিরূপ (অধ্যায় ১)",
        summaryEn: "Work of river, wind, and glacier, and their associated erosional and depositional landforms.",
        summaryBn: "নদী, হিমবাহ ও বায়ুর ক্ষয়কাজ এবং সঞ্চয়কাজের মাধ্যমে গঠিত বিভিন্ন ল্যান্ডফর্ম বা ভূমিরূপের সচিত্র আলোচনা।",
        keyPointsEn: [
          "Erosional landforms of River include I and V-shaped valleys, gorges, and waterfalls.",
          "Glaciers form U-shaped valleys, hanging valleys, and moraines.",
          "Wind action forms mushroom rocks (Yadang), sand dunes, and loess plains."
        ],
        keyPointsBn: [
          "নদীর ক্ষয়কাজের ফলে ইংরেজি I এবং V আকৃতির উপত্যকা, গিরিখাত ও জলপ্রপাত গঠিত হয়।",
          "হিমবাহের ক্ষয় ও সঞ্চয়কাজের ফলে U-আকৃতির উপত্যকা, ঝুলন্ত উপত্যকা এবং গ্রাবরেখা সৃষ্টি হয়।",
          "মরু অঞ্চলে বায়ুর কাজের ফলে ইয়ারদাং, মাশরুম রক বা গৌর এবং বালিয়াড়ি গঠিত হয়।"
        ]
      },
      {
        id: "atmosphere-10",
        chapterNameEn: "Atmosphere (Ch 2)",
        chapterNameBn: "বায়ুমণ্ডল (অধ্যায় ২)",
        summaryEn: "Structure of atmosphere, solar radiation, heat budget, planetary winds, pressure belts, and global climate change.",
        summaryBn: "বায়ুমণ্ডলের উল্লম্ব স্তরবিন্যাস, উষ্ণতার তারতম্য, বায়ুচাপ বলয়, নিয়ত ও স্থানীয় বায়ুপ্রবাহ এবং বৃষ্টিপাতের প্রকারভেদ।",
        keyPointsEn: [
          "Troposphere temperature decreases with altitude; Stratosphere contains the protective Ozone layer.",
          "There are 7 planetary pressure belts across the globe.",
          "Monsoon winds are seasonal winds driven by differences in heating of land and sea."
        ],
        keyPointsBn: [
          "উচ্চতা বাড়ার সাথে সাথে ট্রপোস্ফিয়ারে উষ্ণতা হ্রাস পায়; স্ট্র্যাটোস্ফিয়ারে সুরক্ষাকারী ওজোন স্তর রয়েছে।",
          "সারা বিশ্বে মোট ৭টি বায়ুচাপ বলয় রয়েছে যা বায়ুপ্রবাহের দিক নিয়ন্ত্রণ করে।",
          "মৌসুমী বায়ু হল এক ধরণের ঋতুভিত্তিক সাময়িক বায়ু যা স্থলভাগ ও জলভাগের উষ্ণতার পার্থক্যের জন্য প্রবাহিত হয়।"
        ]
      },
      {
        id: "hydrosphere-10",
        chapterNameEn: "Hydrosphere (Ch 3)",
        chapterNameBn: "বারিমণ্ডল (অধ্যায় ৩)",
        summaryEn: "Ocean currents, factors affecting currents, tides (spring and neap tides), and ecological effects of ocean currents.",
        summaryBn: "সমুদ্রস্রোত সৃষ্টির কারণ, উষ্ণ ও শীতল স্রোতের বিবরণ, জোয়ার-ভাটার কারণ (তেজকটাল ও মরাকটাল) এবং এর প্রভাব।",
        keyPointsEn: [
          "Ocean currents are mainly caused by planetary winds, Earth's rotation, and salinity differences.",
          "Spring Tide (Tej Katal) occurs on New Moon and Full Moon when Sun, Moon, and Earth are in a straight line.",
          "Neap Tide (Mora Katal) occurs during the first and third quarters when Sun and Moon are at right angles."
        ],
        keyPointsBn: [
          "সমুদ্রস্রোত প্রধানত নিয়ত বায়ুপ্রবাহ, পৃথিবীর আবর্তন গতি এবং জলের লবণতা ও উষ্ণতার পার্থক্যের জন্য ঘটে।",
          "অমাবস্যা ও পূর্ণিমা তিথিতে সূর্য, চন্দ্র ও পৃথিবী সরলরেখায় এলে প্রবল জোয়ার বা তেজকটাল ঘটে।",
          "অষ্টমী তিথিতে চন্দ্র ও সূর্য সমকোণে অবস্থান করায় আকর্ষণের তীব্রতা কমে যায় এবং মরাকটাল ঘটে।"
        ]
      },
      {
        id: "waste-management",
        chapterNameEn: "Waste Management (Ch 4)",
        chapterNameBn: "বর্জ্য ব্যবস্থাপনা (অধ্যায় ৪)",
        summaryEn: "Sources of solid, liquid, and gaseous wastes, environmental impacts, and the 4Rs (Reduce, Reuse, Recycle, Refuse).",
        summaryBn: "কঠিন, তরল ও গ্যাসীয় বর্জ্যের উৎস, পরিবেশের ওপর বর্জ্যের প্রভাব এবং ৪R পদ্ধতি (Reduce, Reuse, Recycle, Refuse) ও স্ক্রাবার-এর ব্যবহার।",
        keyPointsEn: [
          "Biodegradable wastes decompose naturally; Non-biodegradable wastes (like plastics) persist and pollute.",
          "Scrubbers are used in industries to remove gaseous pollutants from exhaust gases.",
          "The 4R method stands for Reduce, Reuse, Recycle, and Refuse to promote circular economy."
        ],
        keyPointsBn: [
          "জৈব ভঙ্গুর বর্জ্য সহজেই মাটিতে মিশে যায়; কিন্তু প্লাস্টিকের মতো জৈব অভঙ্গুর বর্জ্য শত শত বছর স্থায়ী হয়ে পরিবেশ দূষণ ঘটায়।",
          "শিল্পকারখানায় গ্যাসীয় বর্জ্য নিষ্কাশনের সময় ক্ষতিকর কণা দূর করতে 'স্ক্রাবার' নামক যন্ত্র ব্যবহার করা হয়।",
          "বর্জ্যের সুষ্ঠু ব্যবস্থাপনায় ৪R পদ্ধতি প্রয়োগ করা হয় যার অর্থ হল: হ্রাসকরণ, পুনর্ব্যবহার, পুনর্নবীকরণ এবং বর্জন।"
        ]
      },
      {
        id: "india-geography",
        chapterNameEn: "India: Physical & Economic Geography (Ch 5)",
        chapterNameBn: "ভারতের ভৌগোলিক পরিবেশ (অধ্যায় ৫)",
        summaryEn: "Himalayas, Ganga-Brahmaputra plains, rivers, soils, climate (monsoons), agriculture, major industries, and population density.",
        summaryBn: "ভারতের প্রাকৃতিক ভূপ্রকৃতি (হিমালয়, সমভূমি), নদনদী, জলবায়ু ও মৃত্তিকা, কৃষিকাজ, ধান-গম-চা চাষ এবং লৌহ-ইস্পাত ও তথ্যপ্রযুক্তি শিল্প।",
        keyPointsEn: [
          "The Himalayas act as a barrier to the cold Siberian winds, preserving India's tropical climate.",
          "Green Revolution in India (1960s) boosted wheat production, especially in Punjab and Haryana.",
          "Mumbai-Pune and Hooghly regions are highly concentrated industrial zones in India."
        ],
        keyPointsBn: [
          "হিমালয় পর্বতমালা সাইবেরিয়া থেকে আসা শীতল বাতাসকে বাধা দিয়ে ভারতকে তীব্র শীতের হাত থেকে রক্ষা করে।",
          "১৯৬০-এর দশকে সবুজ বিপ্লবের ফলে পাঞ্জাব ও হরিয়ানায় গম উৎপাদন বহুগুণ বৃদ্ধি পেয়েছিল।",
          "মুম্বাই-পুনে এবং হুগলি শিল্পাঞ্চল ভারতের অত্যন্ত গুরুত্বপূর্ণ ও প্রাচীনতম শিল্প বলয়।"
        ]
      },
      {
        id: "satellite-maps",
        chapterNameEn: "Satellite Imagery & Topographical Maps (Ch 6)",
        chapterNameBn: "উপগ্রহ চিত্র ও ভূবৈচিত্র্যসূচক মানচিত্র (অধ্যায় ৬)",
        summaryEn: "Introduction to satellite imagery, bands, false color composite (FCC), topographical maps, scale, and contour lines.",
        summaryBn: "উপগ্রহ চিত্রের ধারণা, ছদ্ম রঙ (FCC), ভূবৈচিত্র্যসূচক মানচিত্রের ব্যবহার, স্কেল এবং সমুন্নতি রেখার গুরুত্ব।",
        keyPointsEn: [
          "Satellite imagery uses False Color Composite (FCC) where green vegetation appears bright red.",
          "Topographical maps use contour lines to represent elevation and terrain features.",
          "RF (Representative Fraction) scale (e.g., 1:50,000) represents the ratio of map distance to ground distance."
        ],
        keyPointsBn: [
          "উপগ্রহ চিত্রে ছদ্ম রঙ বা FCC পদ্ধতি ব্যবহার করা হয় যেখানে গাছপালাকে উজ্জ্বল লাল রঙে দেখানো হয়ে থাকে।",
          "ভূবৈচিত্র্যসূচক মানচিত্রে সমুন্নতি রেখার (Contour line) সাহায্যে ভূপ্রকৃতির ঢাল ও উচ্চতা দেখানো হয়।",
          "RF স্কেল (যেমন ১:৫০,০০০) মানচিত্রের দূরত্ব এবং ভূমির প্রকৃত দূরত্বের অনুপাত নির্দেশ করে।"
        ]
      }
    ]
  }
];

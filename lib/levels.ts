export interface LevelData {
  id: number;
  title: string;
  desc: string;
  learningPoints: string[]; // Key takeaways from the book
  vocab: string[]; // Key collocations
  challenge: {
    chinese: string;
    standardEnglish: string; // The book's answer
    tips: string; // AI prompt context or explanation
  };
}

export const levelsData: Record<number, LevelData> = {
  1: {
    id: 1,
    title: "Aging Population",
    desc: "Day 1 focuses on the causes and effects of an aging society.",
    learningPoints: [
      "Avoid simple words like 'old people'. Use 'the elderly' or 'senior citizens'.",
      "Focus on 'demographic shift' as a key concept.",
    ],
    vocab: ["demographic shift", "pension burden", "healthcare demand"],
    challenge: {
      chinese: "随着医疗水平的提高，人们的预期寿命显著延长。",
      standardEnglish:
        "With the improvement of medical care, people's life expectancy has been significantly extended.",
      tips: "Pay attention to the passive voice and the noun phrase 'life expectancy'.",
    },
  },
  2: {
    id: 2,
    title: "Environment Protection",
    desc: "Day 2 discusses global warming and individual responsibilities.",
    learningPoints: [
      "Use 'environmental degradation' instead of just 'pollution'.",
      "Highlight 'sustainable development'.",
    ],
    vocab: ["carbon footprint", "sustainable development", "renewable energy"],
    challenge: {
      chinese: "保护环境不仅是政府的责任，也是每个公民的义务。",
      standardEnglish:
        "Protecting the environment is not only the responsibility of the government but also the duty of every citizen.",
      tips: "Use 'not only... but also...'. Consider using 'obligation' or 'duty'.",
    },
  },
  3: {
    id: 3,
    title: "Education",
    desc: "Day 3 explores the role of education in personal development.",
    learningPoints: [
      "Use 'academic achievement' instead of 'good grades'.",
      "Emphasize 'lifelong learning' as a concept.",
    ],
    vocab: ["academic achievement", "lifelong learning", "educational attainment"],
    challenge: {
      chinese: "教育不仅仅是传授知识，更是培养批判性思维能力。",
      standardEnglish:
        "Education is not merely about imparting knowledge but also about cultivating critical thinking skills.",
      tips: "Use 'not merely... but also...' structure. Focus on 'cultivating' and 'critical thinking'.",
    },
  },
  4: {
    id: 4,
    title: "Technology",
    desc: "Day 4 examines the impact of technology on society.",
    learningPoints: [
      "Use 'technological advancement' instead of 'new technology'.",
      "Distinguish between 'benefits' and 'drawbacks'.",
    ],
    vocab: ["technological advancement", "digital divide", "automation"],
    challenge: {
      chinese: "虽然科技带来了便利，但也导致了就业机会的减少。",
      standardEnglish:
        "Although technology has brought convenience, it has also led to a reduction in employment opportunities.",
      tips: "Use 'Although... it has also...' structure. Pay attention to 'reduction' vs 'decrease'.",
    },
  },
  5: {
    id: 5,
    title: "Crime & Law",
    desc: "Day 5 discusses the purpose of imprisonment.",
    learningPoints: [
      "Distinguish between 'deterrence' (威慑) and 'rehabilitation' (改造).",
      "Use formal subjects like 'incarceration' instead of just 'jail'.",
    ],
    vocab: ["deterrent effect", "rehabilitation program", "first-time offender"],
    challenge: {
      chinese: "监禁不仅是为了惩罚罪犯，更是为了威慑潜在的犯罪者。",
      standardEnglish:
        "Imprisonment serves not only to punish offenders but also to act as a deterrent to potential criminals.",
      tips: "Use the 'not only... but also...' structure. Focus on 'deterrent'.",
    },
  },
  // You can extend this list later
};


export type BlueprintSection = {
  title: string;
  subsections: {
    title: string;
    timestamp: string;
    summary: string;
  }[];
};

export type Blueprint = {
  sections: BlueprintSection[];
};

export type Flashcard = {
  question: string;
  answer: string;
};

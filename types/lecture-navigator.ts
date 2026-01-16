export type BlueprintSection = {
  title: string;
  subsections: {
    title: string;
    timestamp: string; // "MM:SS"
  }[];
};

export type Blueprint = {
  sections: BlueprintSection[];
};


export interface Reading {
    id: string;
    userId: string;
    readingDate: { seconds: number, nanoseconds: number } | any;
    birthDate: { seconds: number, nanoseconds: number } | any;
    birthTime: string;
    birthLocation: string;
    foundationalOverview: string;
    careerWealthSuccess: string;
    healthVitality: string;
    loveRelationships: string;
    personalityInnerGrowth: string;
    lifePathTimeline: string;
    guidanceRemedies: string;
  }
  
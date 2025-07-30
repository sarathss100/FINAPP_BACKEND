
export default interface ISmartAnalysisResultDTO {
    isSmartCompliant: boolean;
    feedback: Record<string, string>;
    suggestions: string[];
    totalScore: number;
    criteriaScores: Record<string, number>;
}


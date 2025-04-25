
interface ISmartAnalysisResult {
    isSmartCompliant: boolean; // Whether the goal is fully SMART-complaint
    feedback: Record<string, string>; // Feedback for each SMART criteria
    suggestions: string[]; // Suggestions for improvement
    totalScore: number; // Total score out of 100
    criteriaScores: Record<string, number>; // Scores for each SMART criteria
}

export default ISmartAnalysisResult;

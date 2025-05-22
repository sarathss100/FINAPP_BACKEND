import { IGoalDTO } from 'dtos/goal/GoalDto';
import ISmartAnalysisResult from 'services/goal/interfaces/ISmartAnalysisResult';
   
/**
* Parses the Gemini API response
*/
export const parseGeminiResponse = function (response: string): ISmartAnalysisResult {
    try {
        // Try to extract JSON from the response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : response;
        
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Error parsing Gemini response:', error);
        // Fallback response if parsing fails
        return {
            isSmartCompliant: false,
            feedback: {
                Overall: 'Failed to analyze goals due to response parsing error.',
            },
            suggestions: ['Try again later or contact support.'],
            totalScore: 0,
            criteriaScores: {
                specific: 0,
                measurable: 0,
                achievable: 0,
                relevant: 0,
                timeBound: 0,
            },
        };
    }
}
    
/**
     * Formats goal data for the Gemini API
     */
const formatGoalsForGemini = function (goals: IGoalDTO[]): string {
    return goals
        .filter(goal => !goal.is_completed)
        .map((goal, index) => {
            return `Goal ${index + 1}:
            - Name: ${goal.goal_name}
            - Target Amount: ${goal.target_amount || 'Not specified'}
            - Target Date: ${goal.target_date}
            - Priority Level: ${goal.priority_level}`;
        })
        .join('\n\n');
}

/**
     * Creates a prompt for the Gemini API to analyze SMART goals
     */
export const createGeminiPrompt = function (goals: IGoalDTO[]): string {
    const formattedGoals = formatGoalsForGemini(goals);
    
    return `Analyze the following financial goals based on SMART criteria (Specific, Measurable, Achievable, Relevant, Time-bound).

    ${formattedGoals}

    For each goal, evaluate:
    1. Specific (0-100): Is the goal clearly defined?
    2. Measurable (0-100): Does it have a specific target amount?
    3. Achievable (0-100): Is the target realistic given the timeframe?
    4. Relevant (0-100): How important is this goal based on priority?
    5. Time-bound (0-100): Does it have a clear deadline?

    Provide your analysis in the following JSON format:
    {
      "isSmartCompliant": boolean,
      "totalScore": number,
      "criteriaScores": {
        "specific": number,
        "measurable": number,
        "achievable": number,
        "relevant": number,
        "timeBound": number
      },
      "feedback": {
        "Overall": string
      },
      "suggestions": [string]
    }`;
}   


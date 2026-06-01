import dotenv from 'dotenv';
dotenv.config();

// Standard prompt-oriented structure that integrates OpenAI or returns highly tailored mock SaaS suggestions
export const analyzeResumeAI = async (resumeData: any): Promise<any> => {
  const hasKey = !!process.env.OPENAI_API_KEY;
  if (!hasKey) {
    // Generate intelligent simulation based on inputs
    const score = Math.floor(Math.random() * 20) + 72; // realistic 72-92 score
    const skills = resumeData.skills || [];
    const missing = ['Docker', 'CI/CD Pipelines', 'System Design', 'Jest/Unit Testing', 'Redis'].filter(
      s => !skills.map((sk: string) => sk.toLowerCase()).includes(s.toLowerCase())
    );
    const mockSuggestions = [
      'Quantify project outcomes (e.g., \"improved load times by 40%\" instead of \"built a fast website\").',
      'Move critical technical skills closer to the top of the resume.',
      'Ensure standard, single-column margins for optimal ATS scanner parsing.'
    ];

    return {
      score,
      missingKeywords: missing.slice(0, 3),
      layoutRating: score > 85 ? 'Excellent' : 'Good',
      contentSuggestions: mockSuggestions,
      optimizedSummary: `Result-driven professional with expertise in ${skills.slice(0, 3).join(', ') || 'Software Development'}. Demonstrated ability to deliver high-quality code and optimize system performances, eager to drive growth in technology environments.`,
      skillSuggestions: ['GraphQL', 'TypeScript', 'Kubernetes'].filter(
        s => !skills.map((sk: string) => sk.toLowerCase()).includes(s.toLowerCase())
      )
    };
  }

  // If OpenAI key is present, execute actual API query
  try {
    const { default: OpenAI } = require('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: 'You are an elite corporate hiring director and ATS scanning system. Analyze the provided resume JSON and return a JSON object with: { "score": number, "missingKeywords": string[], "layoutRating": string, "contentSuggestions": string[], "optimizedSummary": string, "skillSuggestions": string[] }.'
        },
        {
          role: 'user',
          content: JSON.stringify(resumeData)
        }
      ]
    });
    return JSON.parse(response.choices[0].message?.content || '{}');
  } catch (error: any) {
    console.error('[AI Service] OpenAI Resume Error:', error);
    throw error;
  }
};

export const getInterviewQuestionAI = async (
  type: string,
  roleTopic: string,
  history: Array<{ role: 'ai' | 'user'; text: string }>
): Promise<string> => {
  const hasKey = !!process.env.OPENAI_API_KEY;
  if (!hasKey) {
    const length = history.length;
    if (length === 0) {
      return `Welcome to the mock interview! I am your AI ${type.toUpperCase()} Interviewer today for the ${roleTopic} role. Let's start with: Tell me about yourself and your background.`;
    }

    const lastUserResponse = history[history.length - 1]?.text || '';
    const technicalPrompts = [
      `That is quite interesting. Can you explain the difference between relational databases (SQL) and non-relational databases (NoSQL)? Under what conditions would you favor MongoDB over MySQL?`,
      `Excellent. Speaking of databases and state management, how do you handle security and state synchronization in a high-traffic production application?`,
      `Thank you. Let's shift a bit towards your experience. Can you explain a challenging bug or architecture problem you solved in one of your projects, and how you approached it?`,
      `Nice explanation. What is your process for optimizing frontend load times or database query execution plans?`
    ];

    const hrPrompts = [
      `Thanks for sharing. Why do you want to join our organization, and what makes you a good fit for this role?`,
      `Interesting perspective. Tell me about a time you had a conflict within a team or project group. How did you resolve it and what did you learn?`,
      `Thank you. Where do you see yourself in the next five years, and what professional milestones do you hope to reach?`,
      `Wonderful. Do you have any questions for me about the company culture, expectations, or the team structure?`
    ];

    const promptList = type === 'technical' ? technicalPrompts : hrPrompts;
    const index = Math.floor(length / 2);
    if (index >= promptList.length) {
      return `That concludes my list of structured questions for today. Is there anything else you would like to elaborate on regarding your qualifications before I finalize your score?`;
    }
    return promptList[index];
  }

  try {
    const { default: OpenAI } = require('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const formattedMessages = history.map(h => ({
      role: h.role === 'ai' ? 'assistant' : 'user',
      content: h.text
    }));
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an expert AI interviewer conducting a ${type} interview for the ${roleTopic} role. Ask professional, context-appropriate questions. Follow up logically on the user's answers. Ask only one concise question at a time.`
        },
        ...formattedMessages
      ]
    });
    return response.choices[0].message?.content || 'Could you elaborate on that?';
  } catch (error) {
    console.error('[AI Service] OpenAI Interview Error:', error);
    return 'Could you elaborate on your experience with scaling systems and handling asynchronous workflows?';
  }
};

export const gradeInterviewAI = async (
  type: string,
  roleTopic: string,
  transcript: Array<{ role: 'ai' | 'user'; text: string }>
): Promise<any> => {
  const hasKey = !!process.env.OPENAI_API_KEY;
  if (!hasKey) {
    // Generate intelligent simulation scores
    const technical = type === 'hr' ? Math.floor(Math.random() * 10) + 82 : Math.floor(Math.random() * 15) + 75;
    const communication = Math.floor(Math.random() * 12) + 80;
    const confidence = Math.floor(Math.random() * 10) + 85;
    const overall = Math.floor((technical + communication + confidence) / 3);

    return {
      scores: { technical, communication, confidence, overall },
      feedback: {
        strengths: [
          'Excellent articulation of personal project architecture.',
          'Demonstrated clear understanding of core software paradigms.',
          'Kept a highly confident and structured tone throughout the discussion.'
        ],
        weaknesses: [
          'Could provide more numeric metrics to qualify achievements.',
          type === 'technical' ? 'Database indexing rationale could be detailed further.' : 'Conflict resolution stories could follow the STAR framework more strictly.'
        ],
        suggestions: [
          'Study detailed performance profiling tools (e.g., Lighthouse, query planners).',
          'Practice structuring behavioral questions strictly utilizing the Situation, Task, Action, Result methodology.'
        ],
        detailedAnalysis: `The candidate showed a solid grasp of ${roleTopic} concepts. Communication was highly fluid and the answers were structured logically. Technical assertions were sound, but would benefit from further quantitative descriptions of work results.`
      }
    };
  }

  try {
    const { default: OpenAI } = require('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: 'You are an elite corporate interviewer. Evaluate the provided interview transcript and grade the candidate. Return a JSON object with: { "scores": { "technical": number, "communication": number, "confidence": number, "overall": number }, "feedback": { "strengths": string[], "weaknesses": string[], "suggestions": string[], "detailedAnalysis": string } }.'
        },
        {
          role: 'user',
          content: JSON.stringify({ type, roleTopic, transcript })
        }
      ]
    });
    return JSON.parse(response.choices[0].message?.content || '{}');
  } catch (error) {
    console.error('[AI Service] OpenAI Grading Error:', error);
    throw error;
  }
};

export const getCompanyRoadmapAI = async (company: string, skills: string[]): Promise<any> => {
  const steps = [
    {
      title: 'Phase 1: Foundation (Aptitude & DSA)',
      topics: ['Quantitative Tricks', 'Dynamic Programming', 'Data Structures (Trees & Graphs)'],
      description: `Prepare extensively on arrays, strings, and standard algorithmic loops. ${company} focuses heavily on raw problem solving.`
    },
    {
      title: 'Phase 2: Core Domain Practice',
      topics: skills.length > 0 ? skills.slice(0, 3) : ['Full Stack development', 'System Design Basics'],
      description: `Deep dive into system optimization, databases, and structural coding challenges matching standard ${company} technical sheets.`
    },
    {
      title: 'Phase 3: Company-Specific Mock Runs',
      topics: [`${company} Past Questions`, 'Behavioral Alignment (STAR framework)'],
      description: 'Practice simulated coding contests and time-restricted verbal reasoning modules.'
    }
  ];

  return {
    company,
    steps,
    tips: [
      `Review ${company} specific culture guidelines.`,
      'Do not jump into coding immediately: outline system complexity and constraints first.',
      'Quantify your project outcomes clearly.'
    ]
  };
};

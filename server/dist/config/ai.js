"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTechnicalQuizAI = exports.chatAssistantAI = exports.generateCodingChallengesAI = exports.generateAptitudeQuestionsAI = exports.getCompanyRoadmapAI = exports.gradeInterviewAI = exports.getInterviewQuestionAI = exports.analyzeResumeAI = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// The Ollama model to use. Hardcoding to user's requested cloud model to bypass cached environment variables.
const OLLAMA_MODEL = 'gemma4:31b-cloud';
const OLLAMA_URL = 'http://localhost:11434/api/chat';
const askOllama = async (messages, format) => {
    const payload = {
        model: OLLAMA_MODEL,
        messages: messages,
        stream: false,
        options: {
            num_predict: 8192
        }
    };
    if (format === 'json') {
        payload.format = 'json';
    }
    const response = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Ollama API error: ${response.statusText} - ${errText}`);
    }
    const data = await response.json();
    return data.message?.content || '';
};
// Helper to safely parse JSON from LLMs that return Markdown code blocks or conversational filler
const extractJSON = (content, fallback) => {
    try {
        const text = content || '';
        // Use regex to aggressively hunt down the first code block that looks like JSON
        const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
        if (match && match[1]) {
            return JSON.parse(match[1].trim());
        }
        // If no code block, just attempt parsing the raw string
        return JSON.parse(text.trim());
    }
    catch (e) {
        console.error('Failed to parse LLM JSON:', content);
        return JSON.parse(fallback);
    }
};
// ==========================================
// AI Features
// ==========================================
const analyzeResumeAI = async (resumeData) => {
    try {
        const content = await askOllama([
            {
                role: 'system',
                content: 'You are an elite corporate hiring director and ATS scanning system. Analyze the provided resume (which can be either a structured JSON object or plain text) and return a JSON object with: { "score": number, "keywordScore": number, "skillsScore": number, "experienceScore": number, "educationScore": number, "formattingScore": number, "missingKeywords": string[], "layoutRating": string, "contentSuggestions": string[], "optimizedSummary": string, "skillSuggestions": string[], "predictedJobs": string[] }. Ensure keywordScore is out of 40, skillsScore is out of 25, experienceScore is out of 15, educationScore is out of 10, and formattingScore is out of 10. The sum of these sub-scores must equal the overall score (which is out of 100). The predictedJobs list should contain 3-5 developer or software engineering roles matching this candidate\'s skills.'
            },
            {
                role: 'user',
                content: JSON.stringify(resumeData)
            }
        ], 'json');
        return extractJSON(content, '{}');
    }
    catch (error) {
        console.error('[AI Service] Ollama Resume Error:', error);
        throw error;
    }
};
exports.analyzeResumeAI = analyzeResumeAI;
const getInterviewQuestionAI = async (type, roleTopic, history) => {
    try {
        const formattedMessages = history.map(h => ({
            role: h.role === 'ai' ? 'assistant' : 'user',
            content: h.text
        }));
        const content = await askOllama([
            {
                role: 'system',
                content: `You are an expert AI interviewer conducting a ${type} interview for the ${roleTopic} role. Ask professional, context-appropriate questions. Follow up logically on the user's answers. Ask only one concise question at a time.`
            },
            ...formattedMessages
        ]);
        return content || '';
    }
    catch (error) {
        console.error('[AI Service] Ollama Interview Error:', error);
        throw error;
    }
};
exports.getInterviewQuestionAI = getInterviewQuestionAI;
const gradeInterviewAI = async (type, roleTopic, transcript) => {
    try {
        const content = await askOllama([
            {
                role: 'system',
                content: 'You are an elite corporate interviewer. Evaluate the provided interview transcript and grade the candidate. Return a JSON object with: { "scores": { "technical": number, "communication": number, "confidence": number, "overall": number }, "feedback": { "strengths": string[], "weaknesses": string[], "suggestions": string[], "detailedAnalysis": string } }.'
            },
            {
                role: 'user',
                content: JSON.stringify({ type, roleTopic, transcript })
            }
        ], 'json');
        return extractJSON(content, '{}');
    }
    catch (error) {
        console.error('[AI Service] Ollama Grading Error:', error);
        throw error;
    }
};
exports.gradeInterviewAI = gradeInterviewAI;
const getCompanyRoadmapAI = async (company, role, skills) => {
    const fallbackRoadmap = {
        company: company.toUpperCase(),
        role: role.toUpperCase(),
        steps: [
            {
                title: 'Phase 1: Application Submission & ATS Screening (2026)',
                topics: ['ATS Keywords', 'Referral Network', 'Online Portals'],
                description: `Apply for the ${role} position at ${company} via their official portal or using a referral. Ensure your resume contains relevant keywords matching 2026 hiring metrics.`
            },
            {
                title: 'Phase 2: Online Technical Assessment (OA)',
                topics: ['Data Structures & Algorithms', 'Aptitude & Logic', 'Domain Quizzes'],
                description: `Complete the initial automated tests on platforms like HackerRank or SHL. Expect coding, math, and role-specific technical questions.`
            },
            {
                title: 'Phase 3: Technical & Domain Interviews',
                topics: ['Problem Solving', 'System Design / Architecture', 'Project Walkthrough'],
                description: `One or more interviews testing coding skills, computer science basics, and domain expertise relevant to ${role}.`
            },
            {
                title: 'Phase 4: HR Interview & Offer Negotiation',
                topics: ['Behavioral Scenarios', 'Salary Structure', 'Culture Fit Check'],
                description: `A standard interview discussing package details, work locations, and behavioral fit questions using the STAR methodology.`
            },
            {
                title: 'Phase 5: Background Check & Final Joining Mail',
                topics: ['Onboarding Verification', 'Document Checks', 'Onboarding Schedule'],
                description: `Complete security background verification. Once verified, you will receive the final Joining Mail containing onboarding details, date of joining, and setup instructions.`
            }
        ],
        tips: [
            `Review ${company} specific culture guidelines.`,
            `In 2026, most OAs have strict anti-cheat monitoring: ensure a stable workspace.`,
            'Prepare 2 professional projects to explain in detail.'
        ]
    };
    try {
        const skillsList = skills.length > 0 ? skills.join(', ') : 'general development and problem-solving skills';
        const content = await askOllama([
            {
                role: 'system',
                content: `You are a master career counselor and technical placement director. Create a step-by-step preparation and recruitment timeline roadmap for a student applying to a target company and role.
        
        CRITICAL INSTRUCTIONS:
        1. The roadmap MUST be a complete, chronological step-by-step guide beginning with the Initial Application and ending with receiving the final Onboarding/Joining Mail.
        2. Provide highly specific, recent recruitment information valid for the current year 2026 (e.g., mention 2026 hiring trends, online assessment platforms, coding test patterns, interview processes, document verification, and joining timelines).
        3. The language must be extremely clear, friendly, and simple for college students and freshers to easily understand.
        4. Return a JSON object matching this structure exactly:
        {
          "company": "Company Name",
          "role": "Role Name",
          "steps": [
            {
              "title": "Phase 1: Initial Application & ATS Screening",
              "topics": ["Resume Tuning", "Referral Sourcing"],
              "description": "Description explaining the application step..."
            }
          ],
          "tips": [
            "Tip 1...",
            "Tip 2..."
          ]
        }`
            },
            {
                role: 'user',
                content: `Generate a detailed step-by-step preparation and hiring roadmap for Company: "${company}", Role: "${role}", using candidate skills: "${skillsList}". Remember to include 2026 updates and cover everything up to the final joining mail.`
            }
        ], 'json');
        const roadmap = extractJSON(content, '{}');
        if (roadmap && roadmap.steps && Array.isArray(roadmap.steps) && roadmap.steps.length > 0) {
            return {
                company: (roadmap.company || company).toUpperCase(),
                role: (roadmap.role || role).toUpperCase(),
                steps: roadmap.steps,
                tips: roadmap.tips || fallbackRoadmap.tips
            };
        }
        return fallbackRoadmap;
    }
    catch (error) {
        console.error('[AI Service] Ollama Roadmap Error:', error);
        return fallbackRoadmap;
    }
};
exports.getCompanyRoadmapAI = getCompanyRoadmapAI;
const generateAptitudeQuestionsAI = async (category, limit) => {
    try {
        const content = await askOllama([
            {
                role: 'system',
                content: `You are an expert examiner. Generate exactly ${limit} multiple-choice aptitude questions for the category '${category}'. Return a JSON object with a single key 'questions' containing an array of objects. Each object must have: 'id' (a random string), 'type' (always 'aptitude'), 'category' ('${category}'), 'difficulty' (choose randomly from 'easy', 'medium', 'hard'), 'questionText' (string), 'options' (array of 4 strings), 'correctOption' (number 0-3), and 'explanation' (string explaining the answer).`
            }
        ], 'json');
        const result = extractJSON(content, '{"questions":[]}');
        return result.questions || [];
    }
    catch (error) {
        console.error('[AI Service] Ollama Aptitude Gen Error:', error);
        throw new Error('AI Model failed to generate aptitude questions. Is Ollama running?');
    }
};
exports.generateAptitudeQuestionsAI = generateAptitudeQuestionsAI;
const generateCodingChallengesAI = async (difficulty) => {
    try {
        const content = await askOllama([
            {
                role: 'system',
                content: `You are an expert coding instructor. Generate 3 coding challenges of '${difficulty}' difficulty. Return a JSON object with a key 'challenges' containing an array of objects. Each object must have: 'id' (a random string), 'type' (always 'coding'), 'category' ('algorithms'), 'difficulty' ('${difficulty}'), 'questionText' (string explaining the problem, constraints, and examples), 'codeTemplate' (string, starting boilerplate code), 'companyTags' (array of strings, e.g. ['Google', 'Amazon']), and 'testCases' (array of objects with 'input' and 'output' strings).`
            }
        ], 'json');
        const result = extractJSON(content, '{"challenges":[]}');
        return result.challenges || [];
    }
    catch (error) {
        console.error('[AI Service] Ollama Coding Gen Error:', error);
        throw new Error('AI Model failed to generate coding challenges. Is Ollama running?');
    }
};
exports.generateCodingChallengesAI = generateCodingChallengesAI;
const chatAssistantAI = async (message, history) => {
    try {
        const formattedMessages = history.map(h => ({
            role: h.role === 'ai' ? 'assistant' : 'user',
            content: h.text
        }));
        formattedMessages.push({
            role: 'user',
            content: message
        });
        const content = await askOllama([
            {
                role: 'system',
                content: `You are the PlacementAI Assistant. Keep responses concise, helpful, and focused on resume building, interview preparation, and coding practice. Do not output markdown code blocks unless necessary.`
            },
            ...formattedMessages
        ]);
        return content;
    }
    catch (error) {
        console.error('[AI Service] Ollama Chat Error:', error);
        return "I'm having trouble connecting to my AI brain right now. Please make sure Ollama is running!";
    }
};
exports.chatAssistantAI = chatAssistantAI;
const generateTechnicalQuizAI = async (role, level, excludeList, limit) => {
    try {
        const excludeString = excludeList.length > 0 ? excludeList.map(q => `"${q}"`).join(', ') : 'none';
        const content = await askOllama([
            {
                role: 'system',
                content: `You are an expert technical interviewer and examiner. Generate exactly ${limit} multiple-choice technical interview questions for the target job role '${role}' targeting experience level '${level}'. Return a JSON object with a single key 'questions' containing an array of objects. Each object must have: 'id' (a random string), 'type' (always 'technical'), 'category' ('${role}'), 'difficulty' ('${level}'), 'questionText' (string, testing core concepts of the role), 'options' (array of 4 strings), 'correctOption' (number 0-3), and 'explanation' (string explaining the answer).
        
        CRITICAL RULES:
        1. Do NOT repeat or generate questions that are highly similar to these previously asked questions unless it is an absolutely fundamental, critically important core concept for this role: ${excludeString}.
        2. Ensure the level of questions matches the chosen experience level: '${level}' (e.g. beginner level, mid-level stage, or experience level questions).`
            }
        ], 'json');
        const result = extractJSON(content, '{"questions":[]}');
        return result.questions || [];
    }
    catch (error) {
        console.error('[AI Service] Ollama Tech Quiz Gen Error:', error);
        throw new Error('AI Model failed to generate technical quiz questions. Is Ollama running?');
    }
};
exports.generateTechnicalQuizAI = generateTechnicalQuizAI;

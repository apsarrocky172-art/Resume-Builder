"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJobPosting = exports.createAptitudeOrCodingQuestion = exports.getAllUsers = exports.getDashboardStats = void 0;
const db_1 = require("../config/db");
const getDashboardStats = async (req, res) => {
    try {
        const { count: totalUsers } = await db_1.supabase.from('users').select('*', { count: 'exact', head: true });
        const { count: totalResumes } = await db_1.supabase.from('resumes').select('*', { count: 'exact', head: true });
        const { count: totalInterviews } = await db_1.supabase.from('interviews').select('*', { count: 'exact', head: true }).eq('status', 'completed');
        const { count: totalJobs } = await db_1.supabase.from('jobs').select('*', { count: 'exact', head: true });
        const { data: resumes } = await db_1.supabase.from('resumes').select('resume_score').gt('resume_score', 0);
        let averageResumeScore = 0;
        if (resumes && resumes.length > 0) {
            averageResumeScore = Math.round(resumes.reduce((acc, curr) => acc + curr.resume_score, 0) / resumes.length);
        }
        // Aggregate monthly data or dynamic categories for analytical graphs
        const companyAnalytics = [
            { name: 'TCS', placements: 45 },
            { name: 'Razorpay', placements: 28 },
            { name: 'Deloitte', placements: 34 },
            { name: 'Amazon', placements: 18 }
        ];
        res.status(200).json({
            stats: {
                totalUsers: totalUsers || 0,
                totalResumes: totalResumes || 0,
                totalInterviews: totalInterviews || 0,
                totalJobs: totalJobs || 0,
                averageResumeScore
            },
            companyAnalytics
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getDashboardStats = getDashboardStats;
const getAllUsers = async (req, res) => {
    try {
        const { data: users, error } = await db_1.supabase.from('users').select('*');
        if (error)
            throw error;
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllUsers = getAllUsers;
const createAptitudeOrCodingQuestion = async (req, res) => {
    try {
        const payload = req.body;
        const dbPayload = {
            type: payload.type,
            category: payload.category,
            difficulty: payload.difficulty,
            question_text: payload.questionText,
            options: payload.options || [],
            correct_option: payload.correctOption,
            code_template: payload.codeTemplate,
            test_cases: payload.testCases || [],
            explanation: payload.explanation,
            company_tags: payload.companyTags || []
        };
        const { data: question, error } = await db_1.supabase
            .from('questions')
            .insert([dbPayload])
            .select()
            .single();
        if (error)
            throw error;
        res.status(201).json({ message: 'Question created successfully', question });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createAptitudeOrCodingQuestion = createAptitudeOrCodingQuestion;
const createJobPosting = async (req, res) => {
    try {
        const payload = req.body;
        const dbPayload = {
            title: payload.title,
            company: payload.company,
            location: payload.location,
            type: payload.type,
            salary: payload.salary,
            description: payload.description,
            skills_required: payload.skillsRequired || [],
            link: payload.link
        };
        const { data: job, error } = await db_1.supabase
            .from('jobs')
            .insert([dbPayload])
            .select()
            .single();
        if (error)
            throw error;
        res.status(201).json({ message: 'Job posting added successfully', job });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createJobPosting = createJobPosting;

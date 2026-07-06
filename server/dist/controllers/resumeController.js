"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeResume = exports.getResume = exports.saveOrUpdateResume = void 0;
const db_1 = require("../config/db");
const ai_1 = require("../config/ai");
const mapToDb = (data, userId) => ({
    user_id: userId,
    template_id: data.templateId || 'modern',
    personal_info: data.personalInfo || {},
    education: data.education || [],
    experience: data.experience || [],
    projects: data.projects || [],
    skills: data.skills || [],
    certifications: data.certifications || [],
    achievements: data.achievements || [],
    resume_score: data.resumeScore || 0,
    ats_feedback: data.atsFeedback || {}
});
const mapToClient = (data) => {
    if (!data)
        return null;
    return {
        id: data.id,
        userId: data.user_id,
        templateId: data.template_id,
        personalInfo: data.personal_info,
        education: data.education,
        experience: data.experience,
        projects: data.projects,
        skills: data.skills,
        certifications: data.certifications,
        achievements: data.achievements,
        resumeScore: data.resume_score,
        atsFeedback: data.ats_feedback,
        createdAt: data.created_at,
        updatedAt: data.updated_at
    };
};
const saveOrUpdateResume = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        const resumeData = req.body;
        const dbData = mapToDb(resumeData, userId);
        const { data: existing, error: fetchError } = await db_1.supabase
            .from('resumes')
            .select('id')
            .eq('user_id', userId)
            .maybeSingle();
        if (fetchError)
            throw fetchError;
        let result;
        if (existing) {
            const { data, error } = await db_1.supabase
                .from('resumes')
                .update(dbData)
                .eq('id', existing.id)
                .select()
                .single();
            if (error)
                throw error;
            result = data;
        }
        else {
            const { data, error } = await db_1.supabase
                .from('resumes')
                .insert([dbData])
                .select()
                .single();
            if (error)
                throw error;
            result = data;
        }
        // Update user's skills list
        if (resumeData.skills && Array.isArray(resumeData.skills)) {
            await db_1.supabase
                .from('users')
                .update({ skills: resumeData.skills })
                .eq('id', userId);
        }
        res.status(200).json(mapToClient(result));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.saveOrUpdateResume = saveOrUpdateResume;
const getResume = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        const { data, error } = await db_1.supabase
            .from('resumes')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();
        if (error)
            throw error;
        if (!data) {
            return res.status(404).json({ message: 'No resume found for this user' });
        }
        res.status(200).json(mapToClient(data));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getResume = getResume;
const analyzeResume = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        const { resumeText } = req.body;
        if (resumeText) {
            // Analyze the raw external resume text directly
            const analysis = await (0, ai_1.analyzeResumeAI)({ rawText: resumeText });
            const score = typeof analysis.score === 'number' ? analysis.score : 0;
            let keywordScore = typeof analysis.keywordScore === 'number' ? analysis.keywordScore : Math.round(score * 0.40);
            let skillsScore = typeof analysis.skillsScore === 'number' ? analysis.skillsScore : Math.round(score * 0.25);
            let experienceScore = typeof analysis.experienceScore === 'number' ? analysis.experienceScore : Math.round(score * 0.15);
            let educationScore = typeof analysis.educationScore === 'number' ? analysis.educationScore : Math.round(score * 0.10);
            let formattingScore = typeof analysis.formattingScore === 'number' ? analysis.formattingScore : Math.round(score * 0.10);
            const sum = keywordScore + skillsScore + experienceScore + educationScore + formattingScore;
            if (sum !== score) {
                const diff = score - sum;
                keywordScore += diff;
                if (keywordScore > 40) {
                    skillsScore += (keywordScore - 40);
                    keywordScore = 40;
                }
                else if (keywordScore < 0) {
                    skillsScore += keywordScore;
                    keywordScore = 0;
                }
            }
            const atsFeedback = {
                score: score,
                missingKeywords: analysis.missingKeywords || [],
                layoutRating: analysis.layoutRating || 'Good',
                contentSuggestions: analysis.contentSuggestions || [],
                optimizedSummary: analysis.optimizedSummary || '',
                skillSuggestions: analysis.skillSuggestions || [],
                keywordScore,
                skillsScore,
                experienceScore,
                educationScore,
                formattingScore,
                predictedJobs: analysis.predictedJobs || ['Software Engineer', 'Full Stack Developer', 'Frontend Engineer']
            };
            return res.status(200).json({
                message: 'ATS External Analysis complete!',
                atsFeedback,
                resumeScore: score
            });
        }
        const { data: resume, error } = await db_1.supabase
            .from('resumes')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();
        if (error)
            throw error;
        if (!resume) {
            return res.status(404).json({ message: 'Please create and save your resume before analyzing' });
        }
        const clientResume = mapToClient(resume);
        const analysis = await (0, ai_1.analyzeResumeAI)(clientResume);
        const score = typeof analysis.score === 'number' ? analysis.score : 0;
        // Extract sub-scores with math-safe defaults
        let keywordScore = typeof analysis.keywordScore === 'number' ? analysis.keywordScore : Math.round(score * 0.40);
        let skillsScore = typeof analysis.skillsScore === 'number' ? analysis.skillsScore : Math.round(score * 0.25);
        let experienceScore = typeof analysis.experienceScore === 'number' ? analysis.experienceScore : Math.round(score * 0.15);
        let educationScore = typeof analysis.educationScore === 'number' ? analysis.educationScore : Math.round(score * 0.10);
        let formattingScore = typeof analysis.formattingScore === 'number' ? analysis.formattingScore : Math.round(score * 0.10);
        // Adjust any rounding mismatch to guarantee sum equals overall score exactly
        const sum = keywordScore + skillsScore + experienceScore + educationScore + formattingScore;
        if (sum !== score) {
            const diff = score - sum;
            keywordScore += diff;
            if (keywordScore > 40) {
                skillsScore += (keywordScore - 40);
                keywordScore = 40;
            }
            else if (keywordScore < 0) {
                skillsScore += keywordScore;
                keywordScore = 0;
            }
        }
        const atsFeedback = {
            score: score,
            missingKeywords: analysis.missingKeywords || [],
            layoutRating: analysis.layoutRating || 'Good',
            contentSuggestions: analysis.contentSuggestions || [],
            optimizedSummary: analysis.optimizedSummary || '',
            skillSuggestions: analysis.skillSuggestions || [],
            keywordScore,
            skillsScore,
            experienceScore,
            educationScore,
            formattingScore,
            predictedJobs: analysis.predictedJobs || ['Software Engineer', 'Full Stack Developer', 'Frontend Engineer']
        };
        const { data: updated, error: updateError } = await db_1.supabase
            .from('resumes')
            .update({
            resume_score: score,
            ats_feedback: atsFeedback
        })
            .eq('id', resume.id)
            .select()
            .single();
        if (updateError)
            throw updateError;
        res.status(200).json({
            message: 'ATS Analysis complete!',
            atsFeedback: updated.ats_feedback,
            resumeScore: updated.resume_score
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.analyzeResume = analyzeResume;

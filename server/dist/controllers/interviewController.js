"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.finalizeInterview = exports.chatInterview = exports.startInterview = void 0;
const db_1 = require("../config/db");
const ai_1 = require("../config/ai");
const startInterview = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { type, roleTopic } = req.body; // type: 'hr' | 'technical' | 'behavioral' | 'system-design'
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        if (!type || !roleTopic) {
            return res.status(400).json({ message: 'Interview type and role topic are required' });
        }
        const firstQuestion = await (0, ai_1.getInterviewQuestionAI)(type, roleTopic, []);
        const { data: interview, error } = await db_1.supabase
            .from('interviews')
            .insert([
            {
                user_id: userId,
                type,
                role_topic: roleTopic,
                transcript: [{ role: 'ai', text: firstQuestion }],
                status: 'in-progress'
            }
        ])
            .select()
            .single();
        if (error)
            throw error;
        res.status(200).json({
            interviewId: interview.id,
            question: firstQuestion
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.startInterview = startInterview;
const chatInterview = async (req, res) => {
    try {
        const { interviewId, text } = req.body;
        if (!interviewId || !text) {
            return res.status(400).json({ message: 'interviewId and text are required' });
        }
        const { data: interview, error: fetchError } = await db_1.supabase
            .from('interviews')
            .select('*')
            .eq('id', interviewId)
            .single();
        if (fetchError || !interview || interview.status !== 'in-progress') {
            return res.status(404).json({ message: 'Active interview session not found' });
        }
        // Push User statement to transcript
        const newTranscript = [...(interview.transcript || []), { role: 'user', text }];
        // Generate Follow-up
        const nextQuestion = await (0, ai_1.getInterviewQuestionAI)(interview.type, interview.role_topic, newTranscript);
        // Push AI question to transcript
        newTranscript.push({ role: 'ai', text: nextQuestion });
        const { error: updateError } = await db_1.supabase
            .from('interviews')
            .update({ transcript: newTranscript })
            .eq('id', interviewId);
        if (updateError)
            throw updateError;
        res.status(200).json({
            question: nextQuestion
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.chatInterview = chatInterview;
const finalizeInterview = async (req, res) => {
    try {
        const { interviewId } = req.body;
        if (!interviewId) {
            return res.status(400).json({ message: 'interviewId is required' });
        }
        const { data: interview, error: fetchError } = await db_1.supabase
            .from('interviews')
            .select('*')
            .eq('id', interviewId)
            .single();
        if (fetchError || !interview) {
            return res.status(404).json({ message: 'Interview session not found' });
        }
        // Call LLM grader
        const grading = await (0, ai_1.gradeInterviewAI)(interview.type, interview.role_topic, interview.transcript);
        const { data: updated, error: updateError } = await db_1.supabase
            .from('interviews')
            .update({
            scores: grading.scores,
            feedback: grading.feedback,
            status: 'completed'
        })
            .eq('id', interviewId)
            .select()
            .single();
        if (updateError)
            throw updateError;
        res.status(200).json({
            message: 'Interview evaluated successfully',
            scores: updated.scores,
            feedback: updated.feedback,
            transcript: updated.transcript
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.finalizeInterview = finalizeInterview;

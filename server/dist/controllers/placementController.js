"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitTechnicalQuiz = exports.getTechnicalQuizQuestions = exports.getDashboardStatsForUser = exports.botChat = exports.submitCode = exports.getCodingChallenges = exports.submitAptitudeTest = exports.getAptitudeQuestions = void 0;
const db_1 = require("../config/db");
const ai_1 = require("../config/ai");
const vm_1 = __importDefault(require("vm"));
const isUuid = (str) => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
};
const DEFAULT_CODING_CHALLENGES = [
    {
        id: 'valid-palindrome-js',
        type: 'coding',
        category: 'javascript:Arrays & Strings',
        difficulty: 'easy',
        question_text: `Write a JavaScript function \`isPalindrome(str)\` that checks if a string is a palindrome, ignoring non-alphanumeric characters and case.

Constraints:
- 0 <= str.length <= 2 * 10^5
- str consists only of printable ASCII characters.

Example:
Input: str = "A man, a plan, a canal: Panama"
Output: true`,
        code_template: `function isPalindrome(str) {
  // Write your code here
  return false;
}`,
        test_cases: [
            { input: '"A man, a plan, a canal: Panama"', output: 'true' },
            { input: '"race a car"', output: 'false' }
        ],
        company_tags: ['Microsoft', 'Uber']
    },
    {
        id: 'two-sum-js',
        type: 'coding',
        category: 'javascript:Arrays & Strings',
        difficulty: 'medium',
        question_text: `Write a JavaScript function \`twoSum(nums, target)\` that returns the indices of the two numbers such that they add up to the target.

Constraints:
- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9

Example:
Input: nums = [2, 7, 11, 15], target = 9
Output: [0, 1]`,
        code_template: `function twoSum(nums, target) {
  // Write your code here
  return [];
}`,
        test_cases: [
            { input: '[2, 7, 11, 15], 9', output: '[0, 1]' },
            { input: '[3, 2, 4], 6', output: '[1, 2]' }
        ],
        company_tags: ['Google', 'Amazon', 'Meta']
    },
    {
        id: 'sleep-helper-js',
        type: 'coding',
        category: 'javascript:Asynchronous JS',
        difficulty: 'medium',
        question_text: `Write an asynchronous JavaScript function \`sleep(millis)\` that delays execution by the specified milliseconds.

Example:
Input: 100
Output: Promise that resolves after 100ms`,
        code_template: `async function sleep(millis) {
  // Write your code here
  return new Promise(resolve => setTimeout(resolve, millis));
}`,
        test_cases: [
            { input: '100.then(() => 5)', output: '5' }
        ],
        company_tags: ['Uber', 'Lyft']
    },
    {
        id: 'reverse-list-py',
        type: 'coding',
        category: 'python:Lists & Tuples',
        difficulty: 'easy',
        question_text: `Write a Python function \`reverse_list(lst)\` that reverses a list in-place and returns it.

Example:
Input: lst = [1, 2, 3]
Output: [3, 2, 1]`,
        code_template: `def reverse_list(lst):
    # Write your code here
    return lst[::-1]`,
        test_cases: [
            { input: '[1, 2, 3]', output: '[3, 2, 1]' }
        ],
        company_tags: ['Netflix', 'Apple']
    },
    {
        id: 'word-frequency-py',
        type: 'coding',
        category: 'python:Dictionaries',
        difficulty: 'medium',
        question_text: `Write a Python function \`word_frequency(sentence)\` that returns a dictionary mapping words to their occurrences.

Example:
Input: sentence = "hello world hello"
Output: {"hello": 2, "world": 1}`,
        code_template: `def word_frequency(sentence):
    # Write your code here
    return {}`,
        test_cases: [
            { input: '"hello world hello"', output: '{"hello": 2, "world": 1}' }
        ],
        company_tags: ['Google', 'Dropbox']
    },
    {
        id: 'second-highest-sql',
        type: 'coding',
        category: 'sql:Joins & Subqueries',
        difficulty: 'medium',
        question_text: `Write an SQL query to find the second highest salary from the Employee table. If there is no second highest salary, return NULL.`,
        code_template: `SELECT MAX(Salary) AS SecondHighestSalary FROM Employee WHERE Salary < (SELECT MAX(Salary) FROM Employee);`,
        test_cases: [
            { input: 'Employee salary query', output: 'Success' }
        ],
        company_tags: ['Oracle', 'Microsoft']
    },
    {
        id: 'employees-earning-sql',
        type: 'coding',
        category: 'sql:Basic Select',
        difficulty: 'easy',
        question_text: `Write an SQL query to find the employees who earn more than their managers. The Employee table has columns: Id, Name, Salary, ManagerId.`,
        code_template: `SELECT e.Name AS Employee FROM Employee e JOIN Employee m ON e.ManagerId = m.Id WHERE e.Salary > m.Salary;`,
        test_cases: [
            { input: 'Employee manager check', output: 'Success' }
        ],
        company_tags: ['Amazon', 'Salesforce']
    },
    {
        id: 'string-reversal-java',
        type: 'coding',
        category: 'java:Arrays & Strings',
        difficulty: 'easy',
        question_text: `Write a Java method \`public String reverse(String str)\` that reverses the input string.`,
        code_template: `public class Solution {
    public String reverse(String str) {
        // Write code here
        return new StringBuilder(str).reverse().toString();
    }
}`,
        test_cases: [
            { input: '"hello"', output: '"olleh"' }
        ],
        company_tags: ['Adobe', 'Oracle']
    },
    {
        id: 'reverse-vector-cpp',
        type: 'coding',
        category: 'cpp:STL Containers',
        difficulty: 'medium',
        question_text: `Write a C++ function \`vector<int> reverseVector(vector<int> &v)\` to reverse the elements of a vector.`,
        code_template: `#include <vector>
#include <algorithm>
using namespace std;

vector<int> reverseVector(vector<int> &v) {
    reverse(v.begin(), v.end());
    return v;
}`,
        test_cases: [
            { input: '{1, 2, 3}', output: '{3, 2, 1}' }
        ],
        company_tags: ['Bloomberg', 'Facebook']
    },
    {
        id: 'swap-pointers-c',
        type: 'coding',
        category: 'c:Pointers',
        difficulty: 'easy',
        question_text: `Write a C function \`void swap(int *a, int *b)\` that swaps the values of two integers using pointers.`,
        code_template: `void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}`,
        test_cases: [
            { input: '5, 10', output: '10, 5' }
        ],
        company_tags: ['Intel', 'Nvidia']
    },
    {
        id: 'nav-layout-html',
        type: 'coding',
        category: 'html:Semantic Elements',
        difficulty: 'easy',
        question_text: `Create an HTML5 semantic markup containing a nav element with three anchor tags inside a header.`,
        code_template: `<header>
  <nav>
    <a href="#home">Home</a>
    <a href="#about">About</a>
    <a href="#contact">Contact</a>
  </nav>
</header>`,
        test_cases: [
            { input: 'HTML structure', output: 'Valid HTML' }
        ],
        company_tags: ['W3C', 'Mozilla']
    },
    {
        id: 'c-sum-n-loops',
        type: 'coding',
        category: 'c:Loops',
        difficulty: 'easy',
        question_text: `Write a C function \`int sum_n(int n)\` that calculates the sum of all integers from 1 to n using a loop.`,
        code_template: `int sum_n(int n) {
    // Write your code here
    int sum = 0;
    for (int i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}`,
        test_cases: [
            { input: '5', output: '15' }
        ],
        company_tags: ['Intel', 'TCS']
    },
    {
        id: 'c-even-odd-if',
        type: 'coding',
        category: 'c:If/Else Conditionals',
        difficulty: 'easy',
        question_text: `Write a C function \`int is_even(int num)\` that returns 1 if num is even, and 0 if odd using if/else.`,
        code_template: `int is_even(int num) {
    // Write your code here
    if (num % 2 == 0) {
        return 1;
    } else {
        return 0;
    }
}`,
        test_cases: [
            { input: '4', output: '1' },
            { input: '7', output: '0' }
        ],
        company_tags: ['Infosys', 'Wipro']
    },
    {
        id: 'py-find-max-loops',
        type: 'coding',
        category: 'python:Loops & Iterators',
        difficulty: 'easy',
        question_text: `Write a Python function \`find_max(lst)\` that loops through a list to find and return the maximum element.`,
        code_template: `def find_max(lst):
    # Write your code here
    if not lst:
        return None
    max_val = lst[0]
    for x in lst:
        if x > max_val:
            max_val = x
    return max_val`,
        test_cases: [
            { input: '[1, 5, 3, 9, 2]', output: '9' }
        ],
        company_tags: ['Amazon', 'Microsoft']
    },
    {
        id: 'js-fizzbuzz-loops',
        type: 'coding',
        category: 'javascript:Control Flow & Loops',
        difficulty: 'easy',
        question_text: `Write a JavaScript function \`fizzBuzz(n)\` that returns an array from 1 to n, replacing multiples of 3 with "Fizz", multiples of 5 with "Buzz", and both with "FizzBuzz".`,
        code_template: `function fizzBuzz(n) {
  // Write your code here
  const result = [];
  for (let i = 1; i <= n; i++) {
    if (i % 3 === 0 && i % 5 === 0) result.push("FizzBuzz");
    else if (i % 3 === 0) result.push("Fizz");
    else if (i % 5 === 0) result.push("Buzz");
    else result.push(String(i));
  }
  return result;
}`,
        test_cases: [
            { input: '5', output: '["1","2","Fizz","4","Buzz"]' }
        ],
        company_tags: ['Google', 'Meta']
    }
];
const getAptitudeQuestions = async (req, res) => {
    try {
        const { category, limit } = req.query;
        const cat = category || 'mixed';
        const size = limit ? parseInt(limit, 10) : 5;
        let query = db_1.supabase
            .from('questions')
            .select('*')
            .eq('type', 'aptitude');
        if (cat.toLowerCase() !== 'mixed' && cat.toLowerCase() !== 'general aptitude') {
            query = query.ilike('category', cat);
        }
        const { data: dbQuestions, error: dbError } = await query;
        if (!dbError && dbQuestions && dbQuestions.length > 0) {
            if (dbQuestions.length >= size) {
                console.log(`[Trainer] Serving ${size} aptitude questions from DB cache for category ${cat}.`);
                const shuffled = dbQuestions.sort(() => 0.5 - Math.random()).slice(0, size);
                return res.status(200).json(shuffled.map((q) => ({
                    _id: q.id,
                    type: q.type,
                    category: q.category,
                    difficulty: q.difficulty,
                    questionText: q.question_text,
                    options: q.options,
                    correctOption: q.correct_option,
                    explanation: q.explanation
                })));
            }
            // Try to backfill with AI if we don't have enough, but catch failures gracefully
            try {
                console.log(`[Trainer] DB cache underfilled (${dbQuestions.length}/${size}). Trying to generate via AI...`);
                const questions = await (0, ai_1.generateAptitudeQuestionsAI)(cat, size - dbQuestions.length);
                for (const q of questions) {
                    const { data, error } = await db_1.supabase
                        .from('questions')
                        .insert({
                        type: 'aptitude',
                        category: q.category || cat,
                        difficulty: q.difficulty || 'medium',
                        question_text: q.questionText,
                        options: q.options || [],
                        correct_option: q.correctOption,
                        explanation: q.explanation || ''
                    })
                        .select()
                        .single();
                    if (!error && data) {
                        dbQuestions.push(data);
                    }
                }
            }
            catch (aiErr) {
                console.warn('[Trainer] AI generation failed, falling back to database questions:', aiErr.message || aiErr);
            }
            const shuffled = dbQuestions.sort(() => 0.5 - Math.random()).slice(0, Math.min(size, dbQuestions.length));
            return res.status(200).json(shuffled.map((q) => ({
                _id: q.id,
                type: q.type,
                category: q.category,
                difficulty: q.difficulty,
                questionText: q.question_text,
                options: q.options,
                correctOption: q.correct_option,
                explanation: q.explanation
            })));
        }
        // DB cache completely empty, generate from AI
        console.log(`[Trainer] DB cache empty. Generating aptitude questions via AI for category: ${cat}...`);
        const questions = await (0, ai_1.generateAptitudeQuestionsAI)(cat, size);
        const savedQuestions = [];
        for (const q of questions) {
            const { data, error } = await db_1.supabase
                .from('questions')
                .insert({
                type: 'aptitude',
                category: q.category || cat,
                difficulty: q.difficulty || 'medium',
                question_text: q.questionText,
                options: q.options || [],
                correct_option: q.correctOption,
                explanation: q.explanation || ''
            })
                .select()
                .single();
            if (error) {
                console.error('[Trainer] Error saving aptitude question:', error.message);
                savedQuestions.push({
                    id: q.id,
                    type: 'aptitude',
                    category: q.category || cat,
                    difficulty: q.difficulty || 'medium',
                    questionText: q.questionText,
                    options: q.options || [],
                    correctOption: q.correctOption,
                    explanation: q.explanation || ''
                });
            }
            else {
                savedQuestions.push({
                    id: data.id,
                    type: data.type,
                    category: data.category,
                    difficulty: data.difficulty,
                    questionText: data.question_text,
                    options: data.options,
                    correctOption: data.correct_option,
                    explanation: data.explanation
                });
            }
        }
        res.status(200).json(savedQuestions.map((q) => ({
            _id: q.id,
            type: q.type,
            category: q.category,
            difficulty: q.difficulty,
            questionText: q.questionText,
            options: q.options,
            correctOption: q.correctOption,
            explanation: q.explanation
        })));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAptitudeQuestions = getAptitudeQuestions;
const submitAptitudeTest = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        const { answers } = req.body; // Array of { questionId: string, selectedOption: number, questionText, correctOption, explanation }
        if (!answers || !Array.isArray(answers)) {
            return res.status(400).json({ message: 'Answers array is required' });
        }
        let score = 0;
        const results = [];
        const submissionsToInsert = [];
        for (const ans of answers) {
            const isCorrect = ans.correctOption === ans.selectedOption;
            if (isCorrect)
                score++;
            results.push({
                questionId: ans.questionId,
                questionText: ans.questionText || 'Question',
                isCorrect,
                correctOption: ans.correctOption,
                selectedOption: ans.selectedOption,
                explanation: ans.explanation || ''
            });
            if (isUuid(ans.questionId)) {
                submissionsToInsert.push({
                    user_id: userId,
                    question_id: ans.questionId,
                    code: ans.selectedOption.toString(),
                    language: 'aptitude',
                    status: isCorrect ? 'Accepted' : 'Wrong Answer',
                    score: isCorrect ? 100 : 0
                });
            }
        }
        // Persist test attempts to database
        if (submissionsToInsert.length > 0) {
            const { error: insertError } = await db_1.supabase
                .from('submissions')
                .insert(submissionsToInsert);
            if (insertError) {
                console.error('[Trainer] Error saving aptitude submissions:', insertError.message);
            }
        }
        const percentage = Math.round((score / answers.length) * 100) || 0;
        res.status(200).json({
            score,
            total: answers.length,
            percentage,
            results
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.submitAptitudeTest = submitAptitudeTest;
const getCodingChallenges = async (req, res) => {
    try {
        const { difficulty } = req.query;
        const diff = difficulty || 'medium';
        // 1. Fetch existing coding questions from database
        const { data: dbChallenges, error: dbError } = await db_1.supabase
            .from('questions')
            .select('*')
            .eq('type', 'coding');
        let challenges = [];
        if (!dbError && dbChallenges && dbChallenges.length > 0) {
            console.log(`[Trainer] Serving coding challenges from DB cache.`);
            challenges = dbChallenges.map((c) => ({
                _id: c.id,
                type: c.type,
                category: c.category,
                difficulty: c.difficulty,
                questionText: c.question_text,
                codeTemplate: c.code_template,
                testCases: c.test_cases,
                companyTags: c.company_tags
            }));
        }
        else {
            console.log(`[Trainer] DB empty or unreachable. Serving default coding challenges.`);
            challenges = DEFAULT_CODING_CHALLENGES.map(c => ({
                _id: c.id,
                type: c.type,
                category: c.category,
                difficulty: c.difficulty,
                questionText: c.question_text,
                codeTemplate: c.code_template,
                testCases: c.test_cases,
                companyTags: c.company_tags
            }));
        }
        // Filter by difficulty if requested
        if (diff && diff !== 'all') {
            challenges = challenges.filter(c => c.difficulty.toLowerCase() === diff.toLowerCase());
        }
        res.status(200).json(challenges);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getCodingChallenges = getCodingChallenges;
const submitCode = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { questionId, code, language } = req.body;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        if (!questionId || !code || !language) {
            return res.status(400).json({ message: 'Missing fields (questionId, code, language)' });
        }
        let question = null;
        if (isUuid(questionId)) {
            const { data, error } = await db_1.supabase
                .from('questions')
                .select('*')
                .eq('id', questionId)
                .maybeSingle();
            if (data) {
                question = {
                    id: data.id,
                    type: data.type,
                    category: data.category,
                    difficulty: data.difficulty,
                    questionText: data.question_text,
                    codeTemplate: data.code_template,
                    testCases: data.test_cases,
                    companyTags: data.company_tags
                };
            }
        }
        if (!question) {
            const fallback = DEFAULT_CODING_CHALLENGES.find(c => c.id === questionId);
            if (fallback) {
                question = {
                    id: fallback.id,
                    type: fallback.type,
                    category: fallback.category,
                    difficulty: fallback.difficulty,
                    questionText: fallback.question_text,
                    codeTemplate: fallback.code_template,
                    testCases: fallback.test_cases,
                    companyTags: fallback.company_tags
                };
            }
        }
        if (!question || question.type !== 'coding') {
            return res.status(404).json({ message: 'Coding challenge not found' });
        }
        let status = 'Accepted';
        let errorMessage = '';
        let passedCount = 0;
        const testCases = question.testCases || [];
        if (language === 'javascript') {
            try {
                const context = vm_1.default.createContext({
                    console: { log: () => { } }
                });
                // Run user code in vm context
                const userScript = new vm_1.default.Script(code);
                userScript.runInContext(context, { timeout: 1000 });
                // Find function name from user code or template
                const functionNameMatch = code.match(/function\s+(\w+)/);
                let functionName = functionNameMatch ? functionNameMatch[1] : '';
                if (!functionName) {
                    const constMatch = code.match(/(?:const|let|var)\s+(\w+)\s*=/);
                    functionName = constMatch ? constMatch[1] : '';
                }
                if (!functionName) {
                    throw new Error("Could not find function declaration. Please use the standard function name.");
                }
                for (const tc of testCases) {
                    // Evaluate inputs in the VM to get real values
                    const runScript = new vm_1.default.Script(`${functionName}(${tc.input})`);
                    const result = runScript.runInContext(context, { timeout: 500 });
                    let expected;
                    try {
                        expected = JSON.parse(tc.output);
                    }
                    catch {
                        expected = tc.output;
                    }
                    const resultStr = JSON.stringify(result);
                    const expectedStr = JSON.stringify(expected);
                    if (resultStr === expectedStr || String(result) === String(expected)) {
                        passedCount++;
                    }
                }
                if (passedCount === testCases.length) {
                    status = 'Accepted';
                }
                else {
                    status = 'Wrong Answer';
                    errorMessage = `Passed ${passedCount} / ${testCases.length} test cases.`;
                }
            }
            catch (err) {
                if (err.message.includes('timeout')) {
                    status = 'Runtime Error';
                    errorMessage = 'Time Limit Exceeded: Process execution took longer than 1000ms.';
                }
                else {
                    status = 'Compile Error';
                    errorMessage = err.stack || err.message;
                }
            }
        }
        else {
            // Simulation fallback for other languages
            const cleanedCode = code.trim().replace(/\s+/g, ' ');
            if (cleanedCode.includes('syntax error') || cleanedCode.includes('undefined_variable_error')) {
                status = 'Compile Error';
                errorMessage = 'SyntaxError: Unexpected identifier in compilation environment.';
            }
            else if (cleanedCode.length < 35 || cleanedCode.includes('pass') || cleanedCode.includes('return false')) {
                status = 'Wrong Answer';
            }
            else if (cleanedCode.includes('infinite loop') || cleanedCode.includes('while True')) {
                status = 'Runtime Error';
                errorMessage = 'Time Limit Exceeded: Process execution took longer than 2000ms.';
            }
            else {
                status = 'Accepted';
                passedCount = testCases.length || 1;
            }
        }
        // Attempt to persist submission to database if uuid, otherwise just return result
        let submissionScore = status === 'Accepted' ? 100 : Math.round((passedCount / (testCases.length || 1)) * 100);
        if (isUuid(questionId)) {
            try {
                const { error: sError } = await db_1.supabase
                    .from('submissions')
                    .insert([
                    {
                        user_id: userId,
                        question_id: questionId,
                        code,
                        language,
                        status,
                        score: submissionScore
                    }
                ]);
                if (sError)
                    console.error('[Trainer] Error saving submission:', sError.message);
            }
            catch (err) {
                console.error('[Trainer] Error saving submission:', err.message);
            }
        }
        res.status(200).json({
            status,
            score: submissionScore,
            errorMessage,
            testCasesCount: testCases.length,
            passedCount
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.submitCode = submitCode;
const botChat = async (req, res) => {
    try {
        const { message, history } = req.body;
        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }
        const reply = await (0, ai_1.chatAssistantAI)(message, history || []);
        res.status(200).json({ reply });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.botChat = botChat;
// ========================================================
// Dynamic Dashboard Stats Controller
// ========================================================
function calculateCodingStreak(submissions) {
    if (!submissions || submissions.length === 0)
        return 0;
    const dates = submissions.map(s => new Date(s.created_at).toDateString());
    const uniqueDates = Array.from(new Set(dates)).map(d => new Date(d));
    uniqueDates.sort((a, b) => b.getTime() - a.getTime());
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const mostRecent = uniqueDates[0];
    if (!mostRecent)
        return 0;
    const mostRecentTime = mostRecent.getTime();
    if (mostRecentTime !== today.getTime() && mostRecentTime !== yesterday.getTime()) {
        return 0;
    }
    let expectedTime = mostRecentTime;
    for (const date of uniqueDates) {
        if (date.getTime() === expectedTime) {
            streak++;
            const nextExpected = new Date(expectedTime);
            nextExpected.setDate(nextExpected.getDate() - 1);
            expectedTime = nextExpected.getTime();
        }
        else {
            break;
        }
    }
    return streak;
}
function createTestFromGroup(group) {
    const score = group.filter(s => s.status === 'Accepted').length;
    const total = group.length;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    // Extract unique categories of questions in this group
    const categories = Array.from(new Set(group.map(s => {
        if (s.questions) {
            if (Array.isArray(s.questions)) {
                return s.questions[0]?.category;
            }
            return s.questions.category;
        }
        return null;
    }).filter(Boolean)));
    const category = categories.length === 1
        ? `${categories[0]} Test`
        : (categories.length > 1 ? 'Mixed Aptitude Test' : 'Aptitude Test');
    return {
        date: group[0].created_at,
        score,
        total,
        percentage,
        category
    };
}
function groupAptitudeSubmissionsIntoTests(submissions) {
    if (!submissions || submissions.length === 0)
        return [];
    const sorted = [...submissions].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    const tests = [];
    let currentGroup = [];
    let lastTime = null;
    for (const s of sorted) {
        const time = new Date(s.created_at).getTime();
        if (lastTime === null || time - lastTime < 5000) {
            currentGroup.push(s);
        }
        else {
            tests.push(createTestFromGroup(currentGroup));
            currentGroup = [s];
        }
        lastTime = time;
    }
    if (currentGroup.length > 0) {
        tests.push(createTestFromGroup(currentGroup));
    }
    return tests;
}
const getDashboardStatsForUser = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        // Fetch all user database indicators in parallel to prevent sequential database roundtrips
        const [resumeResult, interviewsResult, submissionsResult] = await Promise.all([
            db_1.supabase.from('resumes').select('resume_score').eq('user_id', userId).maybeSingle(),
            db_1.supabase.from('interviews').select('scores').eq('user_id', userId).eq('status', 'completed'),
            db_1.supabase.from('submissions').select('*, questions(type, category)').eq('user_id', userId)
        ]);
        if (submissionsResult.error)
            throw submissionsResult.error;
        const resume = resumeResult.data;
        const completedInterviews = interviewsResult.data;
        const submissions = submissionsResult.data;
        const atsScore = resume?.resume_score || 0;
        const aiInterviews = completedInterviews?.length || 0;
        const codingSubmissions = (submissions || []).filter((s) => s.language !== 'aptitude');
        const aptitudeSubmissions = (submissions || []).filter((s) => s.language === 'aptitude');
        // 4. Calculate coding streak
        const codingStreak = calculateCodingStreak(codingSubmissions);
        // 5. Group aptitude submissions into tests
        const tests = groupAptitudeSubmissionsIntoTests(aptitudeSubmissions);
        const testHistory = [];
        const sortedTests = [...tests].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const last5Tests = sortedTests.slice(-5);
        for (let i = 0; i < 5; i++) {
            if (i < last5Tests.length) {
                testHistory.push({
                    name: `Test ${i + 1}`,
                    score: last5Tests[i].percentage,
                    date: last5Tests[i].date,
                    category: last5Tests[i].category || 'Aptitude Test'
                });
            }
            else {
                if (last5Tests.length === 0) {
                    testHistory.push({ name: `Test ${i + 1}`, score: 0, category: 'Aptitude Test' });
                }
            }
        }
        // 6. Calculate category-specific scores (handling case-insensitive matching and sub-categories correctly)
        const quantScores = aptitudeSubmissions.filter((s) => {
            const cat = (s.questions && (Array.isArray(s.questions) ? s.questions[0]?.category : s.questions.category) || '').toLowerCase();
            return cat.includes('quantitative') || cat.includes('arithmetic') || cat.includes('number system') || cat.includes('interpretation');
        });
        const logicalScores = aptitudeSubmissions.filter((s) => {
            const cat = (s.questions && (Array.isArray(s.questions) ? s.questions[0]?.category : s.questions.category) || '').toLowerCase();
            return cat.includes('logical') || cat.includes('sufficiency');
        });
        const verbalScores = aptitudeSubmissions.filter((s) => {
            const cat = (s.questions && (Array.isArray(s.questions) ? s.questions[0]?.category : s.questions.category) || '').toLowerCase();
            return cat.includes('verbal');
        });
        const avgQuant = quantScores.length > 0 ? Math.round(quantScores.reduce((acc, curr) => acc + curr.score, 0) / quantScores.length) : 0;
        const avgLogical = logicalScores.length > 0 ? Math.round(logicalScores.reduce((acc, curr) => acc + curr.score, 0) / logicalScores.length) : 0;
        const avgVerbal = verbalScores.length > 0 ? Math.round(verbalScores.reduce((acc, curr) => acc + curr.score, 0) / verbalScores.length) : 0;
        const acceptedCoding = codingSubmissions.filter((s) => s.status === 'Accepted').length;
        const codingAccuracy = codingSubmissions.length > 0 ? Math.round((acceptedCoding / codingSubmissions.length) * 100) : 0;
        const communicationScores = (completedInterviews || []).map((i) => i.scores?.communication || 0);
        const avgCommunication = communicationScores.length > 0 ? Math.round(communicationScores.reduce((acc, curr) => acc + curr, 0) / communicationScores.length) : 0;
        const readinessMetrics = [
            { subject: 'Quantitative', A: avgQuant, fullMark: 100 },
            { subject: 'Logical Reasoning', A: avgLogical, fullMark: 100 },
            { subject: 'Verbal Ability', A: avgVerbal, fullMark: 100 },
            { subject: 'Coding Accuracy', A: codingAccuracy, fullMark: 100 },
            { subject: 'Oral Communication', A: avgCommunication, fullMark: 100 }
        ];
        res.status(200).json({
            atsScore,
            codingStreak,
            mockExams: tests.length,
            aiInterviews,
            testHistory,
            readinessMetrics
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getDashboardStatsForUser = getDashboardStatsForUser;
const getTechnicalQuizQuestions = async (req, res) => {
    try {
        const { role, level, exclude, limit } = req.query;
        const targetRole = role || 'Software Engineer';
        const targetLevel = level || 'beginner';
        const size = limit ? parseInt(limit, 10) : 20;
        let excludeList = [];
        if (exclude) {
            if (Array.isArray(exclude)) {
                excludeList = exclude.map(e => e.toString());
            }
            else {
                excludeList = exclude.toString().split(',').map(s => s.trim()).filter(Boolean);
            }
        }
        // 1. Fetch from database first (using type 'aptitude' to support constraint check)
        const { data: dbQuestions, error: dbError } = await db_1.supabase
            .from('questions')
            .select('*')
            .eq('type', 'aptitude')
            .eq('category', `tech:${targetRole}`)
            .eq('difficulty', targetLevel);
        let filteredQuestions = dbQuestions || [];
        if (excludeList.length > 0) {
            filteredQuestions = filteredQuestions.filter((q) => !excludeList.includes(q.question_text));
        }
        if (!dbError && filteredQuestions.length >= size) {
            console.log(`[Trainer] Serving ${size} technical questions from DB cache (exclusions applied).`);
            const shuffled = filteredQuestions.sort(() => 0.5 - Math.random()).slice(0, size);
            return res.status(200).json(shuffled.map((q) => ({
                _id: q.id,
                type: 'technical',
                category: q.category,
                difficulty: q.difficulty,
                questionText: q.question_text,
                options: q.options,
                correctOption: q.correct_option,
                explanation: q.explanation
            })));
        }
        // 2. Generate via AI on cache miss
        console.log(`[Trainer] DB cache miss for technical questions. Generating via AI...`);
        const generated = await (0, ai_1.generateTechnicalQuizAI)(targetRole, targetLevel, excludeList, size);
        const savedQuestions = [];
        for (const q of generated) {
            const { data, error } = await db_1.supabase
                .from('questions')
                .insert({
                type: 'aptitude',
                category: `tech:${targetRole}`,
                difficulty: targetLevel,
                question_text: q.questionText,
                options: q.options || [],
                correct_option: q.correctOption,
                explanation: q.explanation || ''
            })
                .select()
                .single();
            if (error) {
                console.error('[Trainer] Error saving technical question:', error.message);
                savedQuestions.push({
                    id: q.id || `tech-${Math.random()}`,
                    type: 'technical',
                    category: `tech:${targetRole}`,
                    difficulty: targetLevel,
                    questionText: q.questionText,
                    options: q.options || [],
                    correctOption: q.correctOption,
                    explanation: q.explanation || ''
                });
            }
            else {
                savedQuestions.push({
                    id: data.id,
                    type: 'technical',
                    category: data.category,
                    difficulty: data.difficulty,
                    questionText: data.question_text,
                    options: data.options,
                    correctOption: data.correct_option,
                    explanation: data.explanation
                });
            }
        }
        res.status(200).json(savedQuestions.map((q) => ({
            _id: q.id,
            type: 'technical',
            category: q.category,
            difficulty: q.difficulty,
            questionText: q.questionText,
            options: q.options,
            correctOption: q.correctOption,
            explanation: q.explanation
        })));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getTechnicalQuizQuestions = getTechnicalQuizQuestions;
const submitTechnicalQuiz = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        const { answers } = req.body;
        if (!answers || !Array.isArray(answers)) {
            return res.status(400).json({ message: 'Answers array is required' });
        }
        let correctCount = 0;
        const results = [];
        for (const ans of answers) {
            const isCorrect = ans.correctOption === ans.selectedOption;
            if (isCorrect)
                correctCount++;
            results.push({
                questionId: ans.questionId,
                questionText: ans.questionText || 'Question',
                isCorrect,
                correctOption: ans.correctOption,
                selectedOption: ans.selectedOption,
                explanation: ans.explanation || ''
            });
        }
        const totalQuestions = answers.length;
        const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
        let rating = 'Beginner';
        if (correctCount >= 12 && accuracy >= 80) {
            rating = 'Elite (Gold)';
        }
        else if (correctCount >= 8 && accuracy >= 70) {
            rating = 'Professional (Silver)';
        }
        else if (correctCount >= 5 && accuracy >= 50) {
            rating = 'Developer (Bronze)';
        }
        res.status(200).json({
            correctCount,
            totalQuestions,
            accuracy,
            rating,
            results
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.submitTechnicalQuiz = submitTechnicalQuiz;

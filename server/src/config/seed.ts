import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from '../models/Question';
import Job from '../models/Job';

dotenv.config();

const aptitudeQuestions = [
  {
    type: 'aptitude',
    category: 'quantitative',
    difficulty: 'easy',
    questionText: 'A train 120 m long passes a telegraph post in 6 seconds. What is the speed of the train in km/h?',
    options: ['72 km/h', '60 km/h', '80 km/h', '90 km/h'],
    correctOption: 0,
    explanation: 'Speed = Distance / Time = 120 / 6 = 20 m/s. To convert m/s to km/h, multiply by 18/5. So, 20 * 18/5 = 72 km/h.',
    companyTags: ['TCS', 'Infosys', 'Wipro']
  },
  {
    type: 'aptitude',
    category: 'quantitative',
    difficulty: 'medium',
    questionText: 'A sum of money doubles itself at compound interest in 15 years. In how many years will it become eight times itself?',
    options: ['30 years', '45 years', '50 years', '60 years'],
    correctOption: 1,
    explanation: 'If a sum doubles (2x) in 15 years, it becomes 4x (2^2) in 30 years and 8x (2^3) in 15 * 3 = 45 years.',
    companyTags: ['Cognizant', 'Capgemini']
  },
  {
    type: 'aptitude',
    category: 'logical',
    difficulty: 'easy',
    questionText: 'If A is the brother of B, B is the sister of C, and C is the father of D, how is A related to D?',
    options: ['Uncle', 'Father', 'Brother', 'Grandfather'],
    correctOption: 0,
    explanation: 'C is the father of D. Since B is the sister of C, and A is the brother of B, A is the brother of C. Therefore, A is the uncle of D.',
    companyTags: ['TCS', 'Accenture']
  },
  {
    type: 'aptitude',
    category: 'logical',
    difficulty: 'medium',
    questionText: 'Find the next term in the series: 3, 5, 9, 17, 33, ...',
    options: ['45', '50', '65', '68'],
    correctOption: 2,
    explanation: 'The difference doubles each time: 5-3=2, 9-5=4, 17-9=8, 33-17=16. The next difference is 32, so 33 + 32 = 65.',
    companyTags: ['Infosys', 'Amazon']
  },
  {
    type: 'aptitude',
    category: 'verbal',
    difficulty: 'easy',
    questionText: 'Choose the word that is most nearly opposite in meaning to: PRODIGAL',
    options: ['Frugal', 'Generous', 'Wasteful', 'Extravagant'],
    correctOption: 0,
    explanation: 'Prodigal means spending money or resources freely and wastefully. The opposite is Frugal, which means sparing or economical with money or food.',
    companyTags: ['Wipro', 'Mindtree']
  }
];

const codingQuestions = [
  {
    type: 'coding',
    category: 'python',
    difficulty: 'easy',
    questionText: 'Write a Python function `two_sum(nums, target)` that returns the indices of the two numbers such that they add up to the target.',
    codeTemplate: 'def two_sum(nums, target):\n    # Write your code here\n    pass',
    testCases: [
      { input: '[2, 7, 11, 15], 9', output: '[0, 1]' },
      { input: '[3, 2, 4], 6', output: '[1, 2]' }
    ],
    explanation: 'Use a hash map to record target - nums[i] as you iterate through the list.',
    companyTags: ['Google', 'Amazon', 'Meta']
  },
  {
    type: 'coding',
    category: 'javascript',
    difficulty: 'medium',
    questionText: 'Write a JavaScript function `isPalindrome(str)` that checks if a string is a palindrome, ignoring non-alphanumeric characters and case.',
    codeTemplate: 'function isPalindrome(str) {\n  // Write your code here\n  return false;\n}',
    testCases: [
      { input: '"A man, a plan, a canal: Panama"', output: 'true' },
      { input: '"race a car"', output: 'false' }
    ],
    explanation: 'Clean the string using regex `/[^a-zA-Z0-9]/g`, lower-case it, and check if it matches its reverse.',
    companyTags: ['Microsoft', 'Uber']
  },
  {
    type: 'coding',
    category: 'sql',
    difficulty: 'medium',
    questionText: 'Write an SQL query to find the second highest salary from an Employee table. If there is no second highest, return NULL.',
    codeTemplate: 'SELECT MAX(Salary) AS SecondHighestSalary\nFROM Employee\nWHERE Salary < (SELECT MAX(Salary) FROM Employee);',
    testCases: [
      { input: 'Employee Table: {1: 100, 2: 200, 3: 300}', output: '200' }
    ],
    explanation: 'Subquery finds the absolute maximum, and the main query filters for the maximum of all values strictly below that absolute maximum.',
    companyTags: ['Oracle', 'WalmartLabs']
  }
];

const mockJobs = [
  {
    title: 'Associate Software Engineer',
    company: 'TCS (Tata Consultancy Services)',
    location: 'Bangalore, India',
    type: 'full-time',
    salary: '₹4.5 - ₹7.0 LPA',
    description: 'Looking for enthusiastic freshers with good problem-solving capabilities, familiar with Java, Python or Web Technologies.',
    skillsRequired: ['Java', 'Python', 'SQL', 'DBMS']
  },
  {
    title: 'Front-End React Intern',
    company: 'Razorpay',
    location: 'Remote (India)',
    type: 'internship',
    salary: '₹25,000 - ₹35,000 / month',
    description: 'Join our merchant dashboard squad. Perfect for students with strong React, JavaScript, and CSS skills.',
    skillsRequired: ['React.js', 'JavaScript', 'TypeScript', 'CSS']
  },
  {
    title: 'Graduate Analyst (Software)',
    company: 'Deloitte',
    location: 'Hyderabad, India',
    type: 'full-time',
    salary: '₹6.5 - ₹8.5 LPA',
    description: 'Deliver tech consultancy for international clients. Excellent communication skills and basic OOP/SQL skills required.',
    skillsRequired: ['SQL', 'Communication', 'Java', 'Python']
  },
  {
    title: 'Software Development Engineer - 1 (SDE-1)',
    company: 'Amazon',
    location: 'Chennai, India',
    type: 'full-time',
    salary: '₹18 - ₹24 LPA',
    description: 'Solve highly scalable transactional database problems. Requires strong DSA foundation and algorithm design.',
    skillsRequired: ['C++', 'Java', 'Data Structures', 'Algorithms']
  }
];

export const seedDatabase = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai_placement_db';
    console.log(`[Seeder] Connecting to MongoDB: ${connUri}`);
    await mongoose.connect(connUri);

    console.log('[Seeder] Clearing old records...');
    await Question.deleteMany({});
    await Job.deleteMany({});

    console.log('[Seeder] Seeding Aptitude & Coding Questions...');
    await Question.insertMany([...aptitudeQuestions, ...codingQuestions]);

    console.log('[Seeder] Seeding Jobs & Internships...');
    await Job.insertMany(mockJobs);

    console.log('[Seeder] Seed Successful!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[Seeder] Seed Failure:', error);
    process.exit(1);
  }
};

// Auto-run if executed directly
if (require.main === module) {
  seedDatabase();
}

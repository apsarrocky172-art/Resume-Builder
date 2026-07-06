"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = void 0;
require("dotenv/config");
const db_1 = require("./db");
const aptitudeQuestions = [
    // 1. Number System
    {
        type: 'aptitude',
        category: 'Number System',
        difficulty: 'medium',
        questionText: 'Find the unit digit of 7^295.',
        options: ['7', '9', '3', '1'],
        correctOption: 2,
        explanation: 'The unit digit of 7 repeats in a cycle of 4: 7^1=7, 7^2=9, 7^3=3, 7^4=1. Dividing 295 by 4 gives a remainder of 3. Therefore, the unit digit is the same as 7^3, which is 3.',
        companyTags: ['TCS', 'Infosys', 'Wipro']
    },
    {
        type: 'aptitude',
        category: 'Number System',
        difficulty: 'easy',
        questionText: 'If a number is divisible by both 11 and 13, then it must be necessarily divisible by:',
        options: ['11 + 13', '13 - 11', '11 * 13', '11^2'],
        correctOption: 2,
        explanation: 'If a number is divisible by two co-prime numbers, it must be divisible by their product. Since 11 and 13 are co-prime, the number is divisible by 11 * 13.',
        companyTags: ['Accenture', 'Capgemini']
    },
    {
        type: 'aptitude',
        category: 'Number System',
        difficulty: 'medium',
        questionText: 'Find the remainder when 2^31 is divided by 5.',
        options: ['1', '2', '3', '4'],
        correctOption: 2,
        explanation: 'By cyclicity: 2^1=2, 2^2=4, 2^3=8 (remainder 3), 2^4=16 (remainder 1). The remainder pattern repeats every 4 powers. Since 31 mod 4 = 3, the remainder is 3.',
        companyTags: ['Google', 'Amazon']
    },
    // 2. Arithmetic
    {
        type: 'aptitude',
        category: 'Arithmetic',
        difficulty: 'medium',
        questionText: 'A and B can do a piece of work in 12 days, B and C in 15 days, C and A in 20 days. If A, B, and C work together, in how many days will they complete the work?',
        options: ['5 days', '7.5 days', '10 days', '12.5 days'],
        correctOption: 2,
        explanation: 'Let total work be 60 units (LCM of 12, 15, 20). Efficiency: A+B = 5, B+C = 4, C+A = 3. Summing these, 2(A+B+C) = 12 => A+B+C = 6 units/day. Days required = 60 / 6 = 10 days.',
        companyTags: ['TCS', 'Infosys']
    },
    {
        type: 'aptitude',
        category: 'Arithmetic',
        difficulty: 'hard',
        questionText: 'A train passes a station platform in 36 seconds and a man standing on the platform in 20 seconds. If the speed of the train is 54 km/hr, what is the length of the platform?',
        options: ['120 m', '240 m', '300 m', '360 m'],
        correctOption: 1,
        explanation: 'Speed of train = 54 * (5/18) = 15 m/s. Length of train = speed * time to pass man = 15 * 20 = 300 m. Distance covered to pass platform = 15 * 36 = 540 m. Platform length = 540 - 300 = 240 m.',
        companyTags: ['Cognizant', 'Wipro']
    },
    {
        type: 'aptitude',
        category: 'Arithmetic',
        difficulty: 'medium',
        questionText: 'In a mixture of 60 liters, the ratio of milk and water is 2:1. If this ratio is to be 1:2, then the quantity of water to be further added is:',
        options: ['20 liters', '30 liters', '40 liters', '60 liters'],
        correctOption: 3,
        explanation: 'Original Milk = 40L, Water = 20L. For 1:2 ratio, milk (40L) represents 1 part, so water must be 2 parts = 80L. Water to add = 80 - 20 = 60 liters.',
        companyTags: ['Mindtree', 'Capgemini']
    },
    // 3. Quantitative Aptitude
    {
        type: 'aptitude',
        category: 'Quantitative Aptitude',
        difficulty: 'medium',
        questionText: 'How many different words can be formed by using all the letters of the word "LEADER"?',
        options: ['720', '360', '120', '72'],
        correctOption: 1,
        explanation: 'The word "LEADER" has 6 letters, where E is repeated twice. Number of words = 6! / 2! = 720 / 2 = 360.',
        companyTags: ['TCS', 'Amazon']
    },
    {
        type: 'aptitude',
        category: 'Quantitative Aptitude',
        difficulty: 'easy',
        questionText: 'What is the probability of getting a sum of 9 from two throws of a single dice?',
        options: ['1/6', '1/8', '1/9', '1/12'],
        correctOption: 2,
        explanation: 'Total outcomes = 36. Favorable outcomes for sum 9 are: (3,6), (4,5), (5,4), (6,3) which is 4 cases. Probability = 4/36 = 1/9.',
        companyTags: ['Infosys', 'Cognizant']
    },
    {
        type: 'aptitude',
        category: 'Quantitative Aptitude',
        difficulty: 'medium',
        questionText: 'The area of a circle is increased by 21% when its radius is increased by r%. What is the value of r?',
        options: ['10%', '11%', '20%', '21%'],
        correctOption: 0,
        explanation: 'Area = pi * R^2. If radius increases by r%, new area increases by (2r + r^2/100)%. Substituting r = 10 gives 2(10) + 100/100 = 21%. Thus r = 10.',
        companyTags: ['Wipro', 'Microsoft']
    },
    // 4. Logical Reasoning
    {
        type: 'aptitude',
        category: 'Logical Reasoning',
        difficulty: 'easy',
        questionText: 'Pointing to a photograph, a man said, "I have no brother or sister but that man\'s father is my father\'s son." Whose photograph was it?',
        options: ['His own', 'His son\'s', 'His father\'s', 'His nephew\'s'],
        correctOption: 1,
        explanation: 'Since the speaker has no brother or sister, "my father\'s son" is the speaker himself. Thus, the man\'s father in the photo is the speaker himself, meaning it is his son\'s photo.',
        companyTags: ['TCS', 'Deloitte']
    },
    {
        type: 'aptitude',
        category: 'Logical Reasoning',
        difficulty: 'medium',
        questionText: 'In a certain code language, "COMPUTER" is written as "RFUVQNPC". How is "MEDICINE" written in that code?',
        options: ['EOJDJEFM', 'EOJDEJFM', 'MFEJDJOE', 'DJEFMEOJ'],
        correctOption: 1,
        explanation: 'The first and last letters are swapped and reverse-ordered, while the middle letters are shifted by +1. C <-> R, O(+1)->P, M(+1)->N, P(+1)->Q, U(+1)->V, T(+1)->U, E(+1)->F. Reversing this structure gives EOJDEJFM.',
        companyTags: ['Accenture', 'Wipro']
    },
    {
        type: 'aptitude',
        category: 'Logical Reasoning',
        difficulty: 'hard',
        questionText: 'Six persons A, B, C, D, E and F are standing in a circle. B is between F and C; A is between E and D; F is to the left of D. Who is between A and F?',
        options: ['B', 'C', 'D', 'E'],
        correctOption: 2,
        explanation: 'Arranging them in a circle based on the clues: B is between F and C. F is to the left of D. A is between E and D. The order in the circle is E - A - D - F - B - C. Thus, D is between A and F.',
        companyTags: ['Infosys', 'Google']
    },
    // 5. Verbal Ability
    {
        type: 'aptitude',
        category: 'Verbal Ability',
        difficulty: 'easy',
        questionText: 'Choose the word which is most similar in meaning to: CANDID',
        options: ['Vague', 'Outspoken', 'Secretive', 'Insincere'],
        correctOption: 1,
        explanation: 'Candid means truthful, straightforward, and frank. "Outspoken" is the closest synonym among the choices.',
        companyTags: ['TCS', 'Cognizant']
    },
    {
        type: 'aptitude',
        category: 'Verbal Ability',
        difficulty: 'medium',
        questionText: 'Identify the error in the sentence: "He had no sooner seen the police officer when he ran away."',
        options: ['He had no sooner', 'seen the police officer', 'when he ran', 'away'],
        correctOption: 2,
        explanation: 'The correlative conjunction "no sooner" is always paired with "than", not "when". The correct expression is "... than he ran away."',
        companyTags: ['Infosys', 'Deloitte']
    },
    {
        type: 'aptitude',
        category: 'Verbal Ability',
        difficulty: 'medium',
        questionText: 'Fill in the blank: "The manager was __________ with the team\'s performance, as they exceeded all quarterly targets."',
        options: ['disgruntled', 'elated', 'indifferent', 'apathetic'],
        correctOption: 1,
        explanation: 'Since the team exceeded targets, the manager would be very pleased. "Elated" means extremely happy and proud.',
        companyTags: ['Amazon', 'TCS']
    },
    // 6. Data Interpretation
    {
        type: 'aptitude',
        category: 'Data Interpretation',
        difficulty: 'medium',
        questionText: 'In a company, sales of product X in 2021, 2022, 2023, and 2024 were 150, 200, 250, and 300 units respectively. What is the percentage growth in sales from 2021 to 2024?',
        options: ['50%', '100%', '150%', '200%'],
        correctOption: 1,
        explanation: 'Sales in 2021 = 150. Sales in 2024 = 300. Growth = 300 - 150 = 150. Percentage growth = (150 / 150) * 100% = 100%.',
        companyTags: ['Infosys', 'Capgemini']
    },
    {
        type: 'aptitude',
        category: 'Data Interpretation',
        difficulty: 'easy',
        questionText: 'A pie chart shows budget distribution: Dev (40%), Testing (25%), Design (15%), Marketing (20%). If the total budget is $100,000, what is the budget allocated for Testing and Design combined?',
        options: ['$30,000', '$40,000', '$45,000', '$55,000'],
        correctOption: 1,
        explanation: 'Testing (25%) + Design (15%) = 40% of the total budget. Allocated budget = 40% of $100,000 = $40,000.',
        companyTags: ['Wipro', 'Accenture']
    },
    {
        type: 'aptitude',
        category: 'Data Interpretation',
        difficulty: 'medium',
        questionText: 'The average production of a factory for 5 months is 2000 units. If the production of the first 4 months is 1800, 2100, 1900, and 2200, what is the production of the 5th month?',
        options: ['1800', '2000', '2200', '2400'],
        correctOption: 1,
        explanation: 'Total production for 5 months = 5 * 2000 = 10,000 units. Sum of first 4 months = 1800 + 2100 + 1900 + 2200 = 8,000 units. 5th month production = 10,000 - 8,000 = 2,000 units.',
        companyTags: ['TCS', 'Cognizant']
    },
    // 7. Data Sufficiency
    {
        type: 'aptitude',
        category: 'Data Sufficiency',
        difficulty: 'medium',
        questionText: 'Is X divisible by 6?\nStatement I: X is divisible by 3.\nStatement II: X is an even number.',
        options: ['Statement I alone is sufficient', 'Statement II alone is sufficient', 'Both statements I and II together are sufficient', 'Statements I and II together are not sufficient'],
        correctOption: 2,
        explanation: 'For a number to be divisible by 6, it must be divisible by both 2 and 3. Statement I ensures it is divisible by 3. Statement II ensures it is even (divisible by 2). Combining both statements makes it sufficient.',
        companyTags: ['Amazon', 'Deloitte']
    },
    {
        type: 'aptitude',
        category: 'Data Sufficiency',
        difficulty: 'easy',
        questionText: 'What is the age of John?\nStatement I: John is 5 years older than Mary.\nStatement II: Mary is 20 years old.',
        options: ['Statement I alone is sufficient', 'Statement II alone is sufficient', 'Both statements I and II together are sufficient', 'Statements I and II together are not sufficient'],
        correctOption: 2,
        explanation: 'From Statement II, we get Mary\'s age = 20. Using Statement I, John\'s age is Mary\'s age + 5 = 20 + 5 = 25. Hence both statements together are sufficient.',
        companyTags: ['Cognizant', 'Infosys']
    },
    {
        type: 'aptitude',
        category: 'Data Sufficiency',
        difficulty: 'medium',
        questionText: 'Find the length of a rectangle.\nStatement I: The area of the rectangle is 120 sq cm.\nStatement II: The perimeter of the rectangle is 46 cm.',
        options: ['Statement I alone is sufficient', 'Statement II alone is sufficient', 'Both statements I and II together are sufficient', 'Statements I and II together are not sufficient'],
        correctOption: 2,
        explanation: 'From I: L * W = 120. From II: 2(L + W) = 46 => L + W = 23. We can form a quadratic equation (L^2 - 23L + 120 = 0) and find the length and width (15 cm and 8 cm). Hence both statements together are sufficient.',
    },
    {
        type: 'aptitude',
        category: 'Puzzle Solving',
        difficulty: 'hard',
        questionText: '[IMAGE: /images/puzzles/switches.png] There are three switches downstairs, each corresponding to one of three light bulbs in the attic. You can only visit the attic once. How can you determine which switch controls which bulb?',
        options: [
            'Turn switch 1 on for 10 min, turn it off, turn switch 2 on, then check the attic.',
            'Turn all switches on and off repeatedly.',
            'Ask someone in the attic.',
            'It is impossible to know without visiting the attic three times.'
        ],
        correctOption: 0,
        explanation: 'Turn the first switch on for 10 minutes, then turn it off. Turn the second switch on. Go to the attic. The bulb that is on is connected to the second switch. The bulb that is off but hot is connected to the first switch. The third bulb is connected to the third switch.',
        companyTags: ['Google', 'Microsoft', 'TCS']
    },
    {
        type: 'aptitude',
        category: 'Puzzle Solving',
        difficulty: 'medium',
        questionText: '[IMAGE: /images/puzzles/river_crossing.png] A farmer needs to cross a river with a wolf, a goat, and a cabbage. His boat can only hold himself and one other item. If left unattended, the wolf will eat the goat, or the goat will eat the cabbage. What is the minimum number of trips required to cross safely?',
        options: [
            '5 trips',
            '7 trips',
            '9 trips',
            '11 trips'
        ],
        correctOption: 1,
        explanation: 'Minimum trips is 7: 1. Take goat across. 2. Return alone. 3. Take cabbage across. 4. Return with goat. 5. Take wolf across. 6. Return alone. 7. Take goat across.',
        companyTags: ['Amazon', 'Infosys']
    },
    {
        type: 'aptitude',
        category: 'Puzzle Solving',
        difficulty: 'hard',
        questionText: '[IMAGE: /images/puzzles/burning_ropes.png] You have two ropes. Each rope takes exactly 60 minutes to burn from end to end. The ropes burn non-uniformly. How can you measure exactly 45 minutes?',
        options: [
            'Light rope 1 at both ends, and rope 2 at one end. When rope 1 burns out, light the other end of rope 2.',
            'Burn one rope and estimate three-quarters of it.',
            'Burn the ropes simultaneously from one end.',
            'Light both ropes at both ends.'
        ],
        correctOption: 0,
        explanation: 'Light rope 1 at both ends and rope 2 at one end. Rope 1 will burn out in exactly 30 minutes. At that moment, rope 2 has 30 minutes of burn time remaining. Light the other end of rope 2. It will burn out in 15 more minutes, totaling 45 minutes.',
        companyTags: ['Adobe', 'Directi']
    }
];
const codingQuestions = [
    {
        type: 'coding',
        category: 'javascript:Arrays & Strings',
        difficulty: 'easy',
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
        category: 'javascript:Arrays & Strings',
        difficulty: 'medium',
        questionText: 'Write a JavaScript function `twoSum(nums, target)` that returns the indices of the two numbers such that they add up to the target.',
        codeTemplate: 'function twoSum(nums, target) {\n  // Write your code here\n  return [];\n}',
        testCases: [
            { input: '[2, 7, 11, 15], 9', output: '[0, 1]' },
            { input: '[3, 2, 4], 6', output: '[1, 2]' }
        ],
        explanation: 'Use a hash map to record target - nums[i] as you iterate through the list.',
        companyTags: ['Google', 'Amazon', 'Meta']
    },
    {
        type: 'coding',
        category: 'javascript:Asynchronous JS',
        difficulty: 'medium',
        questionText: 'Write an asynchronous JavaScript function `sleep(millis)` that delays execution by the specified milliseconds.',
        codeTemplate: 'async function sleep(millis) {\n  // Write your code here\n  return new Promise(resolve => setTimeout(resolve, millis));\n}',
        testCases: [
            { input: '100.then(() => 5)', output: '5' }
        ],
        explanation: 'Return a promise that resolves after the timeout.',
        companyTags: ['Uber', 'Lyft']
    },
    {
        type: 'coding',
        category: 'python:Lists & Tuples',
        difficulty: 'easy',
        questionText: 'Write a Python function `reverse_list(lst)` that reverses a list in-place and returns it.',
        codeTemplate: 'def reverse_list(lst):\n    # Write your code here\n    return lst[::-1]',
        testCases: [
            { input: '[1, 2, 3]', output: '[3, 2, 1]' }
        ],
        explanation: 'Slice with a step of -1 to reverse a list in Python.',
        companyTags: ['Netflix', 'Apple']
    },
    {
        type: 'coding',
        category: 'python:Dictionaries',
        difficulty: 'medium',
        questionText: 'Write a Python function `word_frequency(sentence)` that returns a dictionary mapping words to their occurrences.',
        codeTemplate: 'def word_frequency(sentence):\n    # Write your code here\n    return {}',
        testCases: [
            { input: '"hello world hello"', output: '{"hello": 2, "world": 1}' }
        ],
        explanation: 'Use a dict to track counts or use collections.Counter.',
        companyTags: ['Google', 'Dropbox']
    },
    {
        type: 'coding',
        category: 'sql:Joins & Subqueries',
        difficulty: 'medium',
        questionText: 'Write an SQL query to find the second highest salary from the Employee table. If there is no second highest salary, return NULL.',
        codeTemplate: 'SELECT MAX(Salary) AS SecondHighestSalary FROM Employee WHERE Salary < (SELECT MAX(Salary) FROM Employee);',
        testCases: [
            { input: 'Employee salary query', output: 'Success' }
        ],
        explanation: 'Filter by values strictly lower than the max value.',
        companyTags: ['Oracle', 'Microsoft']
    },
    {
        type: 'coding',
        category: 'sql:Basic Select',
        difficulty: 'easy',
        questionText: 'Write an SQL query to find the employees who earn more than their managers. The Employee table has columns: Id, Name, Salary, ManagerId.',
        codeTemplate: 'SELECT e.Name AS Employee FROM Employee e JOIN Employee m ON e.ManagerId = m.Id WHERE e.Salary > m.Salary;',
        testCases: [
            { input: 'Employee manager check', output: 'Success' }
        ],
        explanation: 'Self-join the table on manager ID and filter by salary.',
        companyTags: ['Amazon', 'Salesforce']
    },
    {
        type: 'coding',
        category: 'java:Arrays & Strings',
        difficulty: 'easy',
        questionText: 'Write a Java method `public String reverse(String str)` that reverses the input string.',
        codeTemplate: 'public class Solution {\n    public String reverse(String str) {\n        // Write code here\n        return new StringBuilder(str).reverse().toString();\n    }\n}',
        testCases: [
            { input: '"hello"', output: '"olleh"' }
        ],
        explanation: 'Use StringBuilder to reverse a string in Java.',
        companyTags: ['Adobe', 'Oracle']
    },
    {
        type: 'coding',
        category: 'cpp:STL Containers',
        difficulty: 'medium',
        questionText: 'Write a C++ function `vector<int> reverseVector(vector<int> &v)` to reverse the elements of a vector.',
        codeTemplate: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<int> reverseVector(vector<int> &v) {\n    reverse(v.begin(), v.end());\n    return v;\n}',
        testCases: [
            { input: '{1, 2, 3}', output: '{3, 2, 1}' }
        ],
        explanation: 'Use std::reverse from <algorithm>.',
        companyTags: ['Bloomberg', 'Facebook']
    },
    {
        type: 'coding',
        category: 'c:Pointers',
        difficulty: 'easy',
        questionText: 'Write a C function `void swap(int *a, int *b)` that swaps the values of two integers using pointers.',
        codeTemplate: 'void swap(int *a, int *b) {\n    int temp = *a;\n    *a = *b;\n    *b = temp;\n}',
        testCases: [
            { input: '5, 10', output: '10, 5' }
        ],
        explanation: 'Dereference variables and swap via a temp variable.',
        companyTags: ['Intel', 'Nvidia']
    },
    {
        type: 'coding',
        category: 'html:Semantic Elements',
        difficulty: 'easy',
        questionText: 'Create an HTML5 semantic markup containing a nav element with three anchor tags inside a header.',
        codeTemplate: '<header>\n  <nav>\n    <a href="#home">Home</a>\n    <a href="#about">About</a>\n    <a href="#contact">Contact</a>\n  </nav>\n</header>',
        testCases: [
            { input: 'HTML structure', output: 'Valid HTML' }
        ],
        explanation: 'Use semantic tag names header and nav.',
        companyTags: ['W3C', 'Mozilla']
    },
    {
        type: 'coding',
        category: 'c:Loops',
        difficulty: 'easy',
        questionText: 'Write a C function `int sum_n(int n)` that calculates the sum of all integers from 1 to n using a loop.',
        codeTemplate: 'int sum_n(int n) {\n    // Write your code here\n    int sum = 0;\n    for (int i = 1; i <= n; i++) {\n        sum += i;\n    }\n    return sum;\n}',
        testCases: [
            { input: '5', output: '15' }
        ],
        explanation: 'Loop from 1 to n adding numbers to a sum accumulator.',
        companyTags: ['Intel', 'TCS']
    },
    {
        type: 'coding',
        category: 'c:If/Else Conditionals',
        difficulty: 'easy',
        questionText: 'Write a C function `int is_even(int num)` that returns 1 if num is even, and 0 if odd using if/else.',
        codeTemplate: 'int is_even(int num) {\n    // Write your code here\n    if (num % 2 == 0) {\n        return 1;\n    } else {\n        return 0;\n    }\n}',
        testCases: [
            { input: '4', output: '1' },
            { input: '7', output: '0' }
        ],
        explanation: 'Check division remainder of num modulo 2 using if/else.',
        companyTags: ['Infosys', 'Wipro']
    },
    {
        type: 'coding',
        category: 'python:Loops & Iterators',
        difficulty: 'easy',
        questionText: 'Write a Python function `find_max(lst)` that loops through a list to find and return the maximum element.',
        codeTemplate: 'def find_max(lst):\n    # Write your code here\n    if not lst:\n        return None\n    max_val = lst[0]\n    for x in lst:\n        if x > max_val:\n            max_val = x\n    return max_val',
        testCases: [
            { input: '[1, 5, 3, 9, 2]', output: '9' }
        ],
        explanation: 'Initialize max_val as the first element and iterate updating max_val.',
        companyTags: ['Amazon', 'Microsoft']
    },
    {
        type: 'coding',
        category: 'javascript:Control Flow & Loops',
        difficulty: 'easy',
        questionText: 'Write a JavaScript function `fizzBuzz(n)` that returns an array from 1 to n, replacing multiples of 3 with "Fizz", multiples of 5 with "Buzz", and both with "FizzBuzz".',
        codeTemplate: 'function fizzBuzz(n) {\n  // Write your code here\n  const result = [];\n  for (let i = 1; i <= n; i++) {\n    if (i % 3 === 0 && i % 5 === 0) result.push("FizzBuzz");\n    else if (i % 3 === 0) result.push("Fizz");\n    else if (i % 5 === 0) result.push("Buzz");\n    else result.push(String(i));\n  }\n  return result;\n}',
        testCases: [
            { input: '5', output: '["1","2","Fizz","4","Buzz"]' }
        ],
        explanation: 'Loop from 1 to n checking modulo 3 and 5, pushing matching string tags.',
        companyTags: ['Google', 'Meta']
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
const seedDatabase = async () => {
    try {
        console.log('[Seeder] Clearing old records from Supabase...');
        // Delete all records from questions and jobs
        const { error: delQErr } = await db_1.supabase.from('questions').delete().neq('question_text', '');
        if (delQErr)
            console.warn('[Seeder] Warn/Error clearing questions:', delQErr.message);
        const { error: delJErr } = await db_1.supabase.from('jobs').delete().neq('title', '');
        if (delJErr)
            console.warn('[Seeder] Warn/Error clearing jobs:', delJErr.message);
        console.log('[Seeder] Seeding Aptitude & Coding Questions to Supabase...');
        const questionsToInsert = [...aptitudeQuestions, ...codingQuestions].map(q => ({
            type: q.type,
            category: q.category,
            difficulty: q.difficulty,
            question_text: q.questionText,
            options: q.options || [],
            correct_option: q.correctOption,
            code_template: q.codeTemplate || null,
            test_cases: q.testCases || [],
            explanation: q.explanation || '',
            company_tags: q.companyTags || []
        }));
        const { error: insQErr } = await db_1.supabase.from('questions').insert(questionsToInsert);
        if (insQErr)
            throw insQErr;
        console.log('[Seeder] Seeding Jobs & Internships to Supabase...');
        const jobsToInsert = mockJobs.map(j => ({
            title: j.title,
            company: j.company,
            location: j.location,
            type: j.type,
            salary: j.salary,
            description: j.description,
            skills_required: j.skillsRequired
        }));
        const { error: insJErr } = await db_1.supabase.from('jobs').insert(jobsToInsert);
        if (insJErr)
            throw insJErr;
        console.log('[Seeder] Seed Successful!');
        process.exit(0);
    }
    catch (error) {
        console.error('[Seeder] Seed Failure:', error.message || error);
        process.exit(1);
    }
};
exports.seedDatabase = seedDatabase;
// Auto-run if executed directly
(0, exports.seedDatabase)();

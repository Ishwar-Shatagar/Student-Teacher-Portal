
import { GoogleGenAI, Part, Content, Type } from "@google/genai";
import { Student, ProfessionalUser, ExamTimetableEntry, CalendarEvent } from '../types';

export const getGeneralChatResponse = async (user: Student | ProfessionalUser, chatHistory: Content[], newMessage: string): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        let systemInstruction = '';
        if (user.role === 'student') {
            systemInstruction = `
                You are "Ace", an AI-powered academic assistant for a college student named ${user.name}. 
                Your goal is to be a helpful and encouraging tutor and guide.
                You can answer questions about general knowledge, help with study concepts, provide explanations, and offer academic advice.
                Keep your responses concise, friendly, and easy to understand. Use markdown for formatting.
            `;
        } else {
            systemInstruction = `
                You are an AI assistant for ${user.name}, a faculty member at a college.
                Your purpose is to assist with educational tasks, such as generating quiz questions, summarizing academic papers, suggesting lesson plan ideas, or explaining complex topics.
                Be professional, knowledgeable, and concise in your responses. Use markdown formatting.
            `;
        }

        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: { systemInstruction },
            history: chatHistory
        });
        const response = await chat.sendMessage({ message: newMessage });
        return response.text || "";
    } catch (error) {
        console.error("Error generating general chat response from Gemini API:", error);
        return "Sorry, I encountered an error while processing your request. Please try again.";
    }
};

export const getChartAnalysis = async (student: Student, classAverageSgpa: { semester: number; avgSgpa: number }[], chatHistory: Content[], newMessage: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const latestSemester = student.academicHistory.length > 0 ? student.academicHistory[student.academicHistory.length - 1] : { results: [] };

    const systemInstruction = `
        You are "Ace", an AI-powered academic performance assistant for a college student. You are encouraging, insightful, and your goal is to help the student understand their performance and find ways to improve.
        You have been given the student's complete academic data. Use this data exclusively to answer the student's questions. Do not invent any data.
        **Student's Data:**
        - Name: ${student.name}
        - Department: ${student.department}
        - Overall CGPA: ${student.cgpa}
        - Academic History (SGPA per semester): ${JSON.stringify(student.academicHistory.map(s => ({ semester: s.semester, sgpa: s.sgpa })))}
        - Latest Semester Results (marks out of 100): ${JSON.stringify(latestSemester.results.map(r => ({ subject: r.name, marks: r.marks, grade: r.grade })))}
        - Class Average SGPA Trend: ${JSON.stringify(classAverageSgpa.map(s => ({ semester: s.semester, avgSgpa: s.avgSgpa.toFixed(2)})))}
        **Your Task:**
        1. Analyze the provided data to answer the user's questions about their performance.
        2. Keep your responses concise and easy to read. Use markdown for formatting (e.g., **bold** for emphasis, bullet points for lists).
        3. Be positive and motivational, even when pointing out areas for improvement.
        4. When asked for advice, provide specific, actionable suggestions based on their performance data (e.g., "In 'Subject X', your marks are a bit lower than the class average. Perhaps focusing on practical labs for that subject could help.").
        5. If the user asks a question you cannot answer from the data, politely state that you can only discuss their academic performance based on the information you have.
    `;
    
    try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: systemInstruction,
            },
            history: chatHistory
        });
        const response = await chat.sendMessage({ message: newMessage });
        return response.text || "";
    } catch (error) {
        console.error("Error generating chat analysis from Gemini API:", error);
        return "Sorry, I encountered an error while analyzing your request. Please try again.";
    }
};

export const getFacultyAnalytics = async (chartContext: string, chatHistory: Content[], newMessage: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const systemInstruction = `
        You are an AI assistant for a faculty member at a college. Your purpose is to analyze student performance data and provide insights.
        You will be given context from the current charts the faculty member is viewing. Use this data to answer their questions.
        
        **Current Chart Context:**
        ${chartContext}

        **Your Task:**
        1. Answer the faculty member's question based on the provided chart context and chat history.
        2. Be professional, data-driven, and concise.
        3. Provide actionable insights where possible.
        4. If the question cannot be answered from the context, state that clearly.
    `;

    try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-pro',
            config: { systemInstruction },
            history: chatHistory
        });
        const response = await chat.sendMessage({ message: newMessage });
        return response.text || "";
    } catch (error) {
        console.error("Error generating faculty analytics from Gemini API:", error);
        return "Sorry, an error occurred while processing your request. Please try again.";
    }
};

export const getStudentPerformanceInsights = async (student: Student, classAverageSgpa: { semester: number; avgSgpa: number }[]): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const latestSemester = student.academicHistory[student.academicHistory.length - 1];
    const sgpaTrend = student.academicHistory.map(s => `Sem ${s.semester}: ${s.sgpa}`).join(', ');

    const prompt = `
        Analyze the academic performance of the following student and provide personalized, encouraging feedback with actionable advice in markdown format.
        **Student Profile:**
        - Name: ${student.name}
        - Department: ${student.department}
        - Overall CGPA: ${student.cgpa}
        - SGPA Trend: ${sgpaTrend}
        **Latest Semester (${latestSemester.semester}) Performance:**
        - SGPA: ${latestSemester.sgpa}
        - Subjects:
        ${latestSemester.results.map(r => `  - ${r.name}: ${r.marks}/100 (Grade: ${r.grade})`).join('\n')}
        **Comparison with Class Average:**
        - Student's SGPA Trend: ${sgpaTrend}
        - Class Average SGPA Trend: ${classAverageSgpa.map(s => `Sem ${s.semester}: ${s.avgSgpa.toFixed(2)}`).join(', ')}
        **Instructions for AI:**
        1.  Start with a positive and encouraging opening statement acknowledging the student's efforts.
        2.  Analyze the CGPA and SGPA trend. Is it improving, stable, or declining?
        3.  Compare the student's performance with the class average. Highlight areas where the student is excelling or needs improvement.
        4.  Identify strong subjects and potential areas of difficulty from the latest semester results.
        5.  Provide 2-3 specific, actionable recommendations for improvement. These could include study strategies, resources to consult, or seeking help from faculty.
        6.  Conclude with a motivational closing statement.
        7.  The entire response should be formatted as a single block of markdown text. Use headings, bold text, and bullet points for readability.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text || "";
    } catch (error) {
        console.error("Error generating insights from Gemini API:", error);
        return "An error occurred while generating AI insights. Please try again later.";
    }
};

export const getFacultyBatchInsights = async (
    totalStudents: number, 
    averageCgpa: number, 
    topPerformer: { name: string; cgpa: number },
    passFail: { pass: number; fail: number }
): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
        Provide a high-level summary and actionable recommendations for a batch of students based on the following aggregated data. Format the response as markdown.
        **Batch Performance Overview:**
        - Total Students: ${totalStudents}
        - Class Average CGPA: ${averageCgpa.toFixed(2)}
        - Top Performing Student: ${topPerformer.name} (CGPA: ${topPerformer.cgpa})
        - Pass/Fail Ratio: ${passFail.pass} Passed / ${passFail.fail} Failed
        **Instructions for AI:**
        1.  Provide a concise summary of the batch's overall academic health.
        2.  Highlight the strength indicated by the average CGPA and the top performer.
        3.  Analyze the pass/fail ratio and suggest potential reasons if the fail rate is significant.
        4.  Based on this data, provide 2-3 actionable recommendations for the institution or department head. Recommendations could involve academic support programs, faculty workshops, or curriculum adjustments.
        5.  Keep the tone professional and data-driven.
        6.  The entire response should be formatted as a single block of markdown text. Use headings, bold text, and bullet points for readability.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
        });
        return response.text || "";
    } catch (error) {
        console.error("Error generating insights from Gemini API:", error);
        return "An error occurred while generating AI insights. Please try again later.";
    }
};

export const analyzeTimetableImage = async (base64ImageData: string, mimeType: string): Promise<ExamTimetableEntry[]> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
        Analyze the provided image of an exam timetable. Extract the schedule information meticulously.
        Return the data as a JSON array where each object represents a single exam.

        Each object MUST contain these fields:
        - "date": The full date of the exam in "YYYY-MM-DD" format.
        - "time": The time slot of the exam, like "10:00 AM - 01:00 PM".
        - "subjectName": The complete name of the subject.
        - "subjectCode": The subject code (e.g., BCS301, BAI702).
        - "semester": The semester number as a string (e.g., "3", "5", "7").

        If any piece of information is missing for a specific exam entry, try your best to infer it, but if it's impossible, you can omit that entry. Ensure the final output is a valid JSON array.
    `;

    try {
        const imagePart = {
            inlineData: {
                data: base64ImageData,
                mimeType: mimeType
            }
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, { text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            date: { type: Type.STRING, description: "The date of the exam in YYYY-MM-DD format." },
                            time: { type: Type.STRING, description: "The start and end time of the exam." },
                            subjectName: { type: Type.STRING, description: "The full name of the subject." },
                            subjectCode: { type: Type.STRING, description: "The official subject code." },
                            semester: { type: Type.STRING, description: "The semester for which the exam is scheduled." }
                        },
                        required: ["date", "time", "subjectName", "subjectCode", "semester"]
                    }
                }
            }
        });

        const jsonString = response.text || "[]";
        const parsedJson = JSON.parse(jsonString);
        return parsedJson as ExamTimetableEntry[];

    } catch (error) {
        console.error("Error analyzing timetable from Gemini API:", error);
        throw new Error("Failed to analyze the timetable. The image might be unclear or the format is not recognized. Please try again with a clearer image.");
    }
};

export const analyzeEventsDocument = async (base64ImageData: string, mimeType: string): Promise<CalendarEvent[]> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
        Analyze the provided image of a calendar, schedule, or event flyer.
        Extract all upcoming events, deadlines, holidays, and important dates.
        Return the data as a JSON array where each object represents a single event.

        Each object MUST contain these fields:
        - "date": The full date of the event in "YYYY-MM-DD" format. Infer the year if it's missing, assuming it's the current or next year.
        - "time": The time of the event (e.g., "10:00 AM - 11:00 AM", "All Day"). If not specified, return "N/A".
        - "title": A concise, descriptive title for the event.
        - "description": A brief description or location of the event. If not available, return an empty string.

        Ensure the final output is a valid JSON array. Do not return anything other than the JSON array.
    `;

    try {
        const imagePart = {
            inlineData: {
                data: base64ImageData,
                mimeType: mimeType
            }
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, { text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            date: { type: Type.STRING, description: "The date of the event in YYYY-MM-DD format." },
                            time: { type: Type.STRING, description: "The start and end time of the event, or 'All Day'." },
                            title: { type: Type.STRING, description: "The title of the event." },
                            description: { type: Type.STRING, description: "A brief description or location of the event." },
                        },
                        required: ["date", "time", "title", "description"]
                    }
                }
            }
        });

        const jsonString = response.text || "[]";
        const parsedJson = JSON.parse(jsonString);
        return parsedJson as CalendarEvent[];

    } catch (error) {
        console.error("Error analyzing event document from Gemini API:", error);
        throw new Error("Failed to analyze the document. The image might be unclear or the format is not recognized. Please try with a clearer image.");
    }
};

export const testApiKey = async (apiKey: string): Promise<{ success: boolean; message: string }> => {
    if (!apiKey) {
        return { success: false, message: 'API Key is empty.' };
    }
    try {
        const ai = new GoogleGenAI({ apiKey });
        await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'test',
        });
        return { success: true, message: 'Connection successful! The API key is valid.' };
    } catch (error) {
        console.error("API Key Test Error:", error);
        if (error instanceof Error) {
            if (error.message.includes('API_KEY_INVALID')) {
                 return { success: false, message: 'Connection failed: The provided API key is invalid.' };
            }
            return { success: false, message: `Connection failed: ${error.message}` };
        }
        return { success: false, message: 'Connection failed: An unknown error occurred.' };
    }
};

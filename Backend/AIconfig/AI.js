import 'dotenv/config';
import {GoogleGenAI} from '@google/genai';

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
    model: 'gemini-1.5-pro',
    temperature: 0.7,
    maxTokens: 2048
});

export default ai;
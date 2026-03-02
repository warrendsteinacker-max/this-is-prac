import 'dotenv/config';
import {GoogleGenAI} from '@google/genai';

const ai = new GoogleGenAI({
    apiKey: 'AIzaSyDwCHfgA0QkF8_-17HIdTBNJLa6HZYPjuE',
    model: 'gemini-1.5-pro',
    temperature: 0.7,
    maxTokens: 2048
});

export default ai;
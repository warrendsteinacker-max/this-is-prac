// const express = require('express');
// const jwt = require('jsonwebtoken');
// const fs = require('fs');
// const path = require('path');
// const cookieParser = require('cookie-parser');
// const cors = require('cors');
// require('dotenv').config();

// const { JSONFileSyncPreset } = require('lowdb/node');
// const defaultData = { users: [] }; 
// const db = JSONFileSyncPreset('db.json', defaultData);
import express from 'express';
import cors from 'cors';
// import AI from './AI.js;'

import {GoogleGenAI} from '@google/genai';

const ai = new GoogleGenAI({
    apiKey: 
});



const app = express();

// --- 1. RELAXED CORS CONFIG ---
// Allows the React Frontend (port 5173) to talk to this Server (port 3000)
app.use(cors({
    origin: '*',
    credentials: true 
}));

app.use(express.json()); 
// app.use(cookieParser());

app.get('/', (req, res) => {
    res.status(200).json({message: "Welcome to the Backend Server!"});
});

app.post('/AIsandT', async (req, res) => {
    const {Q} = req.body

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: Q})

     res.status(200).json({answer: response.text})
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Backend Server running on port ${PORT}`);
});






// // --- Middlewares ---

// const Tcheack = (req, res, next) => {
//     const token = req.cookies.token;
//     if(!token) return res.status(401).json({error: "Access denied"});
//     try {
//         const decoded = jwt.verify(token, process.env.JWT);
//         req.user = decoded; 
//         next();
//     } catch(error) {
//         return res.status(403).json({error: "Invalid token"});
//     }
// }

// const UserFolderHandler = (req, res, next) => {
//     const userId = req.user.id;
//     const content = req.body;
//     const safeUserId = String(userId).replace(/[^a-z0-9]/gi, '_');
//     const userDir = path.join(__dirname, 'storage', 'users', safeUserId);

//     try {
//         if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });
//         const timestamp = new Date().toISOString().replace(/:/g, '-');
//         const fileName = `${req.method}_log_${timestamp}.json`;
//         const filePath = path.join(userDir, fileName);

//         fs.writeFileSync(filePath, JSON.stringify({
//             timestamp: new Date().toLocaleString(),
//             action: req.method,
//             data: content
//         }, null, 2));
//         next();
//     } catch (err) {
//         return res.status(500).json({ error: "Failed to log action" });
//     }
// }

// const FileDeleteHandler = (req, res, next) => {
//     const userId = req.user.id;
//     const { fileName } = req.body; 
//     const safeUserId = String(userId).replace(/[^a-z0-9]/gi, '_');
//     const filePath = path.join(__dirname, 'storage', 'users', safeUserId, fileName);

//     try {
//         if (fs.existsSync(filePath)) {
//             fs.unlinkSync(filePath); 
//             console.log(`File ${fileName} deleted by user ${userId}`);
//             next();
//         } else {
//             return res.status(404).json({ error: "File not found on server" });
//         }
//     } catch (err) {
//         return res.status(500).json({ error: "Delete failed" });
//     }
// }

// // --- Auth Routes ---

// app.post('/login', (req, res) => {
//     const { pas, use } = req.body;
//     const Luser = db.data.users.find(u => u.username === use);
//     if(!Luser || pas !== Luser.pas) return res.status(401).json({ e: "Invalid credentials" });

//     const Atoken = jwt.sign({ id: Luser.id, role: Luser.role }, process.env.JWT, { expiresIn: '1h' });
    
//     res.cookie('token', Atoken, { 
//         httpOnly: true, 
//         secure: false, 
//         sameSite: 'lax' 
//     });
//     return res.status(200).json({ status: "Success", role: Luser.role });
// });

// // --- Data Routes ---

// app.post('/api/data', Tcheack, UserFolderHandler, (req, res) => {
//     res.status(200).json({ status: "Logged" });
// });

// app.delete('/api/data', Tcheack, FileDeleteHandler, (req, res) => {
//     res.status(200).json({ status: "File permanently deleted" });
// });

// --- 3. LISTEN ON ALL INTERFACES ---

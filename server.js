import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import chatHandler from './api/chat.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3001;

app.use(express.json());

// API Routes
app.post('/api/chat', async (req, res) => {
  await chatHandler(req, res);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`API Server running on http://localhost:${PORT}`);
});

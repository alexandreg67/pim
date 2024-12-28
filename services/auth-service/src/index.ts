import express from 'express';
import 'reflect-metadata';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.AUTH_SERVICE_PORT || 4001;

// Middleware de base
app.use(express.json());

// Route de test
app.get('/auth', (req, res) => {
  res.json({ message: 'Auth service is running' });
});

app.get('/auth/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(port, () => {
  console.info(`Auth service running on port ${port}`);
});

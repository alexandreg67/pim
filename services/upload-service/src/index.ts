import express from 'express';
import dotenv from 'dotenv';
import { uploadRoutes } from './routes/upload.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3003;

app.use(express.json());

// Routes
app.use('/upload', uploadRoutes);

// Health check
app.get('/health', (_, res) => {
  res.json({ status: 'healthy' });
});

app.listen(port, () => {
  console.info(`🚀 Upload service running on port ${port}`);
});

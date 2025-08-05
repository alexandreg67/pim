import express from 'express';
import { mailRoutes } from './routes/mail.routes';
import { rateLimit } from './middlewares/rateLimit.middleware';

const app = express();
app.use(express.json());
app.use(rateLimit);

app.use('/mail', mailRoutes);

const PORT = process.env.MAIL_SERVICE_PORT || 3002;
app.listen(PORT, () => {
  console.info(`🚀 Mail service running on port ${PORT}`);
});

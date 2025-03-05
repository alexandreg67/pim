import express from 'express';
import { mailRoutes } from './routes/mail.routes';

const app = express();
app.use(express.json());

app.use('/mail', mailRoutes);

const PORT = process.env.MAIL_SERVICE_PORT || 3002;
app.listen(PORT, () => {
  console.info(`🚀 Mail service running on port ${PORT}`);
});

import express from 'express';
import 'reflect-metadata';

const app = express();
const port = process.env.AUTH_SERVICE_PORT || 4001;

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(port, () => {
  console.info(`Auth service running on port ${port}`);
});

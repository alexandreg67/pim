import express from 'express';

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'Auth service is running' });
});

export const authRoutes = router;

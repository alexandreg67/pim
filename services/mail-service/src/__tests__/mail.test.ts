import request from 'supertest';
import express from 'express';
import { mailRoutes } from '../routes/mail.routes';
import { describe, it, expect } from '@jest/globals';

const app = express();
app.use(express.json());
app.use('/mail', mailRoutes);

describe('Mail Service', () => {
  it('should send an email', async () => {
    const response = await request(app)
      .post('/mail/send')
      .send({
        template: 'TEMP_PASSWORD',
        to: 'test@example.com',
        data: {
          temporaryPassword: 'temp123',
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.previewUrl).toBeDefined();
  });
});

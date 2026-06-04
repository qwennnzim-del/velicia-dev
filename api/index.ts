import express from 'express';
import { apiRouter } from '../server';

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use('/api', apiRouter);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default app;

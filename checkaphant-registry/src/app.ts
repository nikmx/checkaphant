import express from 'express';
import assetVoteRoutes from './routes/assetVoteRoutes';
import keyVoteRoutes from './routes/keyVoteRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());

// Routes
app.use('/api/v1/asset', keyVoteRoutes);
app.use('/api/v1/key', assetVoteRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
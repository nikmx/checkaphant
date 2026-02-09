import express from 'express';
import assetVoteRoutes from './routes/assetVoteRoutes';
import keyVoteRoutes from './routes/keyVoteRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());

// Routes
app.use('/api/vote/key', keyVoteRoutes);
app.use('/api/vote/asset', assetVoteRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
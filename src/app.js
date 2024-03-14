import express from 'express';
import cors from 'cors';
import snippetRouter from './routes/snippetRoutes.js'
import setupSwagger from './swagger.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', snippetRouter);

setupSwagger(app);
export default app;
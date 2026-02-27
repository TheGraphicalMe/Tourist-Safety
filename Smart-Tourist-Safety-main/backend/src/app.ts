import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';


export const app = express();


app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));


app.get('/', (req, res) => res.json({ ok: true, message: 'Smart Tourist Safety Backend' }));


app.use('/api', routes);


// global error handler
app.use(errorHandler);


export default app;
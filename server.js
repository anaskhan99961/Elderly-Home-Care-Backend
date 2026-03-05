import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import routes from './routes/index.js';

connectDB();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', routes);
app.get('/api/health', (req, res) => res.json({ ok: true }));

app.get('/', (req, res) => {
  res.send('Welcome to the Elderly Home Care API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

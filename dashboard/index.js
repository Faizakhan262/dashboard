import express from 'express';
import mongoose from 'mongoose';
import apiRoutes from './Routes/apiRoutes.mjs'; 
import cors from 'cors';

const app = express();
app.use(cors());

app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true 
}));
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(204)
  } else {
    next();
  }
});
app.options('*', cors()); 
app.use(express.json()); // Middleware to parse JSON bodies

// Session configuration
const MONGO_URI = 'mongodb://localhost:27017/Population';


// Route handling
app.use('/api/', apiRoutes);

app.use('/api', apiRoutes);
app.post('/api/User', (req, res) => {
  res.send('Welcome to the API!');
});


// MongoDB connection and server start
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected successfully');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => console.error('MongoDB connection error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
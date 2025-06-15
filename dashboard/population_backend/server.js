import express from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './Routes/apiRoutes.mjs'; 

dotenv.config(); 

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/Population'; // Fallback URI

const app = express();
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8080']  // Allow both your front-end and GeoServer to make requests
}));
app.use(express.json()); // To parse incoming JSON requests

// MongoDB Connection
connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Register your routes
app.use('/api', apiRoutes);  // The user routes will be available under `/api/users`

// A sample route
app.get('/', (req, res) => {
  res.send("Hello from the backend!");
});
app.use('/api', apiRoutes);
app.post('/api/User', (req, res) => {
  res.send('Welcome to the API!');
});
// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

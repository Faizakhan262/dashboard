import { Router } from 'express';
import User from '../Models/User.js';
const router = Router();

// Route to fetch all users from the database
router.get('/User', async (req, res) => {
  try {
    const users = await User.find();  // Mongoose method to fetch all users
    console.log(users)
    res.json(users);  // Return users in JSON format
  } catch (err) {
    res.status(500).send(err);  // Error handling
  }
});

export default router;

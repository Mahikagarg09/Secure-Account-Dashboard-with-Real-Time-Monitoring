import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/User'; 


const router = express.Router();

//to get particular user data
router.get('/:id', async (req: Request, res: Response) => {
  const userId = req.params.id;

  try {
    const user= await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

//to get all users data
router.get('/', async (req: Request, res: Response) => {
    try {
      const users = await User.find();
  
      if (!users) {
        return res.status(404).json({ error: 'No users found' });
      }
  
      return res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });


export default router;

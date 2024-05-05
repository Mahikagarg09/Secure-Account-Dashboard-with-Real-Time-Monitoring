import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/User'; 
import Device from '../models/Device';


const router = express.Router();

// to get all users data
router.get('/users', async (req: Request, res: Response) => {
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

  router.get('/devices', async (req, res) => {
    try {
        const devices = await Device.find();

        if (!devices || devices.length === 0) {
            return res.status(404).json({ error: 'No active devices found' });
        }

        return res.status(200).json(devices);
    } catch (error) {
        console.error('Error fetching devices:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

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


export default router;

import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { appDataSource } from '../datasource.js';
import User from '../entities/user.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const repo = appDataSource.getRepository(User);

    const { email, username, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email et mot de passe requis',
      });
    }

    const existingUser = await repo.findOne({
      where: [{ email }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Email déjà utilisé',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = repo.create({
      email,
      username,
      password: hashedPassword,
    });

    await repo.save(user);

    return res.status(201).json({
      message: 'Compte créé',
    });
  } catch (error) {
    console.error('REGISTER ERROR:', error);

    return res.status(500).json({
      message: 'Erreur serveur',
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const repo = appDataSource.getRepository(User);

    const { email, password } = req.body;

    console.log('LOGIN BODY:', req.body);

    const user = await repo.findOneBy({ email });

    console.log('USER FOUND:', user);

    if (!user) {
      return res.status(401).json({
        message: 'Identifiants invalides',
      });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({
        message: 'Identifiants invalides',
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('LOGIN ERROR:', error);

    res.status(500).json({
      message: 'Erreur serveur',
    });
  }
});

export default router;

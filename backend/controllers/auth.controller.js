import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { appDataSource } from '../datasource.js';
import User from '../entities/user.js';

export const register = async (req, res) => {
  const { email, username, password } = req.body;

  const repo = appDataSource.getRepository(User);

  const existingUser = await repo.findOneBy({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = repo.create({
    email,
    username,
    password: hashedPassword,
  });

  await repo.save(user);

  res.json({ message: 'User created' });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const repo = appDataSource.getRepository(User);

  const user = await repo.findOneBy({ email });

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, username: user.username },
    'SECRET_KEY',
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
    },
  });
};

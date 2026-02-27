import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../models/User.model';
import { jwtConfig } from '../config';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, phone, location, role, idProof } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash,
      phone,
      location,
      role: role || 'tourist',
      idProof,
    });

    const signOptions: SignOptions = { expiresIn: jwtConfig.expiresIn as any };
    const token = jwt.sign({ id: user._id, role: user.role }, jwtConfig.secret, signOptions);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        role: user.role,
        idProof: user.idProof,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const signOptions: jwt.SignOptions = { expiresIn: jwtConfig.expiresIn as any };
    const token = jwt.sign({ id: user._id, role: user.role }, jwtConfig.secret, signOptions);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        role: user.role,
        idProof: user.idProof,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req: Request, res: Response) => {
  const userId = (req as any).userId; // from your auth middleware
  const user = await User.findById(userId).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user });
};
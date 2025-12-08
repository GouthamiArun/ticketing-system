import jwt from 'jsonwebtoken';
import { userDAO } from '../dao/user.dao';
import { IUser } from '../models/User.model';

const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || 'default-secret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  
  return jwt.sign({ userId }, secret, { expiresIn } as jwt.SignOptions);
};

export const signup = async (data: {
  email: string;
  password: string;
  name: string;
  department?: string;
}): Promise<{ user: IUser; token: string }> => {
  const existingUser = await userDAO.findByEmail(data.email);
  
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  const user = await userDAO.create(data);
  const token = generateToken(user._id.toString());

  return { user, token };
};

export const login = async (email: string, password: string): Promise<{ user: IUser; token: string }> => {
  const user = await userDAO.findByEmail(email);
  
  if (!user) {
    throw new Error('Invalid credentials');
  }

  if (!user.isActive) {
    throw new Error('Your account has been deactivated');
  }

  const isPasswordValid = await user.comparePassword(password);
  
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user._id.toString());

  return { user, token };
};

export const getMe = async (userId: string): Promise<IUser | null> => {
  const user = await userDAO.findById(userId);
  
  if (user && !user.isActive) {
    throw new Error('Your account has been deactivated');
  }
  
  return user;
};

export const updateProfile = async (userId: string, data: { name: string }): Promise<IUser | null> => {
  const user = await userDAO.findById(userId);
  
  if (!user) {
    throw new Error('User not found');
  }

  // Only allow updating name, email should not be updated
  const updatedUser = await userDAO.updateById(userId, { name: data.name });
  
  return updatedUser;
};

export const updatePassword = async (userId: string, currentPassword: string, newPassword: string): Promise<void> => {
  const user = await userDAO.findById(userId);
  
  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await user.comparePassword(currentPassword);
  
  if (!isPasswordValid) {
    throw new Error('Current password is incorrect');
  }

  // Update password - the pre-save hook will hash it
  user.password = newPassword;
  await user.save();
};

export const verifyToken = (token: string): any => {
  const secret = process.env.JWT_SECRET || 'default-secret';
  return jwt.verify(token, secret);
};

export const authService = {
  signup,
  login,
  getMe,
  updateProfile,
  updatePassword,
  verifyToken,
};

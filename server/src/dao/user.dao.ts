import { createBaseDAO } from './base.dao';
import { User, IUser } from '../models/User.model';
import { ROLES } from '../config/constants';

const baseDAO = createBaseDAO<IUser>(User);

export const findByEmail = async (email: string): Promise<IUser | null> => {
  return await User.findOne({ email }).select('+password');
};

export const findActiveAgents = async (): Promise<IUser[]> => {
  return await baseDAO.findAll({
    role: { $in: [ROLES.AGENT, ROLES.ADMIN] },
    isActive: true,
  });
};

export const findByRole = async (role: string): Promise<IUser[]> => {
  return await baseDAO.findAll({ role, isActive: true });
};

export const deactivateUser = async (id: string): Promise<IUser | null> => {
  return await baseDAO.updateById(id, { isActive: false } as any);
};

export const activateUser = async (id: string): Promise<IUser | null> => {
  return await baseDAO.updateById(id, { isActive: true } as any);
};

export const updatePassword = async (id: string, newPassword: string): Promise<IUser | null> => {
  const user = await User.findById(id).select('+password');
  if (!user) return null;

  user.password = newPassword;
  await user.save();
  return user;
};

export const userDAO = {
  ...baseDAO,
  findByEmail,
  findActiveAgents,
  findByRole,
  deactivateUser,
  activateUser,
  updatePassword,
};

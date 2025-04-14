
import { User } from "@/types";

export const sanitizeUser = (user: User): User => {
  // Remove sensitive information like password
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

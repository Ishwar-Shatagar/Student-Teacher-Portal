
import { createContext } from 'react';
import { Student, ProfessionalUser } from '../types';

interface AuthContextType {
  user: Student | ProfessionalUser | null;
  login: (id: string, password: string, role: 'student' | 'faculty' | 'hod_principal') => Promise<boolean>;
  logout: () => void;
  updateUser: (updatedData: Partial<Student | ProfessionalUser>) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  updateUser: () => {},
});

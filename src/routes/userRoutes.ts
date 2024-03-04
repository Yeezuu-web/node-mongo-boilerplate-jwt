import {
  activationUser,
  loginUser,
  logoutUser,
  registration,
} from '@/controllers';
import isAuthenticated from '@/middlewares/authMiddleware';
import { Router } from 'express';

const UserRoutes = Router();

UserRoutes.post('/register', registration);
UserRoutes.post('/activate-user', activationUser);
UserRoutes.post('/login', loginUser);
UserRoutes.post('/logout', isAuthenticated, logoutUser);

export default UserRoutes;

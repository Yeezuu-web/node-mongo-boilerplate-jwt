import { Router } from 'express';

const healthRoutes = Router();

healthRoutes.get('/', (req, res) => {
  const status = 'UP';
  return res.status(200).json({ status });
});

export default healthRoutes;

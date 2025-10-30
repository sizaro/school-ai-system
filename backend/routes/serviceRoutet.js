import express from 'express';
const router = express.Router();
import {
  updateServicet
} from '../controllers/servicesController.js';

router.put('/:id', updateServicet);


export default router

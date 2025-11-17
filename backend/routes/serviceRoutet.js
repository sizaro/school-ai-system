import express from 'express';
const router = express.Router();
import {
  updateServiceTransactiont
} from '../controllers/servicesController.js';

router.put('/:id', updateServiceTransactiont);


export default router

import { Router } from 'express';
import { AuthController } from './auth.controller';
import { OtpController } from './otp.controller';

const router = Router();
const authController = new AuthController();
const otpController = new OtpController();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/check-phone', authController.checkPhone);
router.post('/verify-otp', otpController.verify);

export default router;

import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/users';
import { validateRequest } from '@hwbtickets/common';
import { BadRequestError } from '@hwbtickets/common';
import { Password } from '../services/password';
const router = express.Router();

router.post('/api/users/signin', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('You must supply a password')
],
validateRequest,
async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        throw new BadRequestError('no user found');
    }

    const passwordMatch = await Password.compare(
        existingUser.password,
         password
    );

    if (!passwordMatch) {
        throw new BadRequestError('password mismatch');
    }
    res.status(201).send();
})

export { router as signinUserRouter};

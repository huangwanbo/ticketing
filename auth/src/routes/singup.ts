import express ,{Request, Response} from 'express';
import { body, validationResult } from 'express-validator';
import { BadRequestError } from '@hwbtickets/common';
import { validateRequest } from '@hwbtickets/common';
import jwt from 'jsonwebtoken';
import { User } from '../models/users'
const router = express.Router();

router.post('/api/users/signup', 
[
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be between 4 and 20 characters'),
    validateRequest
],
async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email: email });

    if(existingUser) {
        throw new BadRequestError('Email in use');
    }

    const user = User.build({ email: email, password: password });
    await user.save();

    //generate jwt token;
    const userJwt = jwt.sign({
            id: user.id,
            email:user.email
        }, 
        process.env.JWT_KEY!
        );

    //store jwt token;
    req.session = {
        jwt: userJwt
    };
    res.status(201).send(user);    
})

export { router as signupUserRouter};

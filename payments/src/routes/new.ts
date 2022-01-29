import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { requireAuth, validateRequest, NotFoundError, OrderStatus, BadRequestError, NotAuthorizedError} from '@hwbtickets/common';
import { body } from 'express-validator';
import { natsWrapper } from '../nats-wrapper';
import { Order } from '../models/orders';
import { stripe } from '../stripe';
import { Payment } from '../models/payments';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post('/api/payments', 
    [
        requireAuth, 
        body('token')
            .not()
            .isEmpty(),
        body('orderId')
            .not()
            .isEmpty()
    ],
    async (req: Request, res: Response) => {
        const { token, orderId } = req.body;
        
        const order = await Order.findById(orderId);

        if (!order) {
            throw new NotFoundError();
        }
        
        if(order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        if (order.status === OrderStatus.Cancelled) {
            throw new BadRequestError('Cannot pay for an cancelled order');
        }

        const charge = await stripe.charges.create({
            currency: 'usd',
            amount: order.price * 100,
            source: token,
        });

        const payment = Payment.build({
            orderId,
            stripeId: charge.id
        });

        await payment.save();

        res.status(201).send({ success: true });
    }
);

export { router as createChargeRouter };
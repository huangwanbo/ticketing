import express, { Request, Response } from 'express';
import { Order } from '../models/order';
import { OrderStatus, requireAuth, NotFoundError, NotAuthorizedError } from '@hwbtickets/common';
import { OrderCannelledPublisher } from '../events/publishers/order-cannelled-publisher';
import { natsWrapper } from '../nats-wrapper'

const router = express.Router();

router.delete('/api/orders/:orderId',requireAuth, async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
        throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    new OrderCannelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: { 
            id: order.ticket.id,
        }
    })
    res.status(204).send(order);
});

export { router as deleteOrderRouter };
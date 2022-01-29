import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCancelledEvent, OrderStatus } from '@hwbtickets/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/orders';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        // find the ticket that the order is reserving
        const order = await Order.findOne({
            _id: data.id,
            version: data.version - 1
        });

        // if not ticket, throw error
        if( !order ) throw new Error('Order no found');
        // Mark the ticket as being reserved by setting its orderId property
        order.set({ status: OrderStatus.Cancelled });
        // save the ticket

        await order.save();

        msg.ack();
    }
}
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsWrapper } from '../../../__mocks__//nats-wrapper';
import { Order } from '../../../models/orders';
import { OrderCancelledEvent, OrderStatus } from '@hwbtickets/common';
const setup = async () => {
    //@ts-ignore
    const listener = new OrderCancelledListener(natsWrapper.client);

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        price: 10,
        userId: 'abcd',
        version: 0
    });

    await order.save();

    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: 1,
        ticket: {
            id: 'abcd',
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg };
};

it('updates the ticket, publlishes an event, and acks the message', async () => {
    // create an instance od the listener
    // create a fake data event
    // create a fake message object
    const { listener, data, msg  } = await setup();

    await listener.onMessage(data, msg);

    const order = await Order.findById(data.id);
    
    expect(order!.status).toEqual(OrderStatus.Cancelled);
    // call the onMessage function wieh the data object + message object


    // write assertions to make sure a ticket was created!
    
});

it('ack the message', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();

})

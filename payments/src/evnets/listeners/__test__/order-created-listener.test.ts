import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { OrderCreatedListener } from '../order-create-listener';
import { natsWrapper } from '../../../__mocks__/nats-wrapper';
import { OrderCreatedEvent, OrderStatus } from '@hwbtickets/common';
import { Order } from '../../../models/orders';
const setup = async () => {
    //@ts-ignore
    const listener = new OrderCreatedListener(natsWrapper.client);

    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'asdf',
        expiresAt: 'abcd',
        ticket: {
            id: 'adfdsf',
            price: 10
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener , data, msg };
};

it('set the userId of the ticket', async () => {
    // create an instance od the listener
    // create a fake data event
    // create a fake message object
    const { listener, data, msg  } = await setup();

    await listener.onMessage(data, msg);

    const order = await Order.findById(data.id);
    
    expect(order!.price).toEqual(data.ticket.price);
    // call the onMessage function wieh the data object + message object


    // write assertions to make sure a ticket was created!
    
});

it('ack the message', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();

})

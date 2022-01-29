import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../__mocks__//nats-wrapper';
import { Ticket } from '../../../models/ticket';
import { OrderCreatedEvent, OrderStatus } from '@hwbtickets/common';
const setup = async () => {
    //@ts-ignore
    const listener = new OrderCreatedListener(natsWrapper.client);

    const ticket = Ticket.build({
        title: 'concert',
        price: 99,
        userId: 'asdf'
    })

    await ticket.save()

    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'asdf',
        expiresAt: 'abcd',
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, ticket, data, msg };
};

it('set the userId of the ticket', async () => {
    // create an instance od the listener
    // create a fake data event
    // create a fake message object
    const { listener, data, msg, ticket } = await setup();

    await listener.onMessage(data, msg);

    const updateTicket = await Ticket.findById(ticket.id);
    
    expect(ticket).toBeDefined();
    expect(updateTicket!.userId).toEqual(data.userId);
    // call the onMessage function wieh the data object + message object


    // write assertions to make sure a ticket was created!
    
});

it('ack the message', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();

})

it('publishes a ticket updated event', async () => {
   const { listener, ticket, data, msg } = await setup();
   
   await listener.onMessage(data, msg);

   expect(natsWrapper.client.publish).toHaveBeenCalled();

   // @ts-ignore
   const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
   
});
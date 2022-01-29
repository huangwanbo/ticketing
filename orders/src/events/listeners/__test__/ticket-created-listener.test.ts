import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedListener } from '../ticket-created-listener';
import { TicketCreatedEvent } from '@hwbtickets/common'
import mongoose from 'mongoose';
import {Message} from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setup = async () => {

    const listener = new TicketCreatedListener(natsWrapper.client);

    const data: TicketCreatedEvent['data'] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        price: 10,
        title: 'concert',
        userId: new mongoose.Types.ObjectId().toHexString()
    }

    // @ts-ignore
    const msg : Message = {
        ack: jest.fn()
    }
    return { listener, data, msg };
}

it('create and saves a ticket', async () => {
    // create an instance od the listener
    // create a fake data event
    // create a fake message object
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const ticket = await Ticket.findById(data.id);
    
    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
    // call the onMessage function wieh the data object + message object


    // write assertions to make sure a ticket was created!
    
});

it('ack call', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();

})


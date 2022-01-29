import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedListener } from '../ticket-update-listener';
import { TicketUpdatedEvent } from '@hwbtickets/common'
import mongoose from 'mongoose';
import {Message} from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setup = async () => {

    const listener = new TicketUpdatedListener(natsWrapper.client);


    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });

    await ticket.save();

    const data: TicketUpdatedEvent['data'] = {
        version: ticket.version + 1,
        id: ticket.id,
        price: 10,
        title: 'concert',
        userId: new mongoose.Types.ObjectId().toHexString()
    };

    // @ts-ignore
    const msg : Message = {
        ack: jest.fn()
    }
    return { listener, data, msg, ticket };
}

it('update and saves a ticket', async () => {
    // create an instance od the listener
    // create a fake data event
    // create a fake message object
    const { listener, data, msg, ticket } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket).toBeDefined();
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).not.toEqual(data.version);
    // call the onMessage function wieh the data object + message object


    // write assertions to make sure a ticket was created!
    
});

it('ack the message', async () => {
    const { listener, data, msg, ticket } = await setup();

    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
    

})


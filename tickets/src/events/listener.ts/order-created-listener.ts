import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCreatedEvent } from '@hwbtickets/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatePublisher } from '../publishers/ticket-updated-publisher';
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        // find the ticket that the order is reserving
        const ticket = await Ticket.findById(data.ticket.id);

        // if not ticket, throw error
        if(!ticket) throw new Error('Ticket no found');
        // Mark the ticket as being reserved by setting its orderId property
        ticket.set({ orderId: data.id });
        // save the ticket

        await ticket.save();
        await new TicketUpdatePublisher (this.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version
        });
        msg.ack();
    }
}
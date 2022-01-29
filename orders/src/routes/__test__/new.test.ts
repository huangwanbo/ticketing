import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order } from '../../models/order';
import { OrderStatus } from '@hwbtickets/common';
import { natsWrapper } from '../../nats-wrapper';

it('return as error if the ticket does not exits', async () => {
    const ticketId = new mongoose.Types.ObjectId().toHexString();
    const cookie = process.signin();
    const response = await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({
            ticketId
        })
        .expect(404)
})

it('return as error if the ticket is already reserved', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });
    const cookie = process.signin();
    await ticket.save();
    const order = Order.build({
        ticket,
        userId: 'sdfsdljk',
        status: OrderStatus.Created,
        expiresAt: new Date()
    });
    await order.save();
    await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({ ticketId: ticket.id})
        .expect(400);
})

it('reserved a ticket', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });
    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', process.signin())
        .send({ ticketId: ticket.id })
        .expect(201);
})

it('emit an order created event',async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
    });
    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', process.signin())
        .send({ ticketId: ticket.id})
        .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
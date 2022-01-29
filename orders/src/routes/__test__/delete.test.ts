import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { OrderStatus } from '@hwbtickets/common';
import { natsWrapper } from '../../nats-wrapper';
it('marks an order as cancelled', async() => {
    // create a ticket with Ticket Model
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });

    await ticket.save();

    const user = process.signin();
    // make a request to create an Order
    const { body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);
    //make a request to cancel the ordred order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204)
    // expectation to make sure the thing is cancelled
    const updateOrder = await Order.findById(order.id);
    expect(updateOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emit an order created event',async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });

    await ticket.save();

    const user = process.signin();
    // make a request to create an Order
    const { body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);
    //make a request to cancel the ordred order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204)

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
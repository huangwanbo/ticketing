import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/orders';
import { OrderStatus } from '@hwbtickets/common';
import { natsWrapper } from '../../nats-wrapper';
import {stripe} from '../../stripe';
import { Payment } from '../../models/payments';

it('return as error if the order does not exits', async () => {
    const token = new mongoose.Types.ObjectId().toHexString();
    const orderId = new mongoose.Types.ObjectId().toHexString();
    const cookie = process.signin();
    const response = await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({
            token,
            orderId
        })
        .expect(404)
})

it('return as error if the order is already reserved', async () => {
    const cookie = process.signin();
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 20,
        status: OrderStatus.Created
    });
    await order.save();
    await request(app)
        .post('/api/payments')
        .set('Cookie', cookie)
        .send({ 
            token: 'abcdsf',
            orderId: order.id
        })
        .expect(401);
})

it('return 400 when purchasing a cancelled order', async () => {
    const userId =  new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 20,
        status: OrderStatus.Cancelled,
        userId
    });
    const cookie = process.signin(userId);
    await order.save();
    await request(app)
        .post('/api/payments')
        .set('Cookie', cookie)
        .send({ 
            token: 'abcdsf',
            orderId: order.id
        })
        .expect(400);
});


it('return a 201 with valid inputs', async () => {
    const userId =  new mongoose.Types.ObjectId().toHexString();
    const price = Math.floor(Math.random() * 100000);
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: price,
        status: OrderStatus.Created,
        userId
    });
    const cookie = process.signin(userId);
    await order.save();

    await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({ 
        token: 'tok_visa',
        orderId: order.id
    })
    .expect(201);

    const stripeCharges = await stripe.charges.list({ limit: 50});
    const stripeCharge = stripeCharges.data.find(charge => {
        return charge.amount === price * 100;
    })

    expect(stripeCharge).toBeDefined();
    expect(stripeCharge!.currency).toEqual('usd');

    const payment = await Payment.findOne({
        orderId: order.id,
        stripeId: stripeCharge!.id
    });
    
    expect(payment).not.toBeNull();
});


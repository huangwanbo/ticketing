import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';
jest.mock('../../nats-wrapper');

it('has a route handler listening to /api/tickets for post request', async() => {
    const response = await request(app)
        .post('/api/tickets')
        .send({});

    expect(response.status).not.toEqual(404);
})

it('can only be accessed if the user is signed in ', async() => {
    await request(app)
        .post('/api/tickets')
        .send({})
        .expect(401);
})

it('returns a status other than 401 if the user is not signed in', async() => {
    const token = process.signin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', token)
        .send({});
        
        expect(response.status).not.toEqual(401);
})

it('return an error if an invalid title is provided', async() => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', process.signin())
        .send({
            title: '',
            price: -10
        })
        .expect(400);
})

it('ha a route handler listening to /api/tickets for post request', async() => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', process.signin())
        .send({
            title: 'aaaaa',
        })
        .expect(400);
})

it('creates a ticket with valid inputs', async() => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    await request(app)
        .post('/api/tickets')
        .set('Cookie', process.signin())
        .send({
            title: 'ticket',
            price: 10
        })
        .expect(201);
    
        tickets = await Ticket.find({ title: 'ticket' });
        expect(tickets.length).toEqual(1);
        expect(tickets[0].price).toEqual(10);
        expect(tickets[0].title).toEqual('ticket');
})

it('publishes an event',async () => {
    const title = 'adfd';
    await request(app)
        .post('/api/tickets')
        .set('Cookie', process.signin())
        .send({
            title,
            price: 20,
        })
        .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
    
})
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';
it('return a 404 if the ticket is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .get(`/api/tickets/${id}`)
        .send()
        .expect(404);
});

it('return the ticket if the ticket is found', async () => {
    const title = 'Ticket';
    const price = 20;
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', process.signin())
        .send({
            title,
            price
        });
    console.log('response.body',response.body);
    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200);
    
        
    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);
});


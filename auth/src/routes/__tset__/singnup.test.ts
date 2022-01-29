import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
    return request(app)
                .post('/api/users/signup')
                .send({ 
                    email: 'test@test.com',
                    password: 'password'
                })
                .expect(201);
});

it('returns a 400 on invalid email', async () => {
    return request(app)
                .post('/api/users/signup')
                .send({ 
                    email: 'test',
                    password: 'password'
                })
                .expect(400);
});

it('set cookies after successful signup', async () => {
    const response = await request(app)
                .post('/api/users/signup')
                .send({ 
                    email: 'test@test.com',
                    password: 'password'
                })
                .expect(201);
    
    expect(response.get('Set-Cookie')).toBeDefined();
})
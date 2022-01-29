import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import  { app } from "../app";
import request from 'supertest';


let mongo: any;
beforeAll(async () => {
    process.env.JWT_KEY = 'abcd';
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    mongo = await MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri);
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

declare global {
    namespace NodeJS {
        interface Process {
            signin(): Promise<string[]>;
        }
    }
}

process.signin = async () => {
    const email = 'test@test.com';
    const password = 'password';

    const response = await request(app)
        .post('/api/users/signup')
        .send({ email: email, password: password})
        .expect(201);

    const cookies = response.get('Set-Cookie');
    return cookies;
}
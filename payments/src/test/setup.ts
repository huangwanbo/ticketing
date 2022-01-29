import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import  { app } from "../app";
import request from 'supertest';
import jwt from 'jsonwebtoken';

jest.mock('../nats-wrapper');
process.env.STRIPE_KEY = 'sk_test_51KMjylJ6CuZizFmkm9XuExWUfsIqLKRqr9sxNzgr5q90nEdcp3nBVJhW7DN4E1IEXcZgjwvtwXBkMIt71eO3EXLw00otZHiOtx'

let mongo: any;
beforeAll(async () => {
    process.env.JWT_KEY = 'abcd';
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    mongo = await MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri);
});

beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

// afterAll(async () => {
//        jest.setTimeout(100*1000);
//         await mongo.stop();
//         await mongoose.connection.close();
// });

declare global {
    namespace NodeJS {
        interface Process {
            signin(id?: string): string[];
        }
    }
}

process.signin = (id?: string) => {
    // Build a JWT payload. { id, email }
    const payload = {
        id: id || new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    }

    // Create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build session Object. { jwt: MY_JWT }
    const session = { jwt: token };
    const sessionJSON = JSON.stringify(session);

    // Turn that session into JSON
    const base64 = Buffer.from(sessionJSON).toString('base64');
    //Take JSON and encode it as base64

    //return a string thats the cookie with th encoded data
    return [`session=${base64}`];
}
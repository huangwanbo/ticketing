import mongoose from 'mongoose';
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-update-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';
const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('no JWT_KEY');
    }
    if (!process.env.MONGO_URI) {
        throw new Error('no MONGO_URI');
    }
    if (!process.env.NATS_CLUSTER_ID) { 
        throw new Error('no NATS_CLUSTER_ID');
    }
    if (!process.env.NATS_URL) {
        throw new Error('no NATS_URL');
    }
    if (!process.env.NATS_CLIENT_ID) {
        throw new Error('no NATS_CLIENT_ID');
    }
    try{
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL);
        natsWrapper.client.on('close', () => {
            console.log('Listener connected to NATS');
            process.exit();    
        })
        process.on('SIGINT',() => {
            natsWrapper.client.close();
        })
        process.on('SIGTERM', () => {
            natsWrapper.client.close();
        })

        new TicketCreatedListener(natsWrapper.client).listen();
        new TicketUpdatedListener(natsWrapper.client).listen();
        new ExpirationCompleteListener(natsWrapper.client).listen();
        new PaymentCreatedListener(natsWrapper.client).listen();
        await mongoose.connect(`${process.env.MONGO_URI}`, {
            // useNewUrlParser: true,
           // useUnifiedTopology: true,
            //useCreateIndex: true
        });
        console.log('mongodb connect');
    } catch (err) {
        console.error(err);
        
    }
    
}
import { app } from './app';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';

app.listen(3000, () => {
    start()
    console.log("Listening to 3000!!!!!");
    
})
import mongoose from 'mongoose';
import { natsWrapper } from './nats-wrapper';
import { OrderCancelledListener } from './evnets/listeners/order-cancelled-listener';
import { OrderCreatedListener } from './evnets/listeners/order-create-listener';

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

        await new OrderCancelledListener(natsWrapper.client).listen();
        await new OrderCreatedListener(natsWrapper.client).listen();
        
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

app.listen(3000, () => {
    start()
    console.log("Listening to 3000!!!!!");
    
})
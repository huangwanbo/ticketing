import mongoose from 'mongoose';

const start = async () => {
    console.log('Starting up....');
    
    if (!process.env.JWT_KEY) {
        throw new Error('no JWT_KEY');
    }
    if (!process.env.MONGO_URI) {
        throw new Error('no MONGO_URI');
    }
    try{
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
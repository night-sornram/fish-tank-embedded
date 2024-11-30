import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://6633236021:73fnFPX4GZtdJG2e@embedded.bhuaq.mongodb.net/?retryWrites=true&w=majority&appName=embedded";

const connectDB = async () => {
    mongoose.set('strictQuery', true);
    const conn = await mongoose.connect(MONGO_URI, {dbName: 'esp32'});
    console.log(`MongoDB Connected : ${conn.connection.host}`);
};

export default connectDB;
import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI as string)
        console.log('MongoDB connected Successfull')
    } catch (error) {
        console.error('MongoDB connection Failed:', error)
        process.exit(1)
    }
}
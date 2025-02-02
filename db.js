import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        await mongoose.connect(process.env.DB); 
        console.log('Database Connected');
    } catch (error) {
        console.log('Error connecting to database:', error);
    }  
};

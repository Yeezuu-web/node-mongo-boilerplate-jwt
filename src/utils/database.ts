import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const databaseURL = process.env.DATABASE_URL || '';

const connectDB = async () => {
  try {
    await mongoose.connect(databaseURL).then((data: any) => {
      console.log(`Database is connected to ${data.connection.host}`);
    });
  } catch (error: any) {
    console.log(error);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;

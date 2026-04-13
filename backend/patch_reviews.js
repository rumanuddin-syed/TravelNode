import mongoose from 'mongoose';
import User from './models/User.js';
import Review from './models/Review.js';
import dotenv from 'dotenv';

dotenv.config();

const patch = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('DB connected');

        // Find the user
        const user = await User.findOne({ username: /SYED RUMANUDDIN/i });
        if (!user) {
            console.log('User not found');
            process.exit(1);
        }
        console.log(`Found user: ${user.username} (${user._id})`);

        // Find reviews with relevant names
        const namesToMatch = [/SYED RUMANUDDIN.nmk/i, /SYED RUMANUDDIN/i];
        
        const result = await Review.updateMany(
            { 
                username: { $in: namesToMatch },
                userId: { $exists: false } 
            },
            { $set: { userId: user._id } }
        );

        console.log(`Updated ${result.modifiedCount} reviews`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

patch();

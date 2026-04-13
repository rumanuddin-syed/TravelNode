const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

async function run() {
    try {
        const envPath = '/home/syed/Project/5.TravelNode/backend/.env';
        const envContent = fs.readFileSync(envPath, 'utf8');
        const mongoUrlLine = envContent.split('\n').find(line => line.startsWith('MONGO_URL='));
        const mongoUrl = mongoUrlLine.split('=')[1].trim();

        await mongoose.connect(mongoUrl);
        console.log('Connected to MongoDB');

        const UserSchema = new mongoose.Schema({ email: String });
        const User = mongoose.model('User', UserSchema);

        const MediatorSchema = new mongoose.Schema({ userId: mongoose.Schema.Types.ObjectId });
        const Mediator = mongoose.model('Mediator', MediatorSchema);

        const BookingSchema = new mongoose.Schema({ mediatorId: String, status: String, paymentStatus: String });
        const Booking = mongoose.model('Booking', BookingSchema);

        const user = await User.findOne({ email: 'mediatorbhai@gamil.com' });
        if (!user) {
            console.log('USER_NOT_FOUND');
            process.exit(0);
        }

        const mediator = await Mediator.findOne({ userId: user._id });
        
        console.log('UID:', user._id);
        console.log('MID:', mediator ? mediator._id : 'NONE');

        // Look for bookings using BOTH IDs
        const bookingsWithUserId = await Booking.find({ mediatorId: user._id.toString() });
        const bookingsWithMedId = await Booking.find({ mediatorId: mediator ? mediator._id.toString() : 'NONE' });

        console.log('LEGACY_COUNT:', bookingsWithUserId.length);
        console.log('MODERN_COUNT:', bookingsWithMedId.length);

        if (bookingsWithUserId.length > 0) {
            console.log('--- Legacy Bookings ---');
            bookingsWithUserId.forEach(b => console.log(`ID: ${b._id} Status: ${b.status} Payment: ${b.paymentStatus}`));
        }

        if (bookingsWithMedId.length > 0) {
            console.log('--- Modern Bookings ---');
            bookingsWithMedId.forEach(b => console.log(`ID: ${b._id} Status: ${b.status} Payment: ${b.paymentStatus}`));
        }

        process.exit(0);
    } catch (error) {
        console.error('DIAG_ERROR:', error);
        process.exit(1);
    }
}

run();

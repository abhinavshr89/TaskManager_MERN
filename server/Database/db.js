import mongoose from 'mongoose';


const uri ="mongodb+srv://user_abhi:abhi1234@cluster0.ewusz1w.mongodb.net/testing";
const connectDb = async () => {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1); // Exit with a non-zero exit code
    }
};

export default connectDb;

import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

export const connectDB = async() => {

    try {
        await mongoose.connect(process.env.MONGO_URI!)
        console.log("MongoDB Connected Successfully✅")
        
    } catch (error) {
        console.log("MongoDB Not Connected❌")
        console.log(error)
        process.exit(1)
        
    }
}

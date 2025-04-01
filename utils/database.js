import mongoose from "mongoose";

let isConnected = false;

export const ConnectToDB = async () => {
    if (isConnected) {
        return
    }

    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            dbName: "interviewee"
        })
        isConnected = true
        console.log("connected")
    } catch (err) {
        console.log("error in connecting database", err)
    }
}
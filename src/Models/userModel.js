import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: false,
        trim: true,
    },
    mobile: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    otp: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        enum: ["user"],
        default: "user",
    },
},
    { timestamps: true }
)

const UserModel = mongoose.model('user', userSchema)
export default UserModel;
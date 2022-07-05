import { model, Schema } from "mongoose";
import { IUserModel } from "../../interfaces/IUserModel"
import { IRoom } from "../../interfaces/IRoom"

// const RoomSchema = new Schema<IRoom>({
//     name: String,
//     mutes: [String],
//     bans: [String],
//     moderators: [String],
//     limit: Number
// }) 


const UserSchema = new Schema<IUserModel>({
    id:String,
    currency:Number,
    roles: [String],
    ban: Boolean,
    mute: Boolean,
    gender: Number,
    // room: RoomSchema
})




export const User =  model<IUserModel>("User", UserSchema)
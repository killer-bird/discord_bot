import { model, Schema } from "mongoose";
import { IRoom } from "../../interfaces/IRoom"


const RoomSchema = new Schema<IRoom>({
    id: String,
    owner: String,
    name: String,
    mutes: [String],
    bans: [String],
    moderators: [String],
    limit: Number
})


export const Room =  model<IRoom>("Room", RoomSchema)
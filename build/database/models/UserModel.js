"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
// const RoomSchema = new Schema<IRoom>({
//     name: String,
//     mutes: [String],
//     bans: [String],
//     moderators: [String],
//     limit: Number
// }) 
const UserSchema = new mongoose_1.Schema({
    id: String,
    currency: Number,
    roles: [String],
    ban: Boolean,
    mute: Boolean,
    gender: Number,
    // room: RoomSchema
});
exports.User = (0, mongoose_1.model)("User", UserSchema);

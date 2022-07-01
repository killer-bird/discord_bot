"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
const mongoose_1 = require("mongoose");
const RoomSchema = new mongoose_1.Schema({
    id: String,
    owner: String,
    name: String,
    mutes: [String],
    bans: [String],
    moderators: [String],
    limit: Number,
    invisible: Boolean,
    closed: Boolean
});
exports.Room = (0, mongoose_1.model)("Room", RoomSchema);

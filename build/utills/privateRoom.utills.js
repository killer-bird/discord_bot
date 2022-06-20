"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoom = exports.createRoom = void 0;
const config_1 = require("../config");
const RoomModel_1 = require("../database/models/RoomModel");
const createRoom = (user, guild, roomConfig) => __awaiter(void 0, void 0, void 0, function* () {
    const room = yield RoomModel_1.Room.findOne({ owner: user.id });
    return yield guild.channels.create(room.name, {
        type: 'GUILD_VOICE',
        parent: config_1.privateRoomConfig.categoryChannel,
        userLimit: room.limit,
    });
});
exports.createRoom = createRoom;
const deleteRoom = (voice) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!voice.members.size) {
            yield RoomModel_1.Room.updateOne({ id: voice.id }, { id: null });
            yield voice.delete();
        }
    }
    catch (error) {
        console.log(error);
        return;
    }
});
exports.deleteRoom = deleteRoom;

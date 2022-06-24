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
const privateRoom_utills_1 = require("../utills/privateRoom.utills");
const RoomModel_1 = require("../database/models/RoomModel");
const onVoiceStateUpdate = (oldState, newState) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const member = newState.member;
    const room = yield RoomModel_1.Room.findOne({ owner: member.user.id });
    if (room === null || room === void 0 ? void 0 : room.id) {
        const voice = oldState.channel;
        if (oldState.channelId === room.id && newState.channelId !== room.id) {
            try {
                if (Array.from(voice.members).length === 0) {
                    yield (0, privateRoom_utills_1.deleteRoom)(voice);
                }
            }
            catch (error) {
                console.log(error);
                RoomModel_1.Room.updateOne({ id: room.id }, { id: null });
                return;
            }
        }
    }
    if (oldState.channelId !== process.env.CREATE_ROOM && newState.channelId === process.env.CREATE_ROOM) {
        if (room === null || room === void 0 ? void 0 : room.id) {
            try {
                const voice = yield newState.guild.channels.fetch(room.id);
                yield ((_a = newState.member) === null || _a === void 0 ? void 0 : _a.voice.setChannel(voice));
            }
            catch (error) {
                const voice = yield (0, privateRoom_utills_1.createRoom)(member.user, newState.guild);
                yield ((_b = newState.member) === null || _b === void 0 ? void 0 : _b.voice.setChannel(voice));
                yield RoomModel_1.Room.updateOne({ owner: member.user.id }, { id: voice.id });
            }
            return;
        }
        const voice = yield (0, privateRoom_utills_1.createRoom)(member.user, newState.guild);
        yield ((_c = newState.member) === null || _c === void 0 ? void 0 : _c.voice.setChannel(voice));
        yield RoomModel_1.Room.updateOne({ owner: member.user.id }, { id: voice.id });
    }
});
exports.default = {
    name: 'voiceStateUpdate',
    run: onVoiceStateUpdate
};

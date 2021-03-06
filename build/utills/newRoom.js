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
exports.newRoom = void 0;
const RoomModel_1 = require("../database/models/RoomModel");
const newRoom = (member) => __awaiter(void 0, void 0, void 0, function* () {
    const roomObject = {
        id: null,
        owner: member.user.id,
        name: member.user.username,
        mutes: [],
        bans: [],
        moderators: [],
        limit: null,
        invisible: false,
        closed: false,
    };
    yield new RoomModel_1.Room(roomObject).save();
});
exports.newRoom = newRoom;

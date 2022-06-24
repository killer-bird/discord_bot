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
const UserModel_1 = require("../database/models/UserModel");
const createUser_1 = require("../utills/createUser");
const newRoom_1 = require("../utills/newRoom");
const createRoomSettingsMsg_1 = require("../utills/createRoomSettingsMsg");
const onReady = (client) => __awaiter(void 0, void 0, void 0, function* () {
    const roomSettingsChannel = yield client.channels.fetch(process.env.ROOM_SETTINGS);
    if (!Array.from(yield roomSettingsChannel.messages.fetch()).length) {
        yield (0, createRoomSettingsMsg_1.createRoomSettingsMsg)(roomSettingsChannel);
    }
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    const members = yield (guild === null || guild === void 0 ? void 0 : guild.members.fetch());
    members === null || members === void 0 ? void 0 : members.forEach((member) => __awaiter(void 0, void 0, void 0, function* () {
        if (!member.user.bot && !(yield UserModel_1.User.exists({ id: member.user.id }))) {
            yield (0, createUser_1.createUser)(member);
            yield (0, newRoom_1.newRoom)(member);
        }
    }));
    console.log(client.commands);
    console.log("on ready!");
});
exports.default = {
    name: "ready",
    run: onReady,
};

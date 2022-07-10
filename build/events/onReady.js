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
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const UserModel_1 = require("../database/models/UserModel");
const RoomModel_1 = require("../database/models/RoomModel");
const utills_1 = require("../utills/");
const privateRooms_1 = require("../privateRooms");
const users_1 = require("../users");
const onReady = (client) => __awaiter(void 0, void 0, void 0, function* () {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    const members = yield (guild === null || guild === void 0 ? void 0 : guild.members.fetch());
    const rest = new rest_1.REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN);
    const commandData = client.commands.map((command) => command.data.toJSON());
    yield rest.put(v9_1.Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commandData });
    members === null || members === void 0 ? void 0 : members.forEach((member) => __awaiter(void 0, void 0, void 0, function* () {
        if (!member.user.bot && !(yield UserModel_1.User.exists({ id: member.user.id }))) {
            yield (0, utills_1.createUser)(member);
        }
        if (!member.user.bot && !(yield RoomModel_1.Room.exists({ owner: member.user.id }))) {
            yield (0, utills_1.newRoom)(member);
        }
        users_1.users[member.user.id] = {
            voiceOnline: null,
            timeLeftToReward: null
        };
    }));
    const existedRooms = yield RoomModel_1.Room.where("id").ne(null);
    existedRooms.forEach(room => {
        privateRooms_1.config[room.id] = {
            btnDelay: false,
            lifeTimer: null
        };
    });
    console.log("on ready!");
});
exports.default = {
    name: "ready",
    run: onReady,
};

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
exports.guildMemberAdd = void 0;
const UserModel_1 = require("../database/models/UserModel");
const createUser_1 = require("../utills/createUser");
const newRoom_1 = require("../utills/newRoom");
const guildMemberAdd = (member) => __awaiter(void 0, void 0, void 0, function* () {
    const oldUser = yield UserModel_1.User.findOne({ id: member.user.id });
    // await sendCaptcha(member.user)
    if (oldUser) {
        console.log(member.user, "exist!!");
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                for (const roleId of oldUser.roles) {
                    let role = yield member.guild.roles.fetch(roleId);
                    yield member.roles.add(role);
                }
            }
            catch (error) {
                console.log(error);
                return;
            }
        }), 100000);
    }
    else {
        console.log("NEW USER ADDED");
        const defaultRole = yield member.guild.roles.fetch(process.env.DEFAULT_ROLE);
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield member.roles.add(defaultRole);
            }
            catch (error) {
                console.log(error);
                return;
            }
        }), 100000);
        yield (0, createUser_1.createUser)(member);
        yield (0, newRoom_1.newRoom)(member);
    }
});
exports.guildMemberAdd = guildMemberAdd;

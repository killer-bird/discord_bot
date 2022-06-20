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
exports.createUser = void 0;
const UserModel_1 = require("../database/models/UserModel");
const getRolesArray_1 = require("../utills/getRolesArray");
const createUser = (member) => __awaiter(void 0, void 0, void 0, function* () {
    const userObject = {
        id: member.user.id,
        roles: (0, getRolesArray_1.getRolesArray)(member),
        currency: 0,
        ban: false,
        mute: false,
        gender: 1,
        // room: {
        //     name: member.user.username,
        //     mutes: [],
        //     bans: [],
        //     moderators: [],
        //     limit: undefined
        // }
    };
    yield new UserModel_1.User(userObject).save();
});
exports.createUser = createUser;

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
const getRolesArray_1 = require("../utills/getRolesArray");
const guildMemberUpdate = (oldMember, newMember) => __awaiter(void 0, void 0, void 0, function* () {
    if (oldMember.nickname === newMember.nickname) {
        console.log(newMember.roles.cache.map(m => m.id));
        yield UserModel_1.User.updateOne({ id: newMember.user.id }, { roles: (0, getRolesArray_1.getRolesArray)(newMember) });
    }
});
exports.default = {
    name: 'guildMemberUpdate',
    run: guildMemberUpdate
};

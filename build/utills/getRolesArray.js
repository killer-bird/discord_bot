"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRolesArray = void 0;
const getRolesArray = (member) => {
    return member.roles.cache.map(m => m.id).filter(r => r !== process.env.GUILD_ID);
};
exports.getRolesArray = getRolesArray;

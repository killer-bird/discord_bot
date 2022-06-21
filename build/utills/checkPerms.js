"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkModPerms = exports.checkAdmPerms = void 0;
const checkAdmPerms = (user, room) => {
    if (room.owner === user.id)
        return true;
    return false;
};
exports.checkAdmPerms = checkAdmPerms;
const checkModPerms = (user, room) => {
    if (room.moderators.includes(user.id))
        return true;
    return false;
};
exports.checkModPerms = checkModPerms;

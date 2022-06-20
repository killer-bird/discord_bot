"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
const discord_js_1 = require("discord.js");
const limitBtn_1 = require("./limitBtn");
const renameBtn_1 = require("./renameBtn");
const lockBtn_1 = require("./lockBtn");
const unlockBtn_1 = require("./unlockBtn");
const banBtn_1 = require("./banBtn");
const unbanBtn_1 = require("./unbanBtn");
exports.data = new discord_js_1.MessageActionRow()
    .addComponents(renameBtn_1.renameBtn, limitBtn_1.limitBtn, lockBtn_1.lockBtn, unlockBtn_1.unlockBtn, banBtn_1.banBtn, unbanBtn_1.unbanBtn);

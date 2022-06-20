"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
const discord_js_1 = require("discord.js");
const unbanBtn_1 = require("./unbanBtn");
const kickBtn_1 = require("./kickBtn");
const muteBtn_1 = require("./muteBtn");
const unmuteBtn_1 = require("./unmuteBtn");
const setModerBtn_1 = require("./setModerBtn");
exports.data = new discord_js_1.MessageActionRow()
    .addComponents(unbanBtn_1.unbanBtn, kickBtn_1.kickBtn, muteBtn_1.muteBtn, unmuteBtn_1.unmuteBtn, setModerBtn_1.setModerBtn);

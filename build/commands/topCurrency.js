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
exports.execute = exports.data = void 0;
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const UserModel_1 = require("../database/models/UserModel");
const bot_1 = require("../bot");
exports.data = new builders_1.SlashCommandBuilder()
    .setName("top")
    .setDescription("usertop");
function execute(interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        const topEmbed = new discord_js_1.MessageEmbed();
        topEmbed.setTitle("Топ пользователей");
        const top = yield UserModel_1.User.find({}).sort({
            currency: -1
        }).limit(10);
        top.map((topMember, index) => __awaiter(this, void 0, void 0, function* () {
            const user = yield bot_1.client.users.fetch(topMember.id);
            topEmbed.addField(`${index + 1} ${user.username}`, `${topMember.currency}`);
        }));
        yield interaction.deferReply();
        return yield interaction.editReply({ embeds: [topEmbed] });
    });
}
exports.execute = execute;

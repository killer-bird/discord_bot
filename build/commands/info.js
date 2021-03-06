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
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const UserModel_1 = require("../database/models/UserModel");
const isUserExist_1 = require("../utills/isUserExist");
const embeds_1 = require("../embeds");
const getInfoEmbed = (target) => __awaiter(void 0, void 0, void 0, function* () {
    const info = yield UserModel_1.User.findOne({ id: target === null || target === void 0 ? void 0 : target.id });
    const infoEmbed = new discord_js_1.MessageEmbed();
    infoEmbed.setTitle("Информация о пользователе")
        .setImage(`https://cdn.discordapp.com/avatars/${target === null || target === void 0 ? void 0 : target.id}/${target === null || target === void 0 ? void 0 : target.avatar}.jpg`)
        .addField('Ник', target === null || target === void 0 ? void 0 : target.username)
        .addField('Мужские cлёзки', String(info === null || info === void 0 ? void 0 : info.currency));
    return infoEmbed;
});
const data = new builders_1.SlashCommandBuilder()
    .setName("info")
    .setDescription("get info")
    .addUserOption(option => (option.setName("user")
    .setDescription("target user")));
function execute(interaction) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const target = interaction.options.getUser("user");
        const author = (_a = interaction.member) === null || _a === void 0 ? void 0 : _a.user;
        yield interaction.deferReply();
        if (target) {
            if (yield (0, isUserExist_1.isUserExist)(target.id)) {
                return interaction.editReply({ embeds: [yield getInfoEmbed(target)] });
            }
            else {
                return interaction.editReply({ embeds: [(0, embeds_1.getErrEmbed)(`
            Введен неккоректный пользователь: ${target} 
            Если это не бот, обратитесь за помощью к администрации.        
            `)] })
                    .then(() => setTimeout(() => {
                    interaction.deleteReply();
                }, 5000));
            }
        }
        else {
            return yield interaction.editReply({ embeds: [yield getInfoEmbed(author)] });
        }
    });
}
exports.default = {
    data,
    execute
};

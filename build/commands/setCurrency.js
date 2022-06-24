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
const UserModel_1 = require("../database/models/UserModel");
const getNotificationEmbed_1 = require("../utills/getNotificationEmbed");
const setCurrency = (target, count) => __awaiter(void 0, void 0, void 0, function* () {
    yield UserModel_1.User.updateOne({ id: target.id }, { currency: count });
});
exports.data = new builders_1.SlashCommandBuilder()
    .setName("set")
    .setDescription("setCurrency")
    .addIntegerOption(option => (option.setName("count")
    .setDescription("Сколько валюты установить?")
    .setRequired(true)))
    .addUserOption(option => {
    return option.setName("user")
        .setDescription("Кому установить количество валюты");
});
function execute(interaction) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const author = (_a = interaction.member) === null || _a === void 0 ? void 0 : _a.user;
        const count = interaction.options.getInteger("count");
        const user = interaction.options.getUser("user");
        if (user) {
            setCurrency(user, count)
                .then(() => __awaiter(this, void 0, void 0, function* () {
                yield (yield user.createDM()).send({ embeds: [(0, getNotificationEmbed_1.getNotificationEmbed)(`${author} установил вам  баланс мужских слёзок: ${count}`)] });
            }));
        }
        else {
            setCurrency(author, count);
        }
        return yield interaction.reply({ content: `Установил ${count} ${user ? user : ''}`, ephemeral: true });
    });
}
exports.execute = execute;
exports.default = {
    data: exports.data,
    execute
};

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
const UserModel_1 = require("../database/models/UserModel");
const incOrDecrCurrency_1 = require("../utills/incOrDecrCurrency");
const isUserExist_1 = require("../utills/isUserExist");
const getNotExistsEmbed_1 = require("../utills/getNotExistsEmbed");
const data = new builders_1.SlashCommandBuilder()
    .setName("give")
    .setDescription("giveCurrency")
    .addIntegerOption(option => (option.setName("count")
    .setDescription("Сколько валюты дать?")
    .setRequired(true)))
    .addUserOption(option => {
    return option.setName("user")
        .setDescription("Кому дать валюту?")
        .setRequired(true);
});
function execute(interaction) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const author = (_a = interaction.member) === null || _a === void 0 ? void 0 : _a.user;
        const target = interaction.options.getUser("user");
        const count = interaction.options.getInteger("count");
        const authorModel = yield UserModel_1.User.findOne({ id: author.id });
        if ((authorModel === null || authorModel === void 0 ? void 0 : authorModel.currency) >= count) {
            if (yield (0, isUserExist_1.isUserExist)(target.id)) {
                yield (0, incOrDecrCurrency_1.incOrDecrCurrency)(author, -count);
                yield (0, incOrDecrCurrency_1.incOrDecrCurrency)(target, count);
            }
            else {
                return interaction.reply({ embeds: [(0, getNotExistsEmbed_1.getNotExistEmbed)(target)] })
                    .then(() => setTimeout(() => {
                    interaction.deleteReply();
                }, 5000));
            }
        }
        return interaction.reply("GIVE");
    });
}
exports.default = {
    data,
    execute
};

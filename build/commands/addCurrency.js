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
const incOrDecrCurrency_1 = require("../utills/incOrDecrCurrency");
exports.data = new builders_1.SlashCommandBuilder()
    .setName("add")
    .setDescription("addCurrency")
    .addIntegerOption(option => (option.setName("count")
    .setDescription("Сколько валюты дать?")
    .setRequired(true)))
    .addUserOption(option => {
    return option.setName("user")
        .setDescription("Кому дать валюту?");
});
function execute(interaction) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const author = (_a = interaction.member) === null || _a === void 0 ? void 0 : _a.user;
        const count = interaction.options.getInteger("count");
        const user = interaction.options.getUser("user");
        if (user) {
            yield (0, incOrDecrCurrency_1.incOrDecrCurrency)(user, count);
        }
        else {
            yield (0, incOrDecrCurrency_1.incOrDecrCurrency)(author, count);
        }
        return interaction.reply("SET");
    });
}
exports.execute = execute;

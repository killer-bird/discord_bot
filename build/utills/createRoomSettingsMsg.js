"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.createRoomSettingsMsg = exports.getRoomSettingsEmbed = void 0;
const discord_js_1 = require("discord.js");
const buttons = __importStar(require("../buttons"));
const getRoomSettingsEmbed = () => {
    const roomSettingsEmbed = new discord_js_1.MessageEmbed();
    roomSettingsEmbed.setTitle("Настройки личной комнаты")
        .setDescription(`
        Ниже кнопки для управления личной комнатой\n
        <:rename:988485876805931049> — **Переименовать комнату** \n 
        <:capacity:988485874985619507> — **Установить лимит для пользователей** \n
        <:close:988485871248494662> — **Закрыть комнату для всех** \n
        <:open:988485873270128643> — **Открыть комнату для всех** \n
        <:unauthorized:988485878743711774> — **Забрать доступ к комнате** \n
        <:authorization:988485880337551401> — **Дать доступ к комнате** \n
        <:kick:988485882216607786> — **выгнать пользователя из комнаты** \n
        <:nosound:988485884116615279> — **замутить пользователя** \n
        <:volume:988485885647523840> — **размутить пользователя** \n
        <:leader:988485887165878283> — **сделать пользователя модератором** \n
        <:forbidden:988485889539862598> — **снять пользователя с модерации**
        `);
    return roomSettingsEmbed;
};
exports.getRoomSettingsEmbed = getRoomSettingsEmbed;
const createRoomSettingsMsg = (textChannel) => __awaiter(void 0, void 0, void 0, function* () {
    yield textChannel.send({
        embeds: [(0, exports.getRoomSettingsEmbed)()],
        components: [buttons.roomBtnsHigh.data, buttons.roomBtnsLow.data]
    });
});
exports.createRoomSettingsMsg = createRoomSettingsMsg;

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
exports.createRoomSettingsMsg = exports.getRoomSettingsEmbed = void 0;
const discord_js_1 = require("discord.js");
const components_1 = require("../components");
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
        <:forbidden:988485889539862598> — **снять пользователя с модерации** \n
        <:info:991458590810439700> — **получить информацию о комнате** \n
        <:invisible:992530676039569478> — **сделать комнату невидимой**\n
        <:visible:992530674387013662> — **cделать комнату видимой** \n
        <:balloons:993143299353362473> — **сделать комнату на двоих**
        `);
    return roomSettingsEmbed;
};
exports.getRoomSettingsEmbed = getRoomSettingsEmbed;
const createRoomSettingsMsg = (textChannel) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield textChannel.send({
            embeds: [(0, exports.getRoomSettingsEmbed)()],
            components: [components_1.btnRowHigh, components_1.btnRowMiddle, components_1.btnRowLow]
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.createRoomSettingsMsg = createRoomSettingsMsg;

import { TextChannel, MessageEmbed } from "discord.js"
import { btnRowLow, btnRowHigh, btnRowMiddle } from "../components"


export const getRoomSettingsEmbed = ():MessageEmbed => {
    const roomSettingsEmbed = new MessageEmbed()
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
        `)
    return roomSettingsEmbed

}


export const createRoomSettingsMsg = async (textChannel: TextChannel) :Promise<void> => {
    try {
        await textChannel.send({
            embeds: [ getRoomSettingsEmbed() ],
            components: [ btnRowHigh,btnRowMiddle, btnRowLow ]
        })
    } catch (error) {
        console.log(error)
    }
    
}
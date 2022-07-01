import { MessageEmbed, ButtonInteraction  } from "discord.js";
import {Room} from "../database/models/RoomModel"
import { IRoom } from "../interfaces"
import { IRoomKey } from "../interfaces/IRoom"
export const getNotifyEmbed = (message: string) :MessageEmbed => (
    new MessageEmbed().setTitle("Уведомление").setDescription(message)   
)

export const getErrEmbed = (message: string): MessageEmbed => (
    new MessageEmbed().setTitle("Ошибка").setDescription(message)   
)


export const getAwaitMsgEmbed = ( message : string ) :MessageEmbed => {
    
    const awaitMsgEmbed = new MessageEmbed()
    awaitMsgEmbed.setTitle("Настройки личной комнаты")
    .setDescription(`Чтобы ${message} введите его ниже`)
    .setFooter({text: "У вас есть 15 секунд, затем данное сообщение автоматически удалится"})
    
    
    return awaitMsgEmbed
}


export const getInfoEmbed =  async (interaction: ButtonInteraction) :Promise<MessageEmbed> => {
    
    const getRoomArray =  async (field:IRoomKey) => {
        const arrayInfo = room[field] as string[]
        return await Promise.all(arrayInfo.map(async (id:string) => await interaction.guild?.members.fetch(id)))
    }
    
    
    const room = await Room.findOne({id: interaction.channelId}) as IRoom
    const moderators = await getRoomArray('moderators')
    const mutes = await getRoomArray('mutes')
    const bans = await getRoomArray('bans')
    const infoEmbed = new MessageEmbed()
    infoEmbed.setTitle('Информация о комнате')
    .setDescription(`
        **Владелец** — ${await interaction.guild?.members.fetch(room.owner)}
        **Модераторы** — ${moderators.join(', ')}
        **В муте** — ${mutes.join(', ')}
        **В бане** — ${bans.join(', ')}
    `)
    return infoEmbed
}

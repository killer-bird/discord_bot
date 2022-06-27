import { MessageButton, ButtonInteraction, GuildMember, VoiceChannel, User, MessageEmbed } from "discord.js"
import { Room } from "../database/models/RoomModel"
import { IRoom, IButton } from "../interfaces"
import { getAwaitMsgEmbed } from "../utills/getAwaitMsgEmbed"




export const setModerBtn = new MessageButton()
    .setCustomId('setModerBtn')
    .setEmoji('988485887165878283')
    .setStyle('SECONDARY')



export const execute = async ( interaction: ButtonInteraction) => {
    await interaction.reply('setModer')
}


export default {
    data: setModerBtn,
    execute
} as IButton
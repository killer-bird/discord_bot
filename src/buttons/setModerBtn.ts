import { MessageButton, CommandInteraction, GuildMember, VoiceChannel, User, MessageEmbed } from "discord.js"
import { Room } from "../database/models/RoomModel"
import { IRoom } from "../interfaces/IRoom"
import { getAwaitMsgEmbed } from "../utills/getAwaitMsgEmbed"
import { getNotHaveTimeEmbed } from "../utills/getNotHaveTimeEmbed"




export const setModerBtn = new MessageButton()
    .setCustomId('setModerBtn')
    .setEmoji('988485887165878283')
    .setStyle('SECONDARY')



export const execute = async ( interaction: CommandInteraction) => {
    await interaction.reply('setModer')
}
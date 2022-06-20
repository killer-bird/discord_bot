import { MessageButton, CommandInteraction, GuildMember, VoiceChannel, User, MessageEmbed } from "discord.js"
import { Room } from "../database/models/RoomModel"
import { IRoom } from "../interfaces/IRoom"
import { getAwaitMsgEmbed } from "../utills/getAwaitMsgEmbed"
import { getNotHaveTimeEmbed } from "../utills/getNotHaveTimeEmbed"




export const kickBtn = new MessageButton()
    .setCustomId('kickBtn')
    .setEmoji('988485882216607786')
    .setStyle('SECONDARY')



export const execute = async (interaction: CommandInteraction) => {
    await interaction.reply('KICK')
}
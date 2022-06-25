import { MessageButton, ButtonInteraction, GuildMember, VoiceChannel, User, MessageEmbed } from "discord.js"
import { Room } from "../database/models/RoomModel"
import { IRoom, IButton } from "../interfaces"
import { getAwaitMsgEmbed } from "../utills/getAwaitMsgEmbed"
import { getNotHaveTimeEmbed } from "../utills/getNotHaveTimeEmbed"




export const deleteModerBtn = new MessageButton()
    .setCustomId('deleteModerBtn')
    .setEmoji('988485889539862598')
    .setStyle('SECONDARY')


export const execute = async (interaction: ButtonInteraction): Promise<void>=> {
    await interaction.reply('delete moder')
}

export default {
    data: deleteModerBtn,
    execute
} as IButton

import { MessageButton, ButtonInteraction, GuildMember } from "discord.js";
import { IRoom } from "../interfaces"
import { Room } from "../database/models/RoomModel"
import { config } from "../privateRooms"
import { getErrEmbed } from "../embeds"

export const infoBtn = new MessageButton()
    .setCustomId('infoBtn')
    .setEmoji('991458590810439700')
    .setStyle('SECONDARY')



export const execute = async ( interaction: ButtonInteraction) => {
    const member = interaction.member as GuildMember
    const room = await Room.findOne({id: member.voice.channelId}) as IRoom
    if(config[member.voice.channelId as string]) {
        await interaction.reply({embeds: [getErrEmbed("Закончите предыдущее действие")]})
        setTimeout( async () => {
            await interaction.deleteReply()
        }, 3000);
        return
    }
    await interaction.reply("INFO")
        setTimeout( async () => {
            await interaction.deleteReply()
        }, 3000);
}
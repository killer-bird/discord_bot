import { MessageButton, ButtonInteraction, GuildMember } from "discord.js";
import { IRoom } from "../interfaces"
import { Room } from "../database/models/RoomModel"
import { config } from "../privateRooms"
import { getErrEmbed, getInfoEmbed } from "../embeds"

export const infoBtn = new MessageButton()
    .setCustomId('infoBtn')
    .setEmoji('991458590810439700')
    .setStyle('SECONDARY')



export const execute = async ( interaction: ButtonInteraction) => {
    const member = interaction.member as GuildMember
    
    await interaction.reply({embeds: [ await getInfoEmbed(interaction)]})
        setTimeout( async () => {
            await interaction.deleteReply()
        }, 3000);
}

export default {
    data: infoBtn,
    execute
}
import { MessageButton, 
    ButtonInteraction, 
    GuildMember, VoiceChannel, Guild   
    } from "discord.js"
import { checkAdmPerms, checkModPerms} from "../privateRooms"
import { getErrEmbed, getNotifyEmbed } from "../embeds"
import { Room } from "../database/models/RoomModel"
import { IRoom, IButton } from "../interfaces"
import { memberSendToAudit } from "../utills"


export const privateBtn = new MessageButton()
    .setCustomId('privateBtn')
    .setEmoji('993143299353362473')
    .setStyle('SECONDARY')

export const execute = async ( interaction: ButtonInteraction) : Promise<void> => {
    const member = interaction.member as GuildMember
    const room = await Room.findOne({id: interaction.channelId}) as IRoom

    if( checkAdmPerms(interaction.user, room) || checkModPerms(interaction.user, room) ) {
        const guild = interaction.guild as Guild
        const voice = await guild.channels.fetch(interaction.channelId) as VoiceChannel
        await voice.edit({ userLimit: 2})
        await interaction.reply({embeds: [getNotifyEmbed("Вы сделали комнату на двоих")]})
        await memberSendToAudit(member, `сделал приватной`, interaction.channelId)
        setTimeout( async () => {
            await interaction.deleteReply()
        }, 5000);
    } else {
        await interaction.reply({embeds: [getErrEmbed("В этой комнате у вас не полномочий")]})
        setTimeout( async () => {
            await interaction.deleteReply()
        }, 5000);
    }

}


export default {
    data: privateBtn,
    execute
} as IButton
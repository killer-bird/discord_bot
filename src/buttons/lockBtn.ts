import { MessageButton, ButtonInteraction, GuildMember, MessageEmbed } from "discord.js"
import { Room } from "../database/models/RoomModel"
import { IRoom, IButton } from "../interfaces"
import { checkAdmPerms, checkModPerms } from "../privateRooms/checkPerms"
import { getErrEmbed, getNotifyEmbed } from "../embeds"
import { memberSendToAudit } from "../utills"

export const lockBtn = new MessageButton()
    .setCustomId("lockBtn")
    .setEmoji('988485871248494662')
    .setStyle("SECONDARY")


export const execute = async(interaction: ButtonInteraction): Promise<void> => {
    const member = interaction.member as GuildMember
    const room = await Room.findOne({id: interaction.channelId}) as IRoom

    if(checkAdmPerms(interaction.user, room) || checkModPerms(interaction.user, room) ) {
        member.voice.channel?.permissionOverwrites.create( member.voice.channel.guild.roles.everyone, {"CONNECT": false})
        member.voice.channel?.permissionOverwrites.create( member.user, {"CONNECT": true})
        await interaction.reply({embeds: [getNotifyEmbed("Вы закрыли комнату. Никто не сможет к вам зайти")]})
        await memberSendToAudit(member, `закрыл`, interaction.channelId)
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
    data: lockBtn,
    execute
} as IButton
import { MessageButton, ButtonInteraction, GuildMember, MessageEmbed } from "discord.js"
import { Room } from "../database/models/RoomModel"
import { IRoom, IButton } from "../interfaces"
import { checkAdmPerms, checkModPerms } from "../privateRooms/checkPerms"
import { getNotPermsErr } from "../privateRooms/"
import { memberSendToAudit } from "../utills"
import {getNotifyEmbed} from "../embeds"


export const unlockBtn = new MessageButton()
    .setCustomId("unlockBtn")
    .setEmoji('988485873270128643')
    .setStyle("SECONDARY")


export const execute = async ( interaction: ButtonInteraction) => {
    const member = interaction.member as GuildMember
    const room = await Room.findOne({id: interaction.channelId}) as IRoom

    if( checkAdmPerms(interaction.user, room) || checkModPerms(interaction.user, room) ) {
        member.voice.channel?.permissionOverwrites.create( member.voice.channel.guild.roles.everyone, {"CONNECT": true})
        await interaction.reply({embeds: [getNotifyEmbed("Комната открыта. Теперь любой может к вам зайти")]})
        await memberSendToAudit(member, `открыл комнату`, interaction.channelId)
        setTimeout( async () => {
            await interaction.deleteReply()
        }, 5000);
    } else {
        await getNotPermsErr(interaction)
    }
}

export default {
    data : unlockBtn,
    execute
} as IButton
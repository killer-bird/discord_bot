import { MessageButton, ButtonInteraction, GuildMember, MessageEmbed } from "discord.js"
import { Room } from "../database/models/RoomModel"
import { IRoom, IButton } from "../interfaces"
import { checkAdmPerms, checkModPerms } from "../utills/checkPerms"
import { getErrEmbed } from "../utills/getErrEmbed"

const getlockRoomEmbed = () : MessageEmbed => {
    const lockRoomEmbed = new MessageEmbed()
    lockRoomEmbed.setTitle("Вы закрыли комнату")
    .setDescription("Теперь никто к не сможет к вам зайти")
    return lockRoomEmbed
}

export const lockBtn = new MessageButton()
    .setCustomId("lockBtn")
    .setEmoji('988485871248494662')
    .setStyle("SECONDARY")


export const execute = async(interaction: ButtonInteraction): Promise<void> => {
    const member = interaction.member as GuildMember
    const room = await Room.findOne({id: member.voice.channelId}) as IRoom

    if(checkAdmPerms(interaction.user, room) || checkModPerms(interaction.user, room) ) {
        member.voice.channel?.permissionOverwrites.create( member.voice.channel.guild.roles.everyone, {"CONNECT": false})
        await interaction.reply({embeds: [getlockRoomEmbed()]})
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
import { MessageButton, ButtonInteraction, GuildMember, MessageEmbed } from "discord.js"
import { Room } from "../database/models/RoomModel"
import { IRoom, IButton } from "../interfaces"

const getUnlockRoomEmbed = (): MessageEmbed => {
    const unlockRoomEmbed = new MessageEmbed()
        .setTitle("Комната открыта")
        .setDescription("Теперь к вам могут зайти все")

    return unlockRoomEmbed
}

export const unlockBtn = new MessageButton()
    .setCustomId("unlockBtn")
    .setEmoji('988485873270128643')
    .setStyle("SECONDARY")



export const execute = async ( interaction: ButtonInteraction) => {
    const member = interaction.member as GuildMember
    const room = await Room.findOne({id: member.voice.channelId}) as IRoom

    if( room?.owner === interaction.user.id ) {
        member.voice.channel?.permissionOverwrites.create( member.voice.channel.guild.roles.everyone, {"CONNECT": true})
        await interaction.reply({embeds: [getUnlockRoomEmbed()]})
        setTimeout( async () => {
            await interaction.deleteReply()
        }, 5000);
    }
}

export default {
    data : unlockBtn,
    execute
} as IButton
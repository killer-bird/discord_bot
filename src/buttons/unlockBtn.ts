import { MessageButton, CommandInteraction, GuildMember, MessageEmbed } from "discord.js"
import { Room } from "../database/models/RoomModel"
import { IRoom } from "../interfaces/IRoom"

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



export const execute = async ( interaction: CommandInteraction) => {
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
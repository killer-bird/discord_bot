import { MessageButton, CommandInteraction, GuildMember, MessageEmbed } from "discord.js"
import { Room } from "../database/models/RoomModel"
import { IRoom } from "../interfaces/IRoom"

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


export const execute = async(interaction: CommandInteraction) : Promise<void> => {
    const member = interaction.member as GuildMember
    const room = await Room.findOne({id: member.voice.channelId}) as IRoom

    if( room?.owner === interaction.user.id ) {
        member.voice.channel?.permissionOverwrites.create( member.voice.channel.guild.roles.everyone, {"CONNECT": false})
        await interaction.reply({embeds: [getlockRoomEmbed()]})
        setTimeout( async () => {
            await interaction.deleteReply()
        }, 5000);
    }
     
}
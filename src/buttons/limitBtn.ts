import { MessageButton, MessageActionRow, ButtonInteraction, GuildMember, VoiceChannel, Message } from "discord.js"
import { Room } from "../database/models/RoomModel"
import { IRoom, IButton } from "../interfaces"
import { UserLimit } from "../types/UserLimit"
import { getErrEmbed } from "../embeds"
import { checkAdmPerms, checkModPerms } from "../privateRooms/checkPerms"
import { limitModal } from "../modals/limitModal"


const setLimit = async (room : VoiceChannel, limit: UserLimit) => {
    console.log(limit)
    if(limit === 0) {
        await room.edit({userLimit: 0})
        await Room.updateOne({id: room.id}, {limit: undefined})
        return
    }
    await room.edit({userLimit: limit})
    await Room.updateOne({id: room.id}, {limit})
}


export const limitBtn = new MessageButton()
    .setCustomId('limitBtn')
    .setEmoji('988485874985619507')
    .setStyle('SECONDARY')


export const data = new MessageActionRow()
    .addComponents(limitBtn)


export const execute = async (interaction: ButtonInteraction):Promise<void> => {
    const member = interaction.member as GuildMember
    const room = await Room.findOne({id: member.voice.channelId}) as IRoom
    if( checkAdmPerms(interaction.user, room) || checkModPerms(interaction.user, room) ) {
        interaction.showModal(limitModal)
    } else {
        await interaction.reply({embeds: [getErrEmbed("В этой комнате у вас не полномочий")]})
        setTimeout( async () => {
            await interaction.deleteReply()
        }, 5000);
    }
}

export default {
    data: limitBtn,
    execute
} as IButton
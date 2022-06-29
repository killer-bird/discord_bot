import { Modal, TextInputComponent, ModalSubmitInteraction, GuildMember, MessageActionRow, VoiceChannel } from "discord.js"
import { Room } from "../database/models/RoomModel"
import { UserLimit } from "../types/UserLimit"
import { getErrEmbed, getNotifyEmbed } from "../embeds"

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

export const limitModal = new Modal()
    .setCustomId('limitBtn')
    .setTitle('Задать лимит комнаты')
    const inputLimit = new TextInputComponent()
    .setCustomId('limitBtnInput')
    .setLabel('Введите новый лимит для комнаты')
    .setStyle('SHORT')
    
    const row = new MessageActionRow({
        components: [inputLimit]
    })
    limitModal.addComponents(row)


export const execute = async (interaction: ModalSubmitInteraction) => {
    const member = interaction.member as GuildMember
    const room = interaction.channel as VoiceChannel
    const oldLimit = room.userLimit

    const limit = Number(interaction.fields.getTextInputValue('limitBtnInput'))

    if(!isNaN(limit)) {
        await setLimit(room, limit)
        await interaction.reply({embeds: [getNotifyEmbed(`В вашей комнате сменился лимит с **${oldLimit}** на **${limit}**`)]})
        setTimeout(async() => {
            await interaction.deleteReply()
        }, 3000);
    } else {
        await interaction.reply({embeds: [getErrEmbed("Введите корректное значение!")]})
        setTimeout(async() => {
            await interaction.deleteReply()
        }, 3000);
    }
}

export default {
    data: limitModal,
    execute
}
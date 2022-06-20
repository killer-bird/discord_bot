import { MessageButton, MessageActionRow, CommandInteraction, GuildMember, VoiceChannel, Message } from "discord.js"
import { Room } from "../database/models/RoomModel"
import { IRoom } from "../interfaces/IRoom"
import { UserLimit } from "../types/UserLimit"
import { getAwaitMsgEmbed } from "../utills/getAwaitMsgEmbed"
import { getNotHaveTimeEmbed } from "../utills/getNotHaveTimeEmbed"
import { privateRoomConfig } from "../config"



const setLimit = async (room : VoiceChannel, limit: UserLimit) => {
    if(limit === 0) {
        await room.edit({userLimit: undefined})
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


export const execute = async (interaction: CommandInteraction) => {
    const member = interaction.member as GuildMember
    const room = await Room.findOne({id: member.voice.channelId}) as IRoom

    if( room?.owner === interaction.user.id ) {

        await interaction.reply({embeds:[getAwaitMsgEmbed("установить лимит пользователей для комнаты (если вы хотите сделать комнату безлимитной то введите **0**)")]})
        const awaitMsgTimeout = setTimeout(async() => {
            await interaction.editReply({embeds:[getNotHaveTimeEmbed()]})
            setTimeout(async() => {
                await interaction.deleteReply() 
            }, 3000);
        }, 15000);
        
        const filter = (m : Message) => {
            console.log(m.content, 15215152125)

            return true;
        }

        try {
            const response = await interaction.channel?.awaitMessages({filter, max: 1, time: 15000})
            if (response) {
                if(!!Number(response.first()?.content)) {
                    await setLimit(privateRoomConfig.voiceChannel as VoiceChannel, Number(response.first()?.content) as UserLimit )
                    clearTimeout(awaitMsgTimeout)
                    await interaction.deleteReply()
                }  
            } 
        } catch (error) {
            console.log(error)
            return
        }
    } else {
        console.log("НЕТ ВЛАСТИ В ЭТОЙ КОМНАТЕ")
    }
}
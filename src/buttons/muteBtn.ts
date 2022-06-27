import { MessageButton, ButtonInteraction, GuildMember, VoiceChannel, Message, Collection, Snowflake } from "discord.js"
import { checkAdmPerms, checkModPerms } from "../privateRooms/checkPerms"
import { getErrEmbed } from "../embeds"
import { Room } from "../database/models/RoomModel"
import { IRoom, IButton } from "../interfaces"
import { getAwaitMsgEmbed } from "../utills/getAwaitMsgEmbed"
import { getNotPermsErr } from "../privateRooms/getNotPermsErr"


const muteUser = async (room: VoiceChannel, target: GuildMember) :Promise<void> => {
    const afk = await target.guild.channels.fetch(process.env.AFK as string)
    if (room.members.has(target.user.id)) {
        await target.voice.setChannel(afk as VoiceChannel)
        await room.permissionOverwrites.create(target.user, {"SPEAK": false})
        await target.voice.setChannel(room)
        return  
    }
    await room.permissionOverwrites.create(target.user, {"SPEAK": false})
    await Room.updateOne({id: room.id}, {$push: {mutes: target.user.id}})
    
}

export const muteBtn = new MessageButton()
    .setCustomId('muteBtn')
    .setEmoji('988485884116615279')
    .setStyle('SECONDARY')


export const execute = async (interaction: ButtonInteraction) => {

    const member = interaction.member as GuildMember
    const room = await Room.findOne({id: member.voice.channelId}) as IRoom

    if( checkAdmPerms(interaction.user, room) || checkModPerms(interaction.user, room) ) {
        await interaction.reply({embeds:[getAwaitMsgEmbed("Укажите пользователя, которого необходимо выкинуть из комнаты")]})
        
        const awaitMsgTimeout = setTimeout(async() => {
            await interaction.editReply({embeds:[getErrEmbed("Вы не успели дать ответ в указанное время. Попробуйте еще раз")]})
            setTimeout(async() => {
                await interaction.deleteReply() 
            }, 3000);
        }, 15000);
        
        const filter = (m: Message) => {
            if(m.mentions.users.first()) {
                return true
            }
            return false
        } 

        try {
            const response = await interaction.channel?.awaitMessages({filter: filter, max: 1, time: 15000})
            if (response) {
                const members = response.first()?.mentions.members as Collection<Snowflake, GuildMember>
                const target = members.first() as GuildMember
                if( checkAdmPerms(target.user, room) || !checkAdmPerms(interaction.user, room) && checkModPerms(target.user, room) ) {
                    await getNotPermsErr(interaction)
                    return
                }
                await muteUser(member.voice.channel as VoiceChannel, target)
                clearTimeout(awaitMsgTimeout)
                await interaction.deleteReply()
            }
        } catch (error) {
            console.log(error)
            await interaction.editReply({embeds: [getErrEmbed("Произошла ошибка. Попробуйте еще раз")]})
            setTimeout( async () => {
                await interaction.deleteReply()
            }, 5000);
            return
        }
    }else {
        await getNotPermsErr(interaction)
    }
}

export default {
    data: muteBtn,
    execute
} as IButton
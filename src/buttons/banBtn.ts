import { MessageButton, ButtonInteraction, GuildMember, VoiceChannel, User, MessageEmbed, Message, Collection, Snowflake } from "discord.js"
import { checkAdmPerms, checkModPerms } from "../privateRooms/checkPerms"
import { getErrEmbed, getNotifyEmbed } from "../embeds"
import { Room } from "../database/models/RoomModel"
import { IRoom, IButton } from "../interfaces/"
import { getAwaitMsgEmbed } from "../embeds"
import { getNotPermsErr } from "../privateRooms/getNotPermsErr"
import { config } from "../privateRooms/config"


const banUser = async (channel: VoiceChannel, target: GuildMember) => {
    const afk = await target.guild.channels.fetch(process.env.AFK as string)
    await channel.permissionOverwrites.create(target.user, {'CONNECT': false})
    await Room.updateOne({id: channel.id}, {$push: {bans: target.user.id}})
    if (channel.members.has(target.user.id)) {
        await target.voice.setChannel(afk as VoiceChannel)
    }
    
}


export const banBtn = new MessageButton()
    .setCustomId('banBtn')
    .setEmoji('988485878743711774')
    .setStyle('SECONDARY')


export const execute = async (interaction: ButtonInteraction): Promise<void>=> {
    const member = interaction.member as GuildMember
    const room = await Room.findOne({id: member.voice.channelId}) as IRoom
    
    if(config[member.voice.channelId as string]) {
        await interaction.reply({embeds: [getErrEmbed("Закончите предыдущее действие")]})
        setTimeout( async () => {
            await interaction.deleteReply()
        }, 3000);
        return
    }
    if( checkAdmPerms(interaction.user, room) || checkModPerms(interaction.user, room) ) {
        config[member.voice.channelId as string] = true
        await interaction.reply({embeds:[getAwaitMsgEmbed("забанить пользователя в комнате линканите его ниже")]})

        try {
            const filter = (m: Message) => {
                if(m.mentions.users.first()) {
                    return true
                }
                return false
            } 

            const response = await interaction.channel?.awaitMessages({filter: filter, max: 1, time: 15000})
            
            if (response?.size) {
                const members = response.first()?.mentions.members as Collection<Snowflake, GuildMember>
                const target = members.first() as GuildMember
                
                if( checkAdmPerms(target.user, room) || !checkAdmPerms(interaction.user, room) && checkModPerms(target.user, room) ) {
                    config[member.voice.channelId as string] = false
                    await getNotPermsErr(interaction)
                    return
                }
                await banUser(member.voice.channel as VoiceChannel, target)
                config[member.voice.channelId as string] = false
                await interaction.editReply({embeds: [getNotifyEmbed(`Пользователь ${target} забанен. Он не больше не сможет зайти в вашу комнату`)]})           
                setTimeout(async() => {
                    await interaction.deleteReply()
                }, 3000);
            } else {
                await interaction.editReply({embeds:[getErrEmbed("Вы не успели дать ответ в указанное время. Попробуйте еще раз")]})
                setTimeout(async() => {
                    await interaction.deleteReply() 
                }, 3000);
                config[member.voice.channelId as string] = false
            }

        } catch (error) {
            await getNotPermsErr(interaction)
            config[member.voice.channelId as string] = false
            return
        }
        
    } else {
        await getNotPermsErr(interaction)
        config[member.voice.channelId as string] = false
    }
}

export default {
    data: banBtn,
    execute
} as IButton
import { MessageButton, ButtonInteraction, GuildMember, VoiceChannel, User, MessageEmbed, Message, Collection, Snowflake } from "discord.js"
import { checkAdmPerms, checkModPerms } from "../privateRooms/checkPerms"
import { getErrEmbed, getAwaitMsgEmbed } from "../embeds"
import { Room } from "../database/models/RoomModel"
import { IRoom, IButton } from "../interfaces"
import { getNotPermsErr } from "../privateRooms/getNotPermsErr"
import { config } from "../privateRooms/config"


const unBanUser = async (channel: VoiceChannel, target: GuildMember) => {
    const afk = await target.guild.channels.fetch(process.env.AFK as string)
    await channel.permissionOverwrites.create(target.user, {'CONNECT': true})
    await Room.updateOne({id: channel.id}, {$pull: {bans: target.user.id}})
    // await target.voice.setChannel(afk as VoiceChannel)
}

export const unbanBtn = new MessageButton()
    .setCustomId("unbanBtn")
    .setEmoji('988485880337551401')
    .setStyle('SECONDARY')



export const execute = async (interaction: ButtonInteraction): Promise<void> => {
    
    const member = interaction.member as GuildMember
    if(config[member.voice.channelId as string]) {
        await interaction.reply({embeds: [getErrEmbed("Закончите предыдущее действие")]})
        setTimeout( async () => {
            await interaction.deleteReply()
        }, 3000);
        return
    }

    const room = await Room.findOne({id: member.voice.channelId}) as IRoom
    
    if( checkAdmPerms(interaction.user, room) || checkModPerms(interaction.user, room) ) {
        config[member.voice.channelId as string] = true
        await interaction.reply({embeds:[getAwaitMsgEmbed("разбанить пользователя в комнате линканите его ниже")]})
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
                    await getNotPermsErr(interaction)
                    return
                }
                await unBanUser(member.voice.channel as VoiceChannel, target)
                config[member.voice.channelId as string] = false
                setTimeout(async () => {
                    await interaction.deleteReply()    
                }, 5000);
            } else {
                config[member.voice.channelId as string] = false
                await interaction.editReply({embeds:[getErrEmbed("Вы не успели дать ответ в указанное время. Попробуйте еще раз")]})
                setTimeout(async() => {
                    await interaction.deleteReply() 
                }, 3000);
            }
        } catch (error) {
            config[member.voice.channelId as string] = false
            await getNotPermsErr(interaction)
            return
        }
        
    } else {
        await getNotPermsErr(interaction)
    }
}

export default {
    data: unbanBtn,
    execute
} as IButton
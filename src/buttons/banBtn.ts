import { MessageButton, ButtonInteraction, GuildMember, VoiceChannel, User, MessageEmbed, Message, Collection, Snowflake } from "discord.js"
import { checkAdmPerms, checkModPerms } from "../utills/checkPerms"
import { getErrEmbed } from "../utills/getErrEmbed"
import { Room } from "../database/models/RoomModel"
import { IRoom, IButton } from "../interfaces/"
import { getAwaitMsgEmbed } from "../utills/getAwaitMsgEmbed"
import { getNotPermsErr } from "../utills/getNotPermsErr"

const getBanEmbed = (user: User):MessageEmbed => {
    const banEmbed = new MessageEmbed()
    banEmbed.setTitle("Пользователь забанен")
    .setDescription( `Пользователь ${user} забанен. Он не больше не сможет зайти в вашу комнату` )   
    return banEmbed
}

const banUser = async (channel: VoiceChannel, target: GuildMember) => {
    const afk = await target.guild.channels.fetch(process.env.AFK as string)
    await channel.permissionOverwrites.create(target.user, {'CONNECT': false})
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
    
    if( checkAdmPerms(interaction.user, room) || checkModPerms(interaction.user, room) ) {
        await interaction.reply({embeds:[getAwaitMsgEmbed("забанить пользователя в комнате линканите его ниже")]})
        const awaitMsgTimeout = setTimeout(async() => {
            await interaction.editReply({embeds:[getErrEmbed("Вы не успели дать ответ в указанное время. Попробуйте еще раз")]})
            setTimeout(async() => {
                await interaction.deleteReply() 
            }, 3000);
        }, 15000);


        try {
            const filter = (m: Message) => {
                if(m.mentions.users.first()) {
                    return true
                }
                return false
            } 
            const response = await interaction.channel?.awaitMessages({filter: filter, max: 1, time: 15000})
            if (response) {
                const members = response.first()?.mentions.members as Collection<Snowflake, GuildMember>
                const target = members.first() as GuildMember
                if( checkAdmPerms(target.user, room) || !checkAdmPerms(interaction.user, room) && checkModPerms(target.user, room) ) {
                    await getNotPermsErr(interaction)
                    return
                }
                await banUser(member.voice.channel as VoiceChannel, target)
                // await interaction.editReply({ embeds: [getBanEmbed(response.first()?.mentions.users.first() as User)]})
                clearTimeout(awaitMsgTimeout)
                
                setTimeout(async () => {
                    await interaction.deleteReply()    
                }, 5000);

            }
        } catch (error) {
            await getNotPermsErr(interaction)
            return
        }
        
    } else {
        await getNotPermsErr(interaction)
    }
}

export default {
    data: banBtn,
    execute
} as IButton
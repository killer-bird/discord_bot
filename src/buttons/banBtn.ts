import { MessageButton, CommandInteraction, GuildMember, VoiceChannel, User, MessageEmbed } from "discord.js"
import { Room } from "../database/models/RoomModel"
import { IRoom } from "../interfaces/IRoom"
import { getAwaitMsgEmbed } from "../utills/getAwaitMsgEmbed"
import { getNotHaveTimeEmbed } from "../utills/getNotHaveTimeEmbed"


const getBanEmbed = (user: User):MessageEmbed => {
    const banEmbed = new MessageEmbed()
    banEmbed.setTitle("Пользователь забанен")
    .setDescription( `Пользователь ${user} забанен. Он не больше не сможет зайти в вашу комнату` )
    
    return banEmbed
}

const banUser = async (channel: VoiceChannel, user: User) => {
    await channel.permissionOverwrites.create(user, {'CONNECT': false})
}

export const banBtn = new MessageButton()
    .setCustomId('banBtn')
    .setEmoji('988485878743711774')
    .setStyle('SECONDARY')


export const execute = async (interaction: CommandInteraction) => {
    const member = interaction.member as GuildMember
    const room = await Room.findOne({id: member.voice.channelId}) as IRoom
    
    if( room?.owner === interaction.user.id ) {
        await interaction.reply({embeds:[getAwaitMsgEmbed("забанить пользователя в комнате линканите его ниже")]})
        const awaitMsgTimeout = setTimeout(async() => {
            await interaction.editReply({embeds:[getNotHaveTimeEmbed()]})
            setTimeout(async() => {
                await interaction.deleteReply() 
            }, 3000);
        }, 15000);


        try {
            const response = await interaction.channel?.awaitMessages({filter: () => true, max: 1, time: 15000})
            if (response) {
                await banUser(member.voice.channel as VoiceChannel, response.first()?.mentions.users.first() as User)
                await interaction.editReply({ embeds: [getBanEmbed(response.first()?.mentions.users.first() as User)]})
                clearTimeout(awaitMsgTimeout)
                
                setTimeout(async () => {
                    await interaction.deleteReply()    
                }, 5000);

            }
        } catch (error) {
            console.log(error)
            return
        }
        
    }
}
import { MessageButton, 
    ButtonInteraction, 
    GuildMember, 
    } from "discord.js"
import { checkAdmPerms, checkModPerms} from "../privateRooms"
import { getErrEmbed, getNotifyEmbed } from "../embeds"
import { Room } from "../database/models/RoomModel"
import { IRoom, IButton } from "../interfaces"
import { memberSendToAudit } from "../utills"

export const visibleBtn = new MessageButton()
    .setCustomId('visibleBtn')
    .setEmoji('992530674387013662')
    .setStyle('SECONDARY')


export const execute = async ( interaction: ButtonInteraction): Promise<void> => {

    const member = interaction.member as GuildMember
    const room = await Room.findOne({id: interaction.channelId}) as IRoom

    if( checkAdmPerms(interaction.user, room) || checkModPerms(interaction.user, room) ) {
        if(!room.invisible) {
            await interaction.reply({embeds: [getNotifyEmbed("Комната и так не скрыта!")]})
            setTimeout( async () => {
                await interaction.deleteReply()
                return
            }, 5000);
        }

        member.voice.channel?.permissionOverwrites.create( member.voice.channel.guild.roles.everyone, {"VIEW_CHANNEL": true})
        await interaction.reply({embeds: [getNotifyEmbed("Вы сделали комнату видимой. Теперь ее все видят.")]})
        await memberSendToAudit(member, `сделал видимой`, interaction.channelId)
        setTimeout( async () => {
            await interaction.deleteReply()
        }, 5000);
    } else {
        await interaction.reply({embeds: [getErrEmbed("В этой комнате у вас не полномочий")]})
        setTimeout( async () => {
            await interaction.deleteReply()
        }, 5000);
    }

}

export default {
    data: visibleBtn,
    execute
} as IButton
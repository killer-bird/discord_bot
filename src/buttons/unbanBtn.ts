import { MessageButton, CommandInteraction, GuildMember, VoiceChannel, User, MessageEmbed } from "discord.js"
import { Room } from "../database/models/RoomModel"
import { IRoom } from "../interfaces/IRoom"
import { getAwaitMsgEmbed } from "../utills/getAwaitMsgEmbed"
import { getNotHaveTimeEmbed } from "../utills/getNotHaveTimeEmbed"


export const unbanBtn = new MessageButton()
    .setCustomId("unBanBtn")
    .setEmoji('988485880337551401')
    .setStyle('SECONDARY')


export const execute = async (interaction: CommandInteraction): Promise<void> => {
    
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

        

    }
}
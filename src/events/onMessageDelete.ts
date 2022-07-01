import { Message, PartialMessage, Guild, TextChannel, User } from "discord.js"
import { IEvent } from "../interfaces"

const onMessageDelete = async (message: Message | PartialMessage) => {
    const guild = message.guild as Guild
    const author = message.author as User
    const channel = await guild.channels.fetch(process.env.AUDIT_LOG as string) as TextChannel
    const messageChannel = message.channel as TextChannel
    if(!author.bot) {
        if(message.attachments.size){
            console.log("with attachments")
            await channel.send({
                content: `${message.author} удалил сообщение ${message.content} с вложениями`,
                files: message.attachments.map(attachment => attachment.url)
            })     
            return
        }
        try {
            await channel.send(`${message.author} удалил сообщение ${message.content} в чате ${messageChannel.name}`)
        } catch (error) {
            console.log(error)
        }
    }

}

export default {
    name: 'messageDelete',
    run: onMessageDelete
} as IEvent

import { GuildMember, TextChannel } from "discord.js"
import { Room } from "../database/models/RoomModel"
import { IRoom } from "../interfaces/"


export const memberSendToAudit = async (member: GuildMember, action: string, roomId: string) => {
    const room = await Room.findOne({id: roomId}) as IRoom
    const owner = await member.guild.members.fetch(room.owner)
    const audit = await member.guild.channels.fetch(process.env.AUDIT_LOG as string) as TextChannel
    await audit.send(`${member} ${action} в комнате, хозяином которой является ${owner}`)
}

export const roomSendToAudit = async (member: GuildMember, action: string) => {
    
}
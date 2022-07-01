import { Guild, CategoryChannel, User, VoiceChannel, TextChannel, Permissions, GuildMember } from "discord.js"
import { IRoom } from "../interfaces/IRoom"
import { UserLimit } from "../types/UserLimit"
import { Room } from "../database/models/RoomModel"
import { config } from "./config"
import { createRoomSettingsMsg } from "../utills"


export const createRoom = async(user: User, guild: Guild): Promise<VoiceChannel> => {
    const room = await Room.findOne({owner: user.id}) as IRoom
    const parent = await guild.channels.fetch(process.env.PARENT_CATEGORY as string) as CategoryChannel
    console.log("CREATE ROOM INTO FUNC", room.limit)
    const voice =  await guild.channels.create(room.name, {
        type: 'GUILD_VOICE',
        parent,
        userLimit: room.limit as UserLimit,
        permissionOverwrites: [
            ...await Promise.all(
                room.bans.map(async id => ({
                    id: await guild.members.fetch(id),
                    deny: [Permissions.FLAGS.CONNECT]
                }))
            ),
            ...await Promise.all(
                room.mutes.map(async id => ({
                    id: await guild.members.fetch(id),
                    deny: [Permissions.FLAGS.SPEAK]
                }))
            ),
            ...await Promise.all(
                room.moderators.map(async id => ({
                    id: await guild.members.fetch(id),
                    allow: [
                            Permissions.FLAGS.MANAGE_CHANNELS, 
                            Permissions.FLAGS.MUTE_MEMBERS, 
                            Permissions.FLAGS.DEAFEN_MEMBERS,
                            Permissions.FLAGS.MANAGE_ROLES
                            ]
                }))
            ),
            {
                id: user,
                allow: [
                        Permissions.FLAGS.MANAGE_CHANNELS, 
                        Permissions.FLAGS.MUTE_MEMBERS, 
                        Permissions.FLAGS.DEAFEN_MEMBERS,
                        Permissions.FLAGS.MANAGE_ROLES,
                        ]
            },
            room.closed ?
            {
                id : guild.roles.everyone,
                deny: [
                    Permissions.FLAGS.READ_MESSAGE_HISTORY,
                    Permissions.FLAGS.VIEW_CHANNEL,
                    Permissions.FLAGS.CONNECT
                ]
            }:
            {
                id : guild.roles.everyone,
                allow: [
                    Permissions.FLAGS.READ_MESSAGE_HISTORY,
                    Permissions.FLAGS.VIEW_CHANNEL,
                    Permissions.FLAGS.CONNECT
                ]
            },
            room.invisible ?
            {
                id : guild.roles.everyone,
                deny: [
                    Permissions.FLAGS.VIEW_CHANNEL,
                    Permissions.FLAGS.READ_MESSAGE_HISTORY
                ]
            }:
            {
                id : guild.roles.everyone,
                allow: [
                    Permissions.FLAGS.VIEW_CHANNEL,
                    Permissions.FLAGS.READ_MESSAGE_HISTORY,
                ]
            },

        ],
    })

    const textChannel = await guild.channels.fetch(voice.id) as TextChannel
    await createRoomSettingsMsg(textChannel)
    await Room.updateOne({owner: user.id}, {id: voice.id})
    config[voice.id] = false
    return voice
}

export const deleteRoom = async (voice: VoiceChannel) :Promise<void> => {
    try {
        if (!voice.members.size) {
            delete config[voice.id]
            await voice.delete()
        }     
    } catch (error) {
        return
    }
    
}


export const muteUser = async (channel: VoiceChannel, target: GuildMember) :Promise<void> => {
    const afk = await target.guild.channels.fetch(process.env.AFK as string)
    if (channel.members.has(target.user.id)) {
        await target.voice.setChannel(afk as VoiceChannel)
        target.voice.setMute(false)
        await channel.permissionOverwrites.create(target.user, {"SPEAK": false})
        await target.voice.setChannel(channel)
        return  
    }
    await channel.permissionOverwrites.create(target.user, {"SPEAK": false})    
}


export const kickUser = async (target: GuildMember) :Promise<void> => {
    const afk = await target.guild.channels.fetch(process.env.AFK as string)
    await target.voice.setChannel(afk as VoiceChannel)
    
}

export const unMuteUser = async (room: VoiceChannel, target: GuildMember) :Promise<void> => {
    const afk = await target.guild.channels.fetch(process.env.AFK as string)
    const roomModel = Room.findOne({id: room.id})
    if (room.members.has(target.user.id)) {
        console.log("UNMUTE IT HAS")
        await target.voice.setChannel(afk as VoiceChannel)
        await room.permissionOverwrites.create(target.user, {"SPEAK": true})
        await target.voice.setChannel(room)
        await Room.updateOne({id: room.id}, {$pull: {mutes: target.user.id}})
        return  
    } 
    await room.permissionOverwrites.create(target.user, {"SPEAK": true})     
}

export const banUser = async (channel: VoiceChannel, target: GuildMember) => {
    const afk = await target.guild.channels.fetch(process.env.AFK as string)
    await channel.permissionOverwrites.create(target.user, {'CONNECT': false})
    if (channel.members.has(target.user.id)) {
        await target.voice.setChannel(afk as VoiceChannel)
    }
    await target.voice.setDeaf(false)
    
}

export const  unBanUser = async (channel: VoiceChannel, target: GuildMember) => {
    await channel.permissionOverwrites.create(target.user, {'CONNECT': true})
}
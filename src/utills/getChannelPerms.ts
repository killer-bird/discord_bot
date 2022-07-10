import { VoiceChannel } from "discord.js"


export const getChannelPerms = (channel : VoiceChannel) => {
    const channelPerms = {} as any

    channel.permissionOverwrites.cache.forEach(p => {
        channelPerms[p.id] = {
        deny: p.deny.toArray(),
        allow: p.allow.toArray()
        }
    })

    return channelPerms
}
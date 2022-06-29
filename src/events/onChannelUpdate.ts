import { DMChannel, GuildChannel, VoiceChannel, PermissionString } from "discord.js";
import { Room } from "../database/models/RoomModel"
import {IEvent} from "../interfaces"


const onChannelUpdate = async (oldChannel: VoiceChannel, newChannel: VoiceChannel ) => {
    if(oldChannel.userLimit !== newChannel.userLimit){
        await Room.updateOne({id: oldChannel.id}, {limit: newChannel.userLimit})
    }
    if(oldChannel.name !== newChannel.name){
        console.log("NAME CHANGED")
        await Room.updateOne({id: oldChannel.id}, {name: newChannel.name})
    }
    // const isPermissionChanged = (permission: string) => {
    //     if(!oldChannel.permissionOverwrites.cache.some(p => p.deny.toArray().includes(permission as PermissionString)) &&
    //     newChannel.permissionOverwrites.cache.some(p => p.deny.toArray().includes(permission as PermissionString))) {
    //         return true;
    //     }
    //     if( oldChannel.permissionOverwrites.cache.some(p => p.deny.toArray().includes(permission as PermissionString)) &&
    //     newChannel.permissionOverwrites.cache.some(p => p.allow.toArray().includes(permission as PermissionString) || !p.deny.toArray().includes(permission as PermissionString))) {
    //         return false
    //     }
    // }
    // if(isPermissionChanged('SPEAK')) {
    //     console.log("SOMEONE MUTE")
    // }
    // if(!isPermissionChanged('SPEAK')){
    //     console.log("SOMEONE UNMUTE")
    // }
    // if(isPermissionChanged('CONNECT')) {
    //     console.log("SOMEONE BAN")
    // }
    // if(!isPermissionChanged('CONNECT')){
    //     console.log("SOMEONE UNBAN")
    // }

    if(!oldChannel.permissionOverwrites.cache.some(p => p.deny.toArray().includes('SPEAK')) &&
        newChannel.permissionOverwrites.cache.some(p => p.deny.toArray().includes('SPEAK'))) {
        console.log("SOMEONE MUTE")
    }
    if( oldChannel.permissionOverwrites.cache.some(p => p.deny.toArray().includes('SPEAK')) &&
        newChannel.permissionOverwrites.cache.some(p => p.allow.toArray().includes('SPEAK') || !p.deny.toArray().includes('SPEAK'))) {
        console.log("SOMEONE UNMUTE")
    }

    if(!oldChannel.permissionOverwrites.cache.some(p => p.deny.toArray().includes('CONNECT')) &&
        newChannel.permissionOverwrites.cache.some(p => p.deny.toArray().includes('CONNECT'))){
        console.log("SOMEONE BAN")
    }
    if( oldChannel.permissionOverwrites.cache.some(p => p.deny.toArray().includes('CONNECT')) &&
        newChannel.permissionOverwrites.cache.some(p => p.allow.toArray().includes('CONNECT') || !p.deny.toArray().includes('CONNECT'))){
        console.log("SOMEONE UNBAN")
    }
    
}


export default {
    name: 'channelUpdate',
    run: onChannelUpdate
} as IEvent
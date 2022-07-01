import { DMChannel, GuildChannel, VoiceChannel, PermissionString } from "discord.js";
import { Room } from "../database/models/RoomModel"
import {IEvent} from "../interfaces"


const onChannelUpdate = async (oldChannel: VoiceChannel, newChannel: VoiceChannel ) => {
    
    const room = Room.findOne({id: newChannel.id})

    if(!room) return

    if(oldChannel.userLimit !== newChannel.userLimit){
        await Room.updateOne({id: oldChannel.id}, {limit: newChannel.userLimit})
    }
    
    if(oldChannel.name !== newChannel.name){
        console.log("NAME CHANGED")
        await Room.updateOne({id: oldChannel.id}, {name: newChannel.name})
    }

    //PERMISSIONS CHANGED
    const permissionHandler = async ()  => {
        const modPerms = ['MANAGE_ROLES', 'MANAGE_CHANNELS', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS']
        const oldChannelPerms = {} as any
        const newChannelPerms = {} as any
        oldChannel.permissionOverwrites.cache.forEach(p => {
            oldChannelPerms[p.id] = {
            deny: p.deny.toArray(),
            allow: p.allow.toArray()
            }
        })

        newChannel.permissionOverwrites.cache.forEach(p => {
            newChannelPerms[p.id] = {
            deny: p.deny.toArray(),
            allow: p.allow.toArray()
            }
        })

        const oldKeys = Object.keys(oldChannelPerms)


        for( let i = 0; i < oldKeys.length; i++ ) {
            let id = oldKeys[i]
            if(oldChannelPerms[id] && newChannelPerms[id]){
                
                if(oldChannelPerms[id].deny.length < newChannelPerms[id].deny.length) {
                    const denyPerms = newChannelPerms[id].deny.filter((x:PermissionString) => !oldChannelPerms[id].deny.includes(x))
                    denyPerms.forEach( async (denyPerm:PermissionString) => {
                        switch(denyPerm) {
                            case 'SPEAK':
                                console.log("MUTE SOMEONE")
                                await Room.updateOne({id:newChannel.id}, {$push: {mutes:id}})
                                return
                            case 'CONNECT':
                                if(id === newChannel.guild.roles.everyone.id){
                                    console.log("ROOM CLOSED");
                                    await Room.updateOne({id:newChannel.id}, {closed:true})
                                    return
                                }
                                console.log("BAN SOMEONE")
                                await Room.updateOne({id:newChannel.id}, {$push: {bans:id}})
                                return
                            case 'VIEW_CHANNEL':
                                if(id === newChannel.guild.roles.everyone.id){
                                    console.log("ROOM INVISIBLE");
                                    await Room.updateOne({id:newChannel.id}, {invisible:true})
                                    return
                                }
                        }
                    }) 
                }
                if(oldChannelPerms[id].deny.length > newChannelPerms[id].deny.length) {
                    const unDenyPerms = oldChannelPerms[id].deny.filter((x:PermissionString)=> !newChannelPerms[id].deny.includes(x))
                    unDenyPerms.forEach( async (unDenyPerm:PermissionString) => {
                        switch(unDenyPerm) {
                            case 'SPEAK':
                                console.log("UNMUTE SOMEONE")
                                await Room.updateOne({id:newChannel.id}, {$pull: {mutes:id}})
                                return
                            case 'CONNECT':
                                if(id === newChannel.guild.roles.everyone.id){
                                    await Room.updateOne({id:newChannel.id}, {closed:false})
                                    console.log("ROOM OPEN");
                                    return
                                }
                                console.log("UNBAN SOMEONE")
                                await Room.updateOne({id:newChannel.id}, {$pull: {bans:id}})
                                return
                            case 'VIEW_CHANNEL':
                                if(id === newChannel.guild.roles.everyone.id){
                                    console.log("ROOM VISIBLE");
                                    await Room.updateOne({id:newChannel.id}, {invisible:false})
                                    return
                                }
                        }   
                    })
                }

                if(oldChannelPerms[id].allow.length < newChannelPerms[id].allow.length) {
                    if(modPerms.every(perm => newChannelPerms[id].allow.includes(perm))){
                        console.log("ADD MODER")
                        await Room.updateOne({id:newChannel.id}, {$push: {moders: id}})
                    }
                    const allowPerms = newChannelPerms[id].allow.filter((x:PermissionString) => !oldChannelPerms[id].allow.includes(x))
                    allowPerms.forEach((allowPerm:PermissionString) => {
                        switch(allowPerm) {
                            case 'MANAGE_CHANNELS':
                                console.log("added manage channels")
                                return
                            case 'MANAGE_ROLES':
                                console.log("added manage roles")
                                return
                            case 'MUTE_MEMBERS':
                                console.log("added mute members")
                                return
                            case 'DEAFEN_MEMBERS':
                                console.log("added deafen members")
                                return
                        }
                    })
                }


                if(oldChannelPerms[id].allow.length > newChannelPerms[id].allow.length) {
                    const unAllowPerms = oldChannelPerms[id].allow.filter((x:PermissionString)=> !newChannelPerms[id].allow.includes(x))
                    unAllowPerms.forEach((unAllowPerm:PermissionString) => {
                        switch(unAllowPerm) {
                            case 'MANAGE_CHANNELS':
                                console.log("deny manage channels")
                                return
                            case 'MANAGE_ROLES':
                                console.log("deny manage roles")
                                return
                            case 'MUTE_MEMBERS':
                                console.log("deny mute members")
                                return
                            case 'DEAFEN_MEMBERS':
                                console.log("deny deafen members")
                                return
                        }
                    })
                }
                
            }else {
                console.log("DELETE USER FROM PERMS")
            }
        }

    }
    permissionHandler()
    
    // if(isPermissionChanged('SPEAK') === true) {
    //     console.log("SOMEONE MUTE")
    // }
    // if(!isPermissionChanged('SPEAK') === false){
    //     console.log("SOMEONE UNMUTE")
    // }
    // if(isPermissionChanged('CONNECT') === true){
    //     console.log("SOMEONE BAN")
    // }
    // if(!isPermissionChanged('CONNECT') === false){
    //     console.log("SOMEONE UNBAN")
    // }
}


export default {
    name: 'channelUpdate',
    run: onChannelUpdate
} as IEvent
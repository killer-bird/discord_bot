import {  VoiceChannel, PermissionString } from "discord.js";
import { Room } from "../database/models/RoomModel"
import {IEvent} from "../interfaces"
import { getChannelPerms } from "../utills"


const deniedPemsHandler = async (id: string, channel: VoiceChannel, perms: Array<PermissionString>, deny: boolean) => {
    perms.forEach( async (perms:PermissionString) => {
        switch(perms) {
            case 'SPEAK':
                if(deny){
                    console.log("MUTE SOMEONE")
                await Room.updateOne({id:channel.id}, {$push: {mutes:id}})
                return
                }
                console.log("UNMUTE SOMEONE")
                await Room.updateOne({id:channel.id}, {$pull: {mutes:id}})
                return
            case 'CONNECT':
                if(deny) {
                    if(id === channel.guild.roles.everyone.id){
                        console.log("ROOM CLOSED");
                        await Room.updateOne({id:channel.id}, {closed:true})
                        return
                    }
                    console.log("BAN SOMEONE")
                    await Room.updateOne({id:channel.id}, {$push: {bans:id}})
                    return
                }
                if(id === channel.guild.roles.everyone.id){
                    await Room.updateOne({id:channel.id}, {closed:false})
                    console.log("ROOM OPEN");
                    return         
                }
                console.log("UNBAN SOMEONE")
                await Room.updateOne({id:channel.id}, {$pull: {bans:id}})
                return
            case 'VIEW_CHANNEL':
                if(id === channel.guild.roles.everyone.id){
                    if(deny){
                        console.log("ROOM INVISIBLE");
                        await Room.updateOne({id:channel.id}, {invisible:true})
                        return
                    }
                    console.log("ROOM VISIBLE");
                    await Room.updateOne({id:channel.id}, {invisible:false})
                    return
                }
        }
    }) 
}


const allowPermsHandler = async (id: string, channel: VoiceChannel, perms: Array<PermissionString>, allow: boolean) => {
    perms.forEach((allowPerm:PermissionString) => {
        switch(allowPerm) {
            case 'MANAGE_CHANNELS':
                if(allow){
                    console.log("added manage channels")
                    return
                }
                console.log("deny manage channels")
                return

            case 'MANAGE_ROLES':
                if(allow){
                    console.log("added manage roles")
                    return
                }
                console.log("deny manage roles")
                return
                
            case 'MUTE_MEMBERS':
                if(allow){
                    console.log("added mute members")
                    return
                }
                console.log("deny mute members")
                return
                
            case 'DEAFEN_MEMBERS':
                if(allow){
                    console.log("added deafen members")
                    return
                }
                console.log("deny deafen members")
                return
        }
    })
}


const moderatorPermsHandler = async (id:string, channel:VoiceChannel, perms:any) => {    
    const modPerms = ['MANAGE_ROLES', 'MANAGE_CHANNELS', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS']

    if(modPerms.every(perm => perms[id].allow.includes(perm))){
        console.log("ADD MODER")
        await Room.updateOne({id:channel.id}, {$push: {moders: id}})
        return
    }
    await Room.updateOne({id:channel.id}, {$pull: {moders: id}})
}

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
        
        const oldChannelPerms = getChannelPerms(oldChannel)
        const newChannelPerms = getChannelPerms(newChannel)

        const oldKeys = Object.keys(oldChannelPerms)
        for( let i = 0; i < oldKeys.length; i++ ) {
            let id = oldKeys[i]
            if(oldChannelPerms[id] && newChannelPerms[id]){
                
                if(oldChannelPerms[id].deny.length < newChannelPerms[id].deny.length) {
                    const denyPerms = newChannelPerms[id].deny.filter((x:PermissionString) => !oldChannelPerms[id].deny.includes(x))
                    await deniedPemsHandler(id, newChannel, denyPerms, true)
                }

                if(oldChannelPerms[id].deny.length > newChannelPerms[id].deny.length) {
                    const unDenyPerms = oldChannelPerms[id].deny.filter((x:PermissionString)=> !newChannelPerms[id].deny.includes(x))
                    await deniedPemsHandler(id, newChannel, unDenyPerms, false)
                }


                if(oldChannelPerms[id].allow.length !== newChannelPerms[id].allow.length) {


                    await moderatorPermsHandler(id, newChannel, newChannelPerms)
                    if(oldChannelPerms[id].allow.length < newChannelPerms[id].allow.length) {
                        const allowPerms = newChannelPerms[id].allow.filter((x:PermissionString) => !oldChannelPerms[id].allow.includes(x))
                        await allowPermsHandler(id, newChannel, allowPerms, true)
                    }
                    if(oldChannelPerms[id].allow.length > newChannelPerms[id].allow.length) {
                        const unAllowPerms = oldChannelPerms[id].allow.filter((x:PermissionString)=> !newChannelPerms[id].allow.includes(x))
                        await allowPermsHandler(id, newChannel, unAllowPerms, false)
                        
                    }
                }
                
                
            }else {
                console.log("DELETE USER FROM PERMS")
            }
        }

    }
    permissionHandler()
}


export default {
    name: 'channelUpdate',
    run: onChannelUpdate
} as IEvent
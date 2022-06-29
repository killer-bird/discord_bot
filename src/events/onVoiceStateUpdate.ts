import { VoiceState, GuildMember, VoiceChannel } from "discord.js";
import { createRoom, deleteRoom } from "../privateRooms/privateRoom.utills";
import { Room } from "../database/models/RoomModel"
import { IRoom, IEvent } from "../interfaces"
import { muteHandler, banHandler } from "../privateRooms"


const onVoiceStateUpdate = async (oldState: VoiceState, newState: VoiceState) => {
    
    const member = newState.member as GuildMember    
    const room = await Room.findOne({owner: member.user.id})
    
    if(room?.id){
        const voice  = oldState.channel as VoiceChannel

        if( oldState.channelId === room.id  && newState.channelId === process.env.CREATE_ROOM) {
            await newState.member?.voice.setChannel(voice as VoiceChannel)
            return
        }
        
        if (oldState.channelId === room.id  && newState.channelId !== room.id) {
            try {
                if (Array.from(voice.members).length === 0) {
                    await deleteRoom(voice)
                }   
            } catch (error) {
                console.log(error)
            }
        }
    }


    if( oldState.channelId !== process.env.CREATE_ROOM && newState.channelId === process.env.CREATE_ROOM ) {
                
        console.log("CREATE ROOM INTO EVENT")
        const voice =  await createRoom(member.user, newState.guild)
        await newState.member?.voice.setChannel(voice)
        await Room.updateOne({owner: member.user.id}, {id: voice.id})          
            
    }
    
    // MUTES AND BANES IN PRIVATE ROOMS
    if(newState.channelId === oldState.channelId){
        const room = await Room.findOne({id: newState.channelId})
            if(!room) {
                return
            }

        //MUTE
        if(newState.serverMute) {
            console.log("MUTE")
            await muteHandler(newState, true)
        }
        //UNMUTE
        if(oldState.suppress && !newState.suppress && !oldState.serverMute) {
            console.log("UNMUTE")
            await muteHandler(newState, false)
        }
        //BAN
        if(newState.serverDeaf) {
            console.log("Deaf");
            await banHandler(newState, true)
        }
        // if(oldState.serverDeaf && !newState.serverDeaf) {
        //     console.log("unDeaf");
        //     // await banHandler(newState, false)
        // }
    }
    
}


export default {
    name: 'voiceStateUpdate',
    run: onVoiceStateUpdate
} as IEvent

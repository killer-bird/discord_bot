import { VoiceState, GuildMember, VoiceChannel } from "discord.js";
import { createRoom, deleteRoom } from "../utills/privateRoom.utills";
import { Room } from "../database/models/RoomModel"
import { IRoom, IEvent } from "../interfaces"



const onVoiceStateUpdate = async (oldState: VoiceState, newState: VoiceState) => {
    
    const member = newState.member as GuildMember    
    const room = await Room.findOne({owner: member.user.id})

    if(room?.id){
        const voice  = oldState.channel as VoiceChannel
        if (oldState.channelId === room.id  && newState.channelId !== room.id) {
            try {
                if (Array.from(voice.members).length === 0) {
                    await deleteRoom(voice)
                }   
            } catch (error) {
                console.log(error)
                Room.updateOne({id: room.id}, {id: null})
                return
            }
             
        }
    }

    if( oldState.channelId !== process.env.CREATE_ROOM && newState.channelId === process.env.CREATE_ROOM ) {
                
        if (room?.id) {
            try {
                const voice  = await newState.guild.channels.fetch(room.id)
                await newState.member?.voice.setChannel(voice as VoiceChannel)
            } catch (error) {             
                const voice =  await createRoom(member.user, newState.guild)
                await newState.member?.voice.setChannel(voice)
                await Room.updateOne({owner: member.user.id}, {id: voice.id})
                
            } 
            return           
        }
        const voice =  await createRoom(member.user, newState.guild)
        await newState.member?.voice.setChannel(voice)
        await Room.updateOne({owner: member.user.id}, {id: voice.id})          
            
    }      
}

export default {
    name: 'voiceStateUpdate',
    run: onVoiceStateUpdate
} as IEvent

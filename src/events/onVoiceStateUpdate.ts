import { VoiceState, GuildMember, VoiceChannel } from "discord.js";
import { createRoom, deleteRoom } from "../privateRooms/privateRoom.utills";
import { Room } from "../database/models/RoomModel"
import { IEvent } from "../interfaces"
import { muteHandler, banHandler } from "../privateRooms"


const onVoiceStateUpdate = async (oldState: VoiceState, newState: VoiceState) => {
    
    const member = newState.member as GuildMember    
    const isRoomExists = await Room.findOne({id: oldState.channelId})
    const room = await Room.findOne({owner: member.user.id})

    if( room?.id ){
        try {
            const voice  = await oldState.guild.channels.fetch(room.id) as VoiceChannel
            if(newState.channelId === process.env.CREATE_ROOM) {
                await newState.member?.voice.setChannel(voice as VoiceChannel)
                return
            }

        }catch(error) {
            console.log(error);
        }
    }

    if(isRoomExists) {
        try {
            const voice  = await oldState.guild.channels.fetch(isRoomExists.id) as VoiceChannel
            if( newState.channelId !== isRoomExists.id){
                try {
                    if (!voice.members.filter(member => !member.user.bot).size) {
                        
                        await deleteRoom(voice)
                    }   
                } catch (error) {
                }
            }
        } catch (error) {
            Room.updateOne({id: isRoomExists.id}, {id: null})
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
            await muteHandler(newState, true)
        }
        //UNMUTE
        if(oldState.suppress && !newState.suppress && !oldState.serverMute) {
            await muteHandler(newState, false)
        }
        //BAN
        if(newState.serverDeaf) {
            await banHandler(newState, true)
        }
        
    }
    
}


export default {
    name: 'voiceStateUpdate',
    run: onVoiceStateUpdate
} as IEvent

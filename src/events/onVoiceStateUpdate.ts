import { VoiceState, GuildMember, VoiceChannel, User } from "discord.js";
import { createRoom, deleteRoom } from "../privateRooms/privateRoom.utills";
import { Room } from "../database/models/RoomModel"
import { IEvent } from "../interfaces"
import { muteHandler, banHandler } from "../privateRooms"
import { config } from "../privateRooms"
import { onlineTimer } from "../onlineTimer"
import {incOrDecrCurrency } from "../utills";
import { users } from "../users"

type argsType = [User, number]

const timer = onlineTimer(
    async(...args : argsType) => {
        incOrDecrCurrency(...args)
    }, 3600
)

const onVoiceStateUpdate = async (oldState: VoiceState, newState: VoiceState) => {
    
    const member = newState.member as GuildMember    
    const isRoomExists = await Room.findOne({id: oldState.channelId})
    const room = await Room.findOne({owner: member.user.id})
    

    if(!newState.mute && newState.channel) {
        users[member.id].voiceOnline.entryTime = new Date()
        
        console.log("to room")
    } else{
        if(users[member.id].voiceOnline.entryTime) {
            const entryTime = users[member.id].voiceOnline.entryTime as Date
            const duration = new Date().getTime() - entryTime.getTime() + users[member.id].voiceOnline.timeLeftToReward 
            users[member.id].voiceOnline.timeLeftToReward = duration % 60000
            const hours = Math.floor(duration / 360000)
            users[member.id].voiceOnline.timeLeftToReward = Math.floor((duration / 60000) % 60)


            if(hours >= 1) {
                await incOrDecrCurrency(member.user, hours*20)
            }
        }
        
        console.log("out of room");
        
    }
    
    if( room?.id ){
        if(config[newState.channelId as string]){
            if(config[newState.channelId as string].lifeTimer){
                clearTimeout(config[newState.channelId as string].lifeTimer as NodeJS.Timer)
                config[newState.channelId as string].lifeTimer = null
            }
        }

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
                        config[voice.id].lifeTimer = setTimeout( async () =>{
                            await deleteRoom(voice)
                        },5000)
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
        if(voice) {
            await newState.member?.voice.setChannel(voice)
            await Room.updateOne({owner: member.user.id}, {id: voice.id}) 
        }
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

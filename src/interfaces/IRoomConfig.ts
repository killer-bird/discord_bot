import { VoiceChannel, CategoryChannel, AnyChannel } from "discord.js"


export interface IRoomConfig{
    categoryChannel : CategoryChannel | AnyChannel | null
    voiceChannel : VoiceChannel | null
}
import { GuildMember } from "discord.js"
import { IUser } from "../interfaces/IUser"
import { User } from "../database/models/UserModel"
import { getRolesArray } from "../utills/getRolesArray"

export const createUser = async (member: GuildMember) => {
    const userObject :IUser = {
        id: member.user.id,
        roles: getRolesArray(member),
        currency: 0, 
        ban: false,
        mute: false,
        gender: 1,
        // room: {
        //     name: member.user.username,
        //     mutes: [],
        //     bans: [],
        //     moderators: [],
        //     limit: undefined
        // }
    } 
    
    await new User(userObject).save()
}
import { GuildMember } from "discord.js"
import { IUserModel } from "../interfaces/IUserModel"
import { User } from "../database/models/UserModel"
import { getRolesArray } from "../utills/getRolesArray"

export const createUser = async (member: GuildMember) => {
    const userObject :IUserModel = {
        id: member.user.id,
        roles: getRolesArray(member),
        currency: 0, 
        ban: false,
        mute: false,
        gender: 1,
    } 
    
    await new User(userObject).save()
}
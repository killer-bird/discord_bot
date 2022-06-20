import { GuildMember, PartialGuildMember } from "discord.js"
import { User } from "../database/models/UserModel"
import { getRolesArray } from "../utills/getRolesArray"


export const guildMemberUpdate  = async (oldMember: GuildMember | PartialGuildMember, newMember: GuildMember) => {
    if (oldMember.nickname === newMember.nickname) {  
        console.log(newMember.roles.cache.map(m => m.id))     
        await User.updateOne({id: newMember.user.id}, {roles: getRolesArray(newMember)})
    }
}
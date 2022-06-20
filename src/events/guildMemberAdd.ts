import { GuildMember, RoleResolvable } from "discord.js"
import { User } from "../database/models/UserModel"
import { createUser } from "../utills/createUser"
import { newRoom } from "../utills/newRoom"

export const guildMemberAdd = async (member: GuildMember) => {

    const oldUser = await User.findOne({id: member.user.id})
    
    // await sendCaptcha(member.user)
    if( oldUser ) {
        console.log( member.user, "exist!!")
        setTimeout( async() => {
            try {
                for (const roleId of oldUser.roles) {
                    let role = await member.guild.roles.fetch(roleId)
                    await member.roles.add(role as RoleResolvable)
                }
            } catch (error) {
                console.log(error)
                return
            }           
        }, 100000);       
    } else {
        console.log("NEW USER ADDED")
        const defaultRole = await member.guild.roles.fetch(process.env.DEFAULT_ROLE as string)
        setTimeout( async () => {
            try {
                await member.roles.add(defaultRole as RoleResolvable)       
            } catch (error) {
                console.log(error)
                return
            }
        }, 100000)
        await createUser(member)
        await newRoom(member)
    }
}
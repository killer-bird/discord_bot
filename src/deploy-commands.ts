import {REST} from "@discordjs/rest"
import {Routes} from "discord-api-types/v9"
import * as commandModules from "./commands"
import { ICommand } from "./interfaces/ICommand"
import dotenv from "dotenv";

dotenv.config()

const commands = []
for (const module of Object.values<ICommand>(commandModules)) {   
    commands.push(module.data)
}


const rest = new REST({version: "9"}).setToken(process.env.DISCORD_TOKEN as string)
rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID as string, process.env.GUILD_ID as string),
    {body: commands}
).then(() => {console.log("Success")})
.catch((e) => {console.log(e)})
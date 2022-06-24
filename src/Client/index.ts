import { Client, Collection } from "discord.js"
import { connect } from "mongoose"
import { readdirSync } from "fs"
import path from "path"
import { ICommand, IEvent } from "../interfaces/"


export default class ExtendedClient extends Client {
    
    public commands: Collection<string, ICommand> = new Collection()
    public events: Collection<string, IEvent> = new Collection()

    constructor(
        public token: string,
        public mongoUri: string
    ){
        super({
            intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES", "GUILD_MEMBERS", "GUILD_VOICE_STATES"]
        })
    }
    public async init() {    
        this.login(this.token)
        await connect(this.mongoUri)

        //COMANDS!!!!!!!!
        const commandPath = path.join(__dirname, "../commands/")
        readdirSync(commandPath).forEach( async (c) => {
            const command = await import(`${commandPath}/${c}`)
            this.commands.set(command.default?.data.name, command.default?.execute)
            
        })
        

        //EVENTS!!!!!!!
        const eventsPath = path.join(__dirname, "../events/")
        readdirSync(eventsPath).forEach(async (e) => {
            const event = await import(`${eventsPath}/${e}`)
            if(Object.keys(event).length) {
                this.on(event.default.name, event.default.run.bind(this))
            }      
        })

    }   
}


import { Client, Collection } from "discord.js"
import { connect } from "mongoose"
import { readdirSync } from "fs"
import path from "path"
import { ICommand, IEvent, IButton, IModal } from "../interfaces/"


export default class ExtendedClient extends Client {
    
    
    public commands: Collection<string, ICommand> = new Collection()
    public events: Collection<string, IEvent> = new Collection()
    public buttons: Collection<string, IButton> = new Collection()
    public modals : Collection<string, IModal> = new Collection()

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
        readdirSync(commandPath).forEach( async (file) => {
            const command = await import(`${commandPath}/${file}`)
            this.commands.set(command.default?.data.name, command.default)          
        })
        

        //EVENTS!!!!!!!
        const eventsPath = path.join(__dirname, "../events/")
        readdirSync(eventsPath).forEach(async (file) => {
            const event = await import(`${eventsPath}/${file}`)
            if(Object.keys(event).length) {
                this.on(event.default.name, event.default.run.bind(this))
            }      
        })


        //BUTTONS!!!!!!!!
        const buttonsPath = path.join(__dirname, "../buttons/")
        readdirSync(buttonsPath).forEach(async (file) => {
            const button = await import (`${buttonsPath}/${file}`)
            if(Object.keys(button).length && button.default?.data) {
                this.buttons.set(button.default.data.customId, button.default)
                
            }
        })

        //MODALS!!!!!!!
        const modalsPath = path.join(__dirname, "../modals/")
        readdirSync(modalsPath).forEach( async (file) => {
            const modal = await import(`${modalsPath}/${file}`)
            if(Object.keys(modal).length && modal.default?.data) {
                this.modals.set(modal.default.data.customId, modal.default)
            }
        })
    }   
}


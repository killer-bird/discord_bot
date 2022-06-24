import { Message } from "discord.js"
import { IEvent } from "../interfaces/IEvents"


const onMessage = async (message: Message) => {
    console.log(message.content)
}

export default {
    name: "messageCreate",
    run: onMessage
} as IEvent

import { Message } from "discord.js"
import { IEvent } from "../interfaces/IEvents"


const onMessage = async (message: Message) => {
}

export default {
    name: "messageCreate",
    run: onMessage
} as IEvent

import Client from "../Client"
import { ClientEvents } from "discord.js"

interface Run {
    (...args: any[]): void
}


export interface IEvent {
    name: keyof ClientEvents
    run: Run
}
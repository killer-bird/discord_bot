import Client from "../Client"
import { Message, CommandInteraction } from "discord.js"
import {SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder} from "@discordjs/builders"

interface Execute {
    (interaction: CommandInteraction):void
}


export interface ICommand {
    data:
    | Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">
    | SlashCommandSubcommandsOnlyBuilder;
    execute: Execute
    

}
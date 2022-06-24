import { MessageButton, ButtonInteraction } from "discord.js"


interface Execute {
    (interaction:ButtonInteraction): Promise<void>;
}

export interface IButton {
    data: MessageButton;
    execute: Execute;
}
import { Modal, ModalSubmitInteraction } from "discord.js"


interface Execute {
    (interaction: ModalSubmitInteraction): Promise<void>
}


export interface IModal {
    data: Modal,
    execute: Execute
}
import { Modal, TextInputComponent } from "discord-modals"



export const getModal = (config:any):Modal => {
    const {id, title, inputId, label, placeholder } = config
    return new Modal()
    .setCustomId(id)
    .setTitle(title)
    .addComponents(
        new TextInputComponent()
        .setCustomId(inputId)
        .setLabel(label)
        .setStyle('SHORT')
        .setPlaceholder(placeholder)
        .setRequired(true)
    )

}
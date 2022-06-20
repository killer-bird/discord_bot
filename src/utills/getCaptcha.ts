import { Captcha } from 'captcha-canvas';
import { MessageAttachment } from 'discord.js'


export const getCaptcha = async () : Promise<MessageAttachment> => {
    const captcha = new Captcha()
    captcha.async = true
    captcha.addDecoy()
    captcha.drawTrace()
    captcha.drawCaptcha()

    return new MessageAttachment (
        await captcha.png,
        "captha.png"
    )
}
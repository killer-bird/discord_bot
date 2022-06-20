"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCaptcha = void 0;
const captcha_canvas_1 = require("captcha-canvas");
const discord_js_1 = require("discord.js");
const getCaptcha = () => __awaiter(void 0, void 0, void 0, function* () {
    const captcha = new captcha_canvas_1.Captcha();
    captcha.async = true;
    captcha.addDecoy();
    captcha.drawTrace();
    captcha.drawCaptcha();
    return new discord_js_1.MessageAttachment(yield captcha.png, "captha.png");
});
exports.getCaptcha = getCaptcha;

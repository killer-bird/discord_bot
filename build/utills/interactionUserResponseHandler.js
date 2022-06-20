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
exports.userResponseHandler = void 0;
const getNotHaveTimeEmbed_1 = require("./getNotHaveTimeEmbed");
const userResponseHandler = (func, interaction, response, ...args) => __awaiter(void 0, void 0, void 0, function* () {
    const awaitMsgTimeout = setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        yield interaction.editReply({ embeds: [(0, getNotHaveTimeEmbed_1.getNotHaveTimeEmbed)()] });
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            yield interaction.deleteReply();
        }), 3000);
    }), 15000);
    try {
        if (response) {
            yield func(...args);
            clearTimeout(awaitMsgTimeout);
            yield interaction.deleteReply();
        }
    }
    catch (error) {
        console.log(error);
        return;
    }
});
exports.userResponseHandler = userResponseHandler;

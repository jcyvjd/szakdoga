
import { sendMessage, getMessages } from '../../controllers/messageController.js';

export const messageHandler = (io) => {
    io.on("sendMessage", async (data) => {
        sendMessage(io, data);
    });

    io.on("getMessages", async (data) => {
        getMessages(io, data);
    });

}

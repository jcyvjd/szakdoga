import { setupGame, getGame, takeTiles } from "../../controllers/gameController.js";

export const gameHandler = (socket) => {
    socket.on("SetupGame", async (data) => {
        setupGame(socket, data);
    });

    socket.on("GetGame", async (data) => {
        getGame(socket, data);
    });

    socket.on("TakeTiles", async (data) => {
        takeTiles(socket, data);
    });
}













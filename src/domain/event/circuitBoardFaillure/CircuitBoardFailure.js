import {doc, runTransaction} from "firebase/firestore";
import {db} from "../../../config/firebaseConfig";

async function CircuitBoardFailure(game, players) {
    if (players.length === 1) {
        let player1 = players[0];
        const player1DocRef = doc(db, "games", game.id, "players", player1.id);
        await runTransaction(db, async (transaction) => {
            const data = (await transaction.get(player1DocRef)).data();
            let newMessages = [...(data.messages || []), `CircuitBoardFailureMessages.1of1`];
            await transaction.update(player1DocRef, {messages: newMessages});
        });
    }


}

export default CircuitBoardFailure
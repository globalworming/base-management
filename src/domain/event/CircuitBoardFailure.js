import {doc, runTransaction} from "firebase/firestore";
import {db} from "../../config/firebaseConfig";
import Message from "../Message";
import React from "react";

async function CircuitBoardFailure(game, players) {
    if (players.length === 1) {
        let player1 = players[0];
        const player1DocRef = doc(db, "games", game.id, "players", player1.id);
        await runTransaction(db, async (transaction) => {
            const data = (await transaction.get(player1DocRef)).data();
            let newMessages = [...(data.messages || []), `CircuitBoardFailure.messages.1of1`];
            await transaction.update(player1DocRef, {messages: newMessages});
        });
    }


}

CircuitBoardFailure.messages = {
    "1of1": new Message("Central Command", "Circuit Board Failure", (<>
        Only you can help. As sole survivor you have to check <a href="http://example.com" target="_blank">external
        site</a>.
    </>))
}
export default CircuitBoardFailure
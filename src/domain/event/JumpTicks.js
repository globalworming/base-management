import {doc, runTransaction} from "firebase/firestore";
import {db} from "../../config/firebaseConfig";

async function JumpTicks(game, players, amount) {
    const gameDocRef = doc(db, "games", game.id);
    await runTransaction(db, async (transaction) => {
        console.log("jump to hour " + (game.hour + +amount))
        await transaction.update(gameDocRef, {
            tickProgress: 0,
            hour: game.hour + +amount,
            progressStarted: Date.now()
        });
    });
}

export default JumpTicks
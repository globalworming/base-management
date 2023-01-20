import {doc, runTransaction} from "firebase/firestore";
import {db} from "../../config/firebaseConfig";

async function JumpTicks(game, amount) {
    const gameDocRef = doc(db, "games", game.id);
    await runTransaction(db, async (transaction) => {
        console.log("jump to hour " + (game.hour + +amount))
        await transaction.update(gameDocRef, {
            phaseProgress: 0,
            hour: game.hour + +amount,
            progressStarted: Date.now()
        });
    });
}

export default JumpTicks
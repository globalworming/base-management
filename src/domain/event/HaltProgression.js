import {doc, runTransaction} from "firebase/firestore";
import {db} from "../../config/firebaseConfig";
import {GameProgressionState} from "../GameProgressionState";

async function HaltProgression(game) {
    const gameDocRef = doc(db, "games", game.id);
    await runTransaction(db, async (transaction) => {
        await transaction.update(gameDocRef, {state: GameProgressionState.PROGRESS_HALTED, phaseProgress: 0});
    });
}

export default HaltProgression
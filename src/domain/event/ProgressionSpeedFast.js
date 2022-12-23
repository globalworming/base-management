import {doc, runTransaction} from "firebase/firestore";
import {db} from "../../config/firebaseConfig";

async function ProgressionSpeedFast(game) {
    const gameDocRef = doc(db, "games", game.id);
    await runTransaction(db, async (transaction) => {
        await transaction.update(gameDocRef, {
            progressionRate: 2000
        });
    });
}
export default ProgressionSpeedFast
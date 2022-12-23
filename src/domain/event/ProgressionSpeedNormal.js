import {doc, runTransaction} from "firebase/firestore";
import {db} from "../../config/firebaseConfig";

async function ProgressionSpeedNormal(game) {
    const gameDocRef = doc(db, "games", game.id);
    await runTransaction(db, async (transaction) => {
        await transaction.update(gameDocRef, {
            progressionRate: 96
        });
    });
}
export default ProgressionSpeedNormal
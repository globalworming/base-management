import {doc, runTransaction} from "firebase/firestore";
import {db} from "../../config/firebaseConfig";

async function FireInSmelter(game) {
    const gameDocRef = doc(db, "games", game.id);
    await runTransaction(db, async (transaction) => {
        await transaction.update(gameDocRef, {
            activeEvents: [...game.activeEvents, "FIRE_IN_SMELTER"]
        });
    });
}
export default FireInSmelter
import {doc, runTransaction} from "firebase/firestore";
import {db} from "../../config/firebaseConfig";
import {GameProgressionState} from "../GameProgressionState";

async function ScenarioEnds(game) {
    const gameDocRef = doc(db, "games", game.id);
    await runTransaction(db, async (transaction) => {
        await transaction.update(gameDocRef, {state: GameProgressionState.SCENARIO_ENDED});
    });
}

export default ScenarioEnds
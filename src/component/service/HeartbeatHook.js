import {useEffect} from "react";
import {doc, runTransaction} from "firebase/firestore";
import {db} from "../../config/firebaseConfig";

const useHeartbeat = (game, selectedPlayer) => {
    useEffect(() => {
        if (!game || !selectedPlayer) return
        const interval = setInterval(async () => {
            const playerDocRef = doc(db, "games", game.id, "players", selectedPlayer.id);
            await runTransaction(db, async (transaction) => {
                await transaction.update(playerDocRef, {
                    heartbeat: Date.now()
                });
            });
        }, 30000);
        return () => clearInterval(interval);
    }, [game, selectedPlayer])
}

export default useHeartbeat
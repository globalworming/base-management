import React, {useEffect, useState} from "react";
import {db} from "../../config/firebaseConfig";
import {doc, runTransaction} from "firebase/firestore";
import {GameProgressionState} from "../../domain/GameProgressionState";

function useProgressionService(game) {
    const [tickProgress, setTickProgress] = useState(undefined)

    useEffect(() => {
        if (!game || game.state !== GameProgressionState.PROGRESSING) return
        setTickProgress(+((Date.now() - game.progressStarted) / 1000).toFixed(0) + game.tickProgress)
        const interval = setInterval(() => setTickProgress(+((Date.now() - game.progressStarted) / 1000).toFixed(0) + game.tickProgress), 100);
        return () => clearInterval(interval);
    }, [game && game.state, game && game.progressStarted])

    useEffect(() => {
        if (!tickProgress) return
        if (((tickProgress * game.progressionRate) / (60 * 60)) > 1) {
            const tick = async () => {
                if (game.hour < 23) {
                    await hourTick()
                } else {
                    await dayEnds()
                }
            }
            tick().catch(console.error);
        }
    }, [tickProgress])

    async function hourTick() {
        // FIXME call EventService here else some events may be skipped
        const gameDocRef = doc(db, "games", game.id);
        await runTransaction(db, async (transaction) => {
            await transaction.update(gameDocRef, {tickProgress: 0, hour: ++game.hour, progressStarted: Date.now()});
        });
    }

    async function dayEnds() {
        const gameDocRef = doc(db, "games", game.id);
        await runTransaction(db, async (transaction) => {
            await transaction.update(gameDocRef, {
                state: GameProgressionState.DAY_ENDED,
                tickProgress: 0,
                hour: 0,
                day: ++game.day
            });
        });
        // FIXME call end of day events here
    }
}

export default useProgressionService;
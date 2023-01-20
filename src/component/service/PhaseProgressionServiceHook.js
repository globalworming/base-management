import React, {useEffect, useState} from "react";
import {db} from "../../config/firebaseConfig";
import {doc, runTransaction} from "firebase/firestore";
import {GameProgressionState} from "../../domain/GameProgressionState";

function usePhaseProgressionService(game) {
    const [phaseProgress, setPhaseProgress] = useState(undefined)

    useEffect(() => {
        if (!game || game.state !== GameProgressionState.PROGRESSING) return
        setPhaseProgress(+((Date.now() - game.progressStarted) / 1000).toFixed(0) + game.phaseProgress)
        const interval = setInterval(() => setPhaseProgress(+((Date.now() - game.progressStarted) / 1000).toFixed(0) + game.phaseProgress), 100);
        return () => clearInterval(interval);
    }, [game && game.state, game && game.progressStarted])

    useEffect(() => {
        if (!phaseProgress) return
        if (((phaseProgress * game.progressionRate) / (60 * 60)) > 1) {
            const tick = async () => {
                if (game.hour < 23) {
                    await hourTick()
                } else {
                    await dayEnds()
                }
            }
            tick().catch(console.error);
        }
    }, [phaseProgress])

    async function hourTick() {
        // FIXME call EventService here else some events may be skipped
        const gameDocRef = doc(db, "games", game.id);
        await runTransaction(db, async (transaction) => {
            await transaction.update(gameDocRef, {phaseProgress: 0, hour: ++game.hour, progressStarted: Date.now()});
        });
    }

    async function dayEnds() {
        const gameDocRef = doc(db, "games", game.id);
        await runTransaction(db, async (transaction) => {
            await transaction.update(gameDocRef, {
                state: GameProgressionState.DAY_ENDED,
                phaseProgress: 0,
                hour: 0,
                day: ++game.day
            });
        });
        // FIXME call end of day events here
    }
}

export default usePhaseProgressionService;
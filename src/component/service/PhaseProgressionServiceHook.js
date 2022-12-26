import React, {useEffect, useState} from "react";
import {db} from "../../config/firebaseConfig";
import {doc, runTransaction} from "firebase/firestore";
import {GameState} from "../../domain/state";

function usePhaseProgressionService(game) {
    const [phaseProgress, setPhaseProgress] = useState(undefined)

    useEffect(() => {
        if (!game || game.state !== GameState.PROGRESSING) return
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
                    await nextDay()
                }
            }
            tick().catch(console.error);
        }
    }, [phaseProgress])

    async function hourTick() {
        const gameDocRef = doc(db, "games", game.id);
        await runTransaction(db, async (transaction) => {
            await transaction.update(gameDocRef, {phaseProgress: 0, hour: ++game.hour, progressStarted: Date.now()});
        });
    }

    async function nextDay() {
        const gameDocRef = doc(db, "games", game.id);
        await runTransaction(db, async (transaction) => {
            await transaction.update(gameDocRef, {state: GameState.PROGRESS_HALTED, phaseProgress: 0, hour: 0, day: ++game.day});
        });
    }
}

export default usePhaseProgressionService;
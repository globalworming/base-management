import React, {useEffect, useState} from "react";
import {db} from "../../config/firebaseConfig";
import {useParams} from "react-router-dom";
import {doc, runTransaction} from "firebase/firestore";
import {GameState} from "../../domain/state";

function PhaseProgressionService({game}) {
    const {gameId} = useParams();
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
            if (game.hour < 23) {
                hourTick()
            } else {
                nextDay()
            }
        }
    }, [phaseProgress])

    async function hourTick() {
        const gameDocRef = doc(db, "games", gameId);
        await runTransaction(db, async (transaction) => {
            await transaction.update(gameDocRef, {phaseProgress: 0, hour: ++game.hour, progressStarted: Date.now()});
        });
    }

    async function nextDay() {
        const gameDocRef = doc(db, "games", gameId);
        await runTransaction(db, async (transaction) => {
            await transaction.update(gameDocRef, {state: GameState.PROGRESS_HALTED, phaseProgress: 0, hour: 0, day: ++game.day});
        });
    }

    return null
}

export default PhaseProgressionService;
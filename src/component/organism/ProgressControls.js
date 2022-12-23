import React, {useEffect, useState} from "react";
import {db} from "../../config/firebaseConfig";
import {doc, runTransaction} from "firebase/firestore";
import {GameState} from "../../domain/state";

function Facilitate({game}) {
    const [phaseProgress, setPhaseProgress] = useState(0)

    useEffect(() => {
        if (!game || game.state !== GameState.PROGRESSING) return

        const alreadyProgressed = game.phaseProgress ? game.phaseProgress : 0;
        setPhaseProgress(+((Date.now() - game.progressStarted) / 1000) +  alreadyProgressed)
        const interval = setInterval(() => setPhaseProgress(+((Date.now() - game.progressStarted) / 1000) + alreadyProgressed), 100);
        return () => clearInterval(interval);
    }, [game && game.state, game && game.progressStarted])


    if (!game) {
        return null;
    }

    async function pause() {
        const gameDocRef = doc(db, "games", game.id);
        await runTransaction(db, async (transaction) => {
            await transaction.update(gameDocRef, {state: GameState.PROGRESS_HALTED, phaseProgress: +phaseProgress});
        });
    }

    async function continueGame() {
        const gameDocRef = doc(db, "games", game.id);
        await runTransaction(db, async (transaction) => {
            await transaction.update(gameDocRef, {state: GameState.PROGRESSING, progressStarted: Date.now()});
        });
    }

    return <>
        <h2>Game Progression Controls</h2>
        <button disabled={game.state === GameState.PROGRESSING} onClick={continueGame}>▶️</button>
        <button disabled={game.state !== GameState.PROGRESSING} onClick={pause}>⏸</button>
        <input type="text" readOnly value={`Day ${game.day} - ${game.hour.toString().padStart(2, "0")}:${((game.progressionRate * phaseProgress / 60) % 60).toFixed(0).padStart(2, "0")}`}/>
    </>
}

export default Facilitate;
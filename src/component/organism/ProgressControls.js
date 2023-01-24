import React, {useEffect, useState} from "react";
import {db} from "../../config/firebaseConfig";
import {doc, runTransaction} from "firebase/firestore";
import {GameProgressionState} from "../../domain/GameProgressionState";

function Facilitate({game}) {
    const [tickProgress, setTickProgress] = useState(0)

    useEffect(() => {
        if (!game || game.state !== GameProgressionState.PROGRESSING) return

        const alreadyProgressed = game.tickProgress ? game.tickProgress : 0;
        setTickProgress(+((Date.now() - game.progressStarted) / 1000) + alreadyProgressed)
        const interval = setInterval(() => setTickProgress(+((Date.now() - game.progressStarted) / 1000) + alreadyProgressed), 100);
        return () => clearInterval(interval);
    }, [game && game.state, game && game.progressStarted])


    if (!game) {
        return null;
    }

    async function pause() {
        const gameDocRef = doc(db, "games", game.id);
        await runTransaction(db, async (transaction) => {
            await transaction.update(gameDocRef, {
                state: GameProgressionState.PROGRESS_HALTED,
                tickProgress: +tickProgress
            });
        });
    }

    async function continueGame() {
        const gameDocRef = doc(db, "games", game.id);
        await runTransaction(db, async (transaction) => {
            await transaction.update(gameDocRef, {
                state: GameProgressionState.PROGRESSING,
                progressStarted: Date.now()
            });
        });
    }

    async function decrement() {
        const gameDocRef = doc(db, "games", game.id);
        await runTransaction(db, async (transaction) => {
            await transaction.update(gameDocRef, {
                hour: --game.hour,
            });
        });
    }

    async function toStart() {
        const gameDocRef = doc(db, "games", game.id);
        await runTransaction(db, async (transaction) => {
            await transaction.update(gameDocRef, {
                hour: -1,
                day: 1,
            });
        });
    }

    return <>
        <button onClick={toStart}>⏮</button>
        <button onClick={decrement}>⏪</button>
        <button disabled={game.state === GameProgressionState.PROGRESSING} onClick={continueGame}>▶️</button>
        <button disabled={game.state !== GameProgressionState.PROGRESSING} onClick={pause}>⏸</button>
        <input type="text" readOnly
               value={`Day ${game.day} - ${Math.max(0, game.hour).toString().padStart(2, "0")}:${((game.progressionRate * tickProgress / 60) % 60).toFixed(0).padStart(2, "0")}`}/>
    </>
}

export default Facilitate;
import React, {useEffect, useState} from "react";
import {db} from "../../config/firebaseConfig";
import {doc, runTransaction, writeBatch} from "firebase/firestore";
import {GameProgressionState} from "../../domain/GameProgressionState";
import CharacterActivities from "../../domain/CharacterActivities";

function useProgressionService(game, characters) {
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
        const gameDocRef = doc(db, "games", game.id);
        await runTransaction(db, async (transaction) => {
            await transaction.update(gameDocRef, {tickProgress: 0, hour: ++game.hour, progressStarted: Date.now()});
        });
    }

    async function dayEnds() {
        const {nextGame, nextCharacters} = next(game, characters)
        const gameDocRef = doc(db, "games", game.id);
        const batch = writeBatch(db);
        batch.set(gameDocRef, nextGame)
        for (const character of nextCharacters) {
            const characterDocRef = doc(db, "games", game.id, "characters", character.id);
            batch.set(characterDocRef, character)
        }

        await batch.commit();
    }
}

function next(game, characters) {
    const nextGame = Object.assign({}, game)
    const nextCharacters = characters.map(c => Object.assign({}, c))
    Object.assign(nextGame, {
        state: GameProgressionState.DAY_ENDED,
        tickProgress: 0,
        hour: 0,
        day: ++nextGame.day
    })

    function handleActivities() {
        for (const nextCharacter of nextCharacters) {
            if (nextCharacter.activity === CharacterActivities.SMELT_WATER) {
                nextCharacter.health -= 66;
            }
        }
    }

    function handleFailureCondition() {
        if (nextCharacters.filter(c => c.health <= 0)) {
            nextGame.state = GameProgressionState.SCENARIO_ENDED
            nextGame.gameOver = "people have died"
        }
    }

    handleActivities()
    handleFailureCondition()
    return {nextGame, nextCharacters}
}

export default useProgressionService;
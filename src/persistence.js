import {useEffect, useState} from "react";
import {addDoc, collection, doc, getDocs, onSnapshot, query, writeBatch} from "firebase/firestore";
import {db} from "./config/firebaseConfig";
import Scenarios from "./domain/scenario";
import {parse} from "papaparse";
import {GameProgressionState} from "./domain/GameProgressionState";
import Crew from "./domain/crew/Crew";

function initialGame(uid, scenario) {
    return {
        name: "some game " + Date.now(),
        facilitator: uid,
        state: GameProgressionState.CREATED,
        scenario,
        // 96 to have 24 hours in 15 minutes
        //progressionRate: 96,
        progressionRate: 1800,
        day: 1,
        hour: -1,
        activeEvents: [],
        tickProgress: 999
    };
}

function createCrew(gameDocRef, batch) {
    Crew.forEach(crewMember => {
        const crewMemberDocRef = doc(collection(db, "games", gameDocRef.id, "crew"));
        batch.set(crewMemberDocRef, {...crewMember});
    })
}


export const createNewGame = async (user, scenario) => {
    const gameDocRef = await addDoc(collection(db, "games"), initialGame(user.uid, scenario));

    const batch = writeBatch(db);
    createCrew(gameDocRef, batch);
    await batch.commit();
}

export const recreateGame = async (game) => {
    const batch = writeBatch(db);
    const gameDocRef = doc(db, "games", game.id);
    batch.set(gameDocRef, initialGame(game.facilitator, game.scenario))
    const queryCrew = query(collection(db, "games", game.id, "crew"));

    const crewSnapshot = await getDocs(queryCrew);
    crewSnapshot.forEach((doc) => {
        batch.delete(doc.ref)
    });
    const queryPlayers = query(collection(db, "games", game.id, "players"));
    const playersSnapshot = await getDocs(queryPlayers);
    playersSnapshot.forEach((doc) => {
        batch.update(doc.ref, {messages: []})
    });

    createCrew(gameDocRef, batch);
    await batch.commit();
}

export const useGame = (gameId) => {
    const [game, setGame] = useState(undefined)

    useEffect(() => {
        if (!gameId) return
        return onSnapshot(doc(db, "games", gameId), (doc) => {
            let game = doc.data();
            game.id = doc.id;
            setGame(game);
        });
    }, [gameId])

    return game
}

export const useGameEvents = (game) => {
    const [events, setEvents] = useState(undefined)
    useEffect(() => {
        if (!game) return
        fetch(Scenarios[game.scenario])
            .then(response => response.text())
            .then(text => {
                parse(text, {
                    delimiter: ',', quoteChar: '"', dynamicTyping: true,
                    header: true,
                    complete: function (results) {
                        setEvents(results.data)
                    }
                });
            });
    }, [game && game.scenario])
    if (!game) {
        return null
    }
    return events
}

export const usePlayers = (gameId) => {
    const [players, setPlayers] = useState(undefined)

    useEffect(() => {
        if (!gameId) return
        const q = query(collection(db, "games", gameId, "players"));
        return onSnapshot(q, (querySnapshot) => {
            const players = [];
            querySnapshot.forEach((doc) => {
                let player = doc.data();
                player.id = doc.id
                players.push(player);
            });
            setPlayers(players)
        })
    }, [gameId])

    return players
}

export const useCrew = (gameId) => {
    const [characters, setCharacters] = useState(undefined)

    useEffect(() => {
        if (!gameId) return
        const q = query(collection(db, "games", gameId, "characters"));
        return onSnapshot(q, (querySnapshot) => {
            const characters = [];
            querySnapshot.forEach((doc) => {
                let character = doc.data();
                character.id = doc.id
                characters.push(character);
            });
            setCharacters(characters)
        })
    }, [gameId])

    return characters
}


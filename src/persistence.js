import {useEffect, useState} from "react";
import {collection, doc, onSnapshot, query} from "firebase/firestore";
import {db} from "./config/firebaseConfig";

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

export const useCharacters = (gameId) => {
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


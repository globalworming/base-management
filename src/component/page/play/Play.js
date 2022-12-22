import React, {useEffect, useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db, signInAsAnonymous} from "../../../config/firebaseConfig";
import ShowsAuth from "../../organism/debug/ShowsAuth";
import {useParams} from "react-router-dom";
import {addDoc, collection, doc, onSnapshot, query, runTransaction} from "firebase/firestore";
import ShowsGame from "../../organism/debug/ShowsGame";
import ShowsPlayers from "../../organism/debug/ShowsPlayers";


function Play() {
    const [user, loading, error] = useAuthState(auth);
    const [game, setGame] = useState(undefined)
    const [players, setPlayers] = useState(undefined)
    const [name, setName] = useState("")
    const {gameId} = useParams();

    useEffect(() => {
        return onSnapshot(doc(db, "games", gameId), (doc) => {
            let game = doc.data();
            game.id = doc.id;
            setGame(game);
        });
    }, [game && game.id])

    useEffect(() => {
        if (!game) return
        const q = query(collection(db, "games", game.id, "players"));
        return onSnapshot(q, (querySnapshot) => {
            const players = [];
            querySnapshot.forEach((doc) => {
                let player = doc.data();
                player.id = doc.id
                players.push(player);
            });
            setPlayers(players)
        })
    }, [game && game.id])


    if (!loading && user === null) {
        signInAsAnonymous()
    }

    if (!game) {
        return null;
    }

    function createPlayer(e) {
        e.preventDefault()
        addDoc(collection(db, "games", game.id, "players"), {
            name: name,
            // TODO when create, do immediately
            // controlledBy: user.uid,
        });
    }

    function pickPlayer(e, playerId) {
        e.preventDefault()
        const playerDocRef = doc(db, "games", game.id, "players", playerId);
        runTransaction(db, async (transaction) => {
            transaction.update(playerDocRef, {controlledBy: user.uid});
        });
    }

    return <><h1>Play Game '{game.name}'</h1>
        <form action="#" onSubmit={createPlayer}>
            <fieldset>
                <legend>new player</legend>
                <label htmlFor="name"> name
                    <input required pattern=".*\S+.*" title="something other than whitespace" type="text" name="name"
                           id="name" value={name} onChange={(e) => setName(e.target.value)}/>
                </label>
                <button type="submit">create</button>
            </fieldset>
        </form>

        {players && players.length > 0 && <>
            {players.map((player) => <form  key={player.id} action="#" onSubmit={(e) =>pickPlayer(e, player.id)}>
                <fieldset>
                    <legend>or pick</legend>
                    <label>
                        <button type="submit" name={player.id}>{player.name}</button>
                    </label>
                </fieldset>
            </form>)}
        </>}

        <ShowsGame gameId={gameId}/>
        <ShowsPlayers gameId={gameId}/>
        <ShowsAuth/>
    </>
}

export default Play;
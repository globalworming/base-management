import React, {useEffect, useState} from 'react'
import {addDoc, collection, doc, onSnapshot, query, runTransaction} from "firebase/firestore";
import {auth, db} from "../../../config/firebaseConfig";
import {useAuthState} from "react-firebase-hooks/auth";

function SelectPlayer({gameId}) {

    const [players, setPlayers] = useState(undefined)
    const [name, setName] = useState("")
    const [user, loading, error] = useAuthState(auth);

    useEffect(() => {
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

    async function createPlayer(e) {
        e.preventDefault()
        await addDoc(collection(db, "games", gameId, "players"), {
            name: name,
            controlledBy: user.uid,
        });
    }

    async function pickPlayer(e, playerId) {
        e.preventDefault()
        const playerDocRef = doc(db, "games", gameId, "players", playerId);
        await runTransaction(db, async (transaction) => {
            await transaction.update(playerDocRef, {controlledBy: user.uid});
        });
    }

    return <>
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
            {players.map((player) => <form key={player.id} action="#" onSubmit={(e) => pickPlayer(e, player.id)}>
                <fieldset>
                    <legend>or pick</legend>
                    <label>
                        <button type="submit" name={player.id}>{player.name}</button>
                    </label>
                </fieldset>
            </form>)}
        </>}
    </>
}

export default SelectPlayer
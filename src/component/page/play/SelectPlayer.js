import React, {useState} from 'react'
import {addDoc, collection, doc, runTransaction} from "firebase/firestore";
import {auth, db} from "../../../config/firebaseConfig";
import {useAuthState} from "react-firebase-hooks/auth";

function SelectPlayer({game, players}) {

    const [name, setName] = useState("")
    const [user, loading, error] = useAuthState(auth);

    async function createPlayer(e) {
        e.preventDefault()
        await addDoc(collection(db, "games", game.id, "players"), {
            name: name,
            controlledBy: user.uid,
            // TODO https://firebase.google.com/docs/firestore/solutions/presence#solution_cloud_functions_with_realtime_database
            heartbeat: Date.now()
        });
    }

    async function pickPlayer(e, playerId) {
        e.preventDefault()
        const playerDocRef = doc(db, "games", game.id, "players", playerId);
        await runTransaction(db, async (transaction) => {
            await transaction.update(playerDocRef, {controlledBy: user.uid, heartbeat: Date.now()});
        });
    }

    return <>
        <form className={'create-player'} action="#" onSubmit={createPlayer}>
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
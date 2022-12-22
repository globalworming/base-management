import {db} from "../../../config/firebaseConfig";
import React, {useEffect, useState} from "react";
import {doc, onSnapshot} from "firebase/firestore";


function ShowsGame({gameId}) {
    const [game, setGame] = useState(undefined)

    useEffect(() => {
        return onSnapshot(doc(db, "games", gameId), (doc) => {
            let game = doc.data();
            game.id = doc.id;
            setGame(game);
        });
    }, [game && game.id])

    if (!game) {
        return null
    }
    return  <><h2>Game</h2><pre>{JSON.stringify(game, Object.keys(game).sort(), 2)}</pre></>
}

export default ShowsGame
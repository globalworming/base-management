import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db, logout} from "../../../config/firebaseConfig";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
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


    return  <><h2>Game</h2><pre>{JSON.stringify(game, null, 2)}</pre></>
}

export default ShowsGame
import React, {useEffect, useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../../../config/firebaseConfig";
import ShowsAuth from "../../organism/debug/ShowsAuth";
import {useParams} from "react-router-dom";
import {collection, doc, onSnapshot, query} from "firebase/firestore";
import ShowsGame from "../../organism/debug/ShowsGame";
import ShowsPlayers from "../../organism/debug/ShowsPlayers";
import catastrophe from "../../../domain/scenario/catastrophe.csv"
import {parse} from 'papaparse';

function Facilitate() {
    const {gameId} = useParams();
    const [user, loading, error] = useAuthState(auth);
    const [game, setGame] = useState(undefined)
    const [players, setPlayers] = useState(undefined)
    const [ text, setText ] = useState();

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

    if (loading || !game) {
        return null;
    }


    const load = function(){
        fetch( catastrophe )
            .then( response => response.text() )
            .then( responseText => {
                setText(parse(responseText, {header: true}));
            });
    };

    return <><h1>you are facilitating '{game.name}'</h1>
        <button onClick={ load }>load</button>
        <pre>{ JSON.stringify(text, null, 2)}</pre>

        <ShowsGame gameId={game.id}/>
        <ShowsPlayers gameId={game.id}/>
        <ShowsAuth/>
    </>
}

export default Facilitate;
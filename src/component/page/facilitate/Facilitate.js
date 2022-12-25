import React, {useEffect, useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../../../config/firebaseConfig";
import ShowsAuth from "../../organism/debug/ShowsAuth";
import {useParams} from "react-router-dom";
import {doc, onSnapshot} from "firebase/firestore";
import ShowsGame from "../../organism/debug/ShowsGame";
import ShowsPlayers from "../../organism/debug/ShowsPlayers";
import ShowsScenario from "../../organism/debug/ShowsScenario";
import {GameState} from "../../../domain/state";
import ProgressControls from "../../organism/ProgressControls";
import PhaseProgressionService from "../../service/PhaseProgressionService";
import EventService from "../../service/EventService";
import ActivePlayers from "../../organism/ActivePlayers";
import NextEvents from "../../organism/NextEvents";
import ShowsFacilitatorCharacters from "../../organism/ShowsFacilitatorCharacters";

const Group = function ({children}) {
  return <div style={{border: "3px double black", padding: "2px", borderRadius: "5px"}}>
      {children}
  </div>

}

function Facilitate() {
    const {gameId} = useParams();
    const [user, loading, error] = useAuthState(auth);
    const [game, setGame] = useState(undefined)
    const [phaseProgress, setPhaseProgress] = useState(undefined)

    useEffect(() => {
        return onSnapshot(doc(db, "games", gameId), (doc) => {
            let game = doc.data();
            game.id = doc.id;
            setGame(game);
        });
    }, [game && game.id])

    useEffect(() => {
        if (!game || game.state !== GameState.PROGRESSING) return
        setPhaseProgress(Date.now() - game.progressStarted)
        const interval = setInterval(() => setPhaseProgress(Date.now() - game.progressStarted), 1000);
        return () => clearInterval(interval);
    }, [game && game.state])


    if (loading || !game) {
        return null;
    }

    return <><h1 style={{width: "100%"}}>you are facilitating '{game.name}'</h1>
        <Group>
            <ProgressControls game={game}/>
            <NextEvents scenarioId={game.scenario} game={game}/>
        </Group>
        <Group>
            <ActivePlayers game={game}/>
        </Group>
        <Group>
            <ShowsFacilitatorCharacters game={game}/>
        </Group>
        <PhaseProgressionService game={game}/>
        <EventService game={game}/>
        <hr style={{width: "100%"}}/>
        <ShowsGame gameId={game.id}/>
        <hr style={{width: "100%"}}/>
        <ShowsPlayers gameId={game.id}/>
        <hr style={{width: "100%"}}/>
        <ShowsScenario scenarioId={game.scenario}/>
        <hr style={{width: "100%"}}/>
        <ShowsAuth/>
    </>
}

export default Facilitate;
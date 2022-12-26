import React, {useEffect, useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../../../config/firebaseConfig";
import ShowsAuth from "../../organism/debug/ShowsAuth";
import {useParams} from "react-router-dom";
import {collection, doc, onSnapshot, query} from "firebase/firestore";
import ShowsGame from "../../organism/debug/ShowsGame";
import ShowsPlayers from "../../organism/debug/ShowsPlayers";
import ShowsScenario from "../../organism/debug/ShowsScenario";
import ProgressControls from "../../organism/ProgressControls";
import PhaseProgressionService from "../../service/PhaseProgressionService";
import EventService from "../../service/EventService";
import ActivePlayers from "../../organism/ActivePlayers";
import NextEvents from "../../organism/NextEvents";
import ShowsFacilitatorCharacters from "../../organism/ShowsFacilitatorCharacters";
import Panel from "../../atom/Panel";
import {useCharacters, useGame, usePlayers} from "../../../persistence";

function Facilitate() {
    const [user, loading, error] = useAuthState(auth);
    const {gameId} = useParams();
    const game = useGame(gameId)
    const players = usePlayers(gameId)
    const characters = useCharacters(gameId)

    if (loading || !game) {
        return null;
    }

    return <>
        <h1 style={{width: "100%"}}>you are facilitating '{game.name}'</h1>
        <Panel>
            <ProgressControls game={game}/>
            <NextEvents scenarioId={game.scenario} game={game}/>
        </Panel>
        <Panel>
            <ActivePlayers players={players}/>
        </Panel>
        <Panel>
            <ShowsFacilitatorCharacters characters={characters}/>
        </Panel>
        <PhaseProgressionService game={game}/>
        <EventService game={game}/>
        <hr style={{width: "100%"}}/>
        <ShowsGame game={game}/>
        <hr style={{width: "100%"}}/>
        <ShowsPlayers players={players}/>
        <hr style={{width: "100%"}}/>
        <ShowsScenario scenarioId={game.scenario}/>
        <hr style={{width: "100%"}}/>
        <ShowsAuth/>
    </>
}

export default Facilitate;
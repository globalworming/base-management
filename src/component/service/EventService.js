import React, {useEffect, useState} from "react";
import {db} from "../../config/firebaseConfig";
import {doc, runTransaction} from "firebase/firestore";
import Scenarios from "../../domain/scenario";
import {parse} from "papaparse";

function EventService({game}) {
    const [scenario, setScenario] = useState(undefined)

    useEffect(() => {
        if (!game) return;
        fetch(Scenarios[game.scenario])
            .then(response => response.text())
            .then(responseText => {
                setScenario(parse(responseText, {header: true}).data);
            });
    }, [])

    async function handle(e) {
        console.log({e})

        switch (e) {
            case "FIRE_IN_SMELTER":
                await fireInSmelter();
                break;
            default:
                break;
        }

        async function fireInSmelter() {
            const gameDocRef = doc(db, "games", game.id);
            await runTransaction(db, async (transaction) => {
                await transaction.update(gameDocRef, {
                   activeEvents: [...game.activeEvents, "FIRE_IN_SMELTER"]
                });
            });
        }
    }

    useEffect(() => {
        if (!game || !scenario) return;
        if (scenario.length <= 0) return
        let events = scenario.filter(row => +row.day === game.day).filter(row => +row.hour === game.hour).filter(row => !!row.event).map(row => row.event);
        if (events.length === 0) return
        async function handleEvents(events) {
            for (const e of events) {
                await handle(e)
            }
        }
        handleEvents(events);
    }, [game && game.hour, game && game.day])

}

export default EventService;
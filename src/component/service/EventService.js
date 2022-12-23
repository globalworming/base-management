import React, {useEffect, useState} from "react";
import Scenarios from "../../domain/scenario";
import Events from "../../domain/event";
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
        await Events[e](game);
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
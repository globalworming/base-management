import React, {useEffect, useState} from "react";
import Scenarios from "../../domain/scenario";
import {parse} from "papaparse";

function NextEvents({scenarioId, game}) {
    const [scenario, setScenario] = useState(undefined)
    const [nextEvents, setNextEvents] = useState([])

    useEffect(() => {
        if (!game) {
            return
        }
        setNextEvents([])
        fetch(Scenarios[scenarioId])
            .then(response => response.text())
            .then(responseText => {
                setScenario(parse(responseText, {header: true}).data)
            });
    }, [game && game.id])

    useEffect(() => {
        if (!game || !scenario || scenario.length <= 0) {
            return
        }
        const first = scenario
            .filter(e => !!e.event)
            .filter(e => e.day >= game.day)
            .filter(e => e.hour > game.hour)[0];
        if (!first) return
        setNextEvents(scenario
            .filter(e => !!e.event)
            .filter(e => e.day >= first.day)
            .filter(e => e.hour >= first.hour)
            .slice(0, 10))
    }, [scenario && scenario.length, game && game.hour])


    if (!game) {
        return null
    }
    return <>
        <h2>upcoming events</h2>
        {nextEvents.map((e, i) => <p
            key={i}>{`Day ${e.day} - ${e.hour.toString().padStart(2, "0")}:00 - ${e.event}`}</p>)}

    </>
}

export default NextEvents;
import React, {useEffect, useState} from "react";

function NextEvents({game, events}) {
    const [nextEvents, setNextEvents] = useState(undefined)

    useEffect(() => {
        if (!game || !events || events.length <= 0) {
            return
        }
        const today = events
            .filter(e => !!e.event)
            .filter(e => e.day === game.day)
            .filter(e => e.hour > game.hour) || [];
        const nextDays = events
            .filter(e => !!e.event)
            .filter(e => e.day > game.day) || []
        const next = [...today, ...nextDays]
        if (!next || next.length === 0) return
        setNextEvents(next
            .slice(0, 10))
    }, [events && events.length, game && game.hour])


    if (!game || !events || !nextEvents) {
        return null
    }
    return <>
        <h2>upcoming events</h2>
        {nextEvents.map((e, i) => <p
            key={i}>{`Day ${e.day} - ${e.hour.toString().padStart(2, "0")}:00 - ${e.event}`}</p>)}

    </>
}

export default NextEvents;
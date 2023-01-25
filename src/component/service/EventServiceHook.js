import React, {useEffect} from "react";
import Events from "../../domain/event";

function useEventService(game, players, scenario) {
    async function handle(e) {
        await Events[e.event](game, players, e.arg);
    }

    useEffect(() => {
        if (!game || !scenario) return;
        if (scenario.length <= 0) return
        let events = scenario
            .filter(row => +row.day === game.day)
            .filter(row => +row.hour === game.hour)
            .filter(row => !!row.event)
            .map(row => {
                return {
                    event: row.event,
                    arg: row.arg1
                }
            });

        if (events.length === 0) return

        async function handleEvents(events) {
            for (const e of events) {
                await handle(e)
            }
        }

        handleEvents(events);
    }, [game && game.hour, game && game.day, scenario && scenario.length])

}

export default useEventService;
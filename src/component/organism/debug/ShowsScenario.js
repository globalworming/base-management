import React, {useEffect, useState} from "react";
import Scenarios from "../../../domain/scenario";
import {parse} from "papaparse";


function ShowsScenario({scenarioId}) {
    const [scenario, setScenario] = useState(undefined)

    useEffect(() => {
        fetch(Scenarios[scenarioId])
            .then(response => response.text())
            .then(responseText => {
                setScenario(parse(responseText, {header: true}).data);
            });
    }, [])


    return <><h2>Scenario</h2>
        <pre>{JSON.stringify(scenario, null, 2)}</pre>
    </>
}
export default ShowsScenario;
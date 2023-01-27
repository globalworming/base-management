import React from "react";
import ControlCrewMember from "./ControlCrewMember";
import Panel from "../atom/Panel";

function ControlCrew({game, crew}) {

    if (crew === undefined || !game) {
        return null;
    }

    return <>
        <Panel style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            alignContent: "flex-start",
            alignItems: "stretch",
            justifyContent: "space-between",
        }}>
            {crew.map(crewMember => <ControlCrewMember
                crewMember={crewMember}
                game={game}
                key={crewMember.id}
            ></ControlCrewMember>)}
        </Panel>
    </>
}

export default ControlCrew;
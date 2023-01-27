import React from "react";

function ShowsFacilitatorCrew({characters: crew}) {

    if (crew === undefined) {
        return null;
    }

    return <>
        <h2>Character - Activity</h2>
        {crew.map(crewMember => <p key={crewMember.id} style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            justifyContent: "space-between",
        }}>
            <span>{crewMember.name}</span> - <span>{(crewMember.activity || "").trim().length > 0 ? crewMember.activity : "unassigned"}</span>
        </p>)}
    </>
}

export default ShowsFacilitatorCrew;
import React from "react";

function ShowsFacilitatorCharacters({characters}) {

    if (characters === undefined) {
        return null;
    }

    return <>
        <h2>Character - Activity</h2>
        {characters.map(character => <p key={character.id} style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            justifyContent: "space-between",
        }}>
            <span>{character.name}</span> - <span>{(character.activity || "").trim().length > 0 ? character.activity : "unassigned"}</span>
        </p>)}
    </>
}

export default ShowsFacilitatorCharacters;
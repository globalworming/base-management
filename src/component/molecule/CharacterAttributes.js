import React from "react";

function CharacterAttributes({character}) {

    function Row({children}) {
        return <div
            style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "nowrap",
                justifyContent: "space-between",
                background: 0 % 2 === 0 ? "none" : "lightgray",
                borderBottom: "1px solid black"
            }}>
            {children}
        </div>;
    }

    return <div style={{display: "flex", flexDirection: "column", width: "100%"}}>
        <Row><span>{character.name}</span></Row>
        <Row><span>Health:</span><span>{character.health}</span></Row>
        <Row><span>Temp.:</span><span>37.4°C</span></Row>
        <Row><span>Mood:</span><span>Cheerful</span></Row>
    </div>
}


export default CharacterAttributes
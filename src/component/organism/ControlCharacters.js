import React from "react";
import ControlCharacter from "./ControlCharacter";
import Panel from "../atom/Panel";

function ControlCharacters({game, characters}) {

    if (characters === undefined || !game) {
        return null;
    }

    return <>
        <h2>Crew</h2>
        <Panel style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            alignContent: "flex-start",
            alignItems: "stretch",
            justifyContent: "space-between",
        }}>
            {characters.map(character => <ControlCharacter
                character={character}
                game={game}
                key={character.id}
            ></ControlCharacter>)}
        </Panel>
    </>
}

export default ControlCharacters;
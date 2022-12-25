import React, {useEffect, useState} from "react";
import {collection, onSnapshot, query} from "firebase/firestore";
import {db} from "../../config/firebaseConfig";

function ShowsFacilitatorCharacters({game}) {
    const [characters, setCharacters] = useState(undefined)

    useEffect(() => {
        if (!game) return
        const q = query(collection(db, "games", game.id, "characters"));
        return onSnapshot(q, (querySnapshot) => {
            const characters = [];
            querySnapshot.forEach((doc) => {
                let character = doc.data();
                character.id = doc.id
                characters.push(character);
            });
            setCharacters(characters)
        })
    }, [game, JSON.stringify(characters)])

    if (!game || characters === undefined) {
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
            <span>{character.name}</span> - <span>{character.activity.trim().length > 0 ? character.activity : "unassigned"}</span>
        </p>)}
    </>
}

export default ShowsFacilitatorCharacters;
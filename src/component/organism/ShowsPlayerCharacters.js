import React, {useEffect, useState} from "react";
import {collection, doc, onSnapshot, query, runTransaction} from "firebase/firestore";
import {db} from "../../config/firebaseConfig";

function ShowsFacilitatorCharacters({game}) {
    const [characters, setCharacters] = useState(undefined)
    const [mapCharacterToActivity, setMapCharacterToActivity] = useState(new Map())

    useEffect(() => {
        if (!game) return
        console.log("snapshot!!!!")
        const q = query(collection(db, "games", game.id, "characters"));
        return onSnapshot(q, (querySnapshot) => {
            const characters = [];
            const mapCharacterToActivity = new Map();
            querySnapshot.forEach((doc) => {
                let character = doc.data();
                character.id = doc.id
                characters.push(character);
                mapCharacterToActivity.set(character, character.activity)
            });
            setCharacters(characters)
            setMapCharacterToActivity(mapCharacterToActivity)
        })
    }, [game])

    if (!game || characters === undefined) {
        return null;
    }

    async function setActivity(e, character) {
        e.preventDefault()
        const characterDocRef = doc(db, "games", game.id, "characters", character.id);
        await runTransaction(db, async (transaction) => {
            await transaction.update(characterDocRef, {
                activity: e.target[0].value
            });
        });
    }

    console.log(mapCharacterToActivity)
    return <>
        <h2>Characters</h2>
        {characters.map(character => <div key={character.id} style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            justifyContent: "space-between",
        }}>
            <span>{character.name}</span> - <form onSubmit={(e) => setActivity(e, character)}>
            <label>
                activity:
                <select defaultValue={character.activity} onChange={(e) => {
                    mapCharacterToActivity.set(character, e.target.value);
                    return setMapCharacterToActivity(new Map([...mapCharacterToActivity]))
                }}>
                    <option value="">unassigned</option>
                    <option value="smeltWater">Smelt Water</option>
                    <option value="visitSickBay">Visit Sickbay</option>
                </select>
            </label>
            <input disabled={mapCharacterToActivity.get(character) === character.activity} type="submit" value="Submit"/>
        </form>
        </div>)}
    </>
}

export default ShowsFacilitatorCharacters;
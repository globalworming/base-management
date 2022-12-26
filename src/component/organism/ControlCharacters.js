import React, {useEffect, useState} from "react";
import {doc, runTransaction} from "firebase/firestore";
import {db} from "../../config/firebaseConfig";

function ControlCharacters({game, characters}) {
    const [mapCharacterToActivity, setMapCharacterToActivity] = useState(new Map())

    useEffect(() => {
        if (!characters) return
        const mapCharacterToActivity = new Map();
        characters.forEach(character => {
            mapCharacterToActivity.set(character, character.activity)
        })
        setMapCharacterToActivity(mapCharacterToActivity)
    }, [JSON.stringify(characters)])

    if (characters === undefined || !game) {
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

    return <>
        <h2>Characters</h2>
        {characters.map(character => <div key={character.id} style={{
            display: "flex",
            flexDirection: "column",
        }}>
            <p><span>{character.name}</span>, health {character.health}</p>
            <form style={{display: "flex", gap: "5px"}} onSubmit={(e) => setActivity(e, character)}>
                <label style={{display: "flex", gap: "5px"}}>
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
                <input disabled={mapCharacterToActivity.get(character) === character.activity} type="submit"
                       value="Assign"/>
            </form>
        </div>)}
    </>
}

export default ControlCharacters;
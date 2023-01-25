import {DefaultActivities, UNASSIGNED} from "../../domain/CharacterActivities";
import React, {useEffect, useState} from "react";
import {doc, runTransaction} from "firebase/firestore";
import {db} from "../../config/firebaseConfig";
import Panel from "../atom/Panel";

const ControlCharacter = ({character, game}) => {
    const [localActivity, setLocalActivity] = useState(UNASSIGNED)

    useEffect(() => {
        setLocalActivity(character.activity)
    }, [character.activity])

    async function setActivity(e, character) {
        e.preventDefault()
        const characterDocRef = doc(db, "games", game.id, "characters", character.id);
        await runTransaction(db, async (transaction) => {
            await transaction.update(characterDocRef, {
                activity: e.target[0].value
            });
        });
    }

    return <Panel style={{
        display: "flex",
        flexDirection: "column",
    }}>
        <p><span>{character.name}</span>, health {character.health}</p>
        <form style={{display: "flex", gap: "5px"}} onSubmit={(e) => setActivity(e, character)}>
            <label style={{display: "flex", gap: "5px"}}>
                activity:
                <select value={localActivity} onChange={(e) => {
                    setLocalActivity(e.target.value)
                }}>
                    {DefaultActivities.map(activity =>
                        <option key={activity} value={activity}>{activity}</option>)}
                </select>
            </label>
            <input disabled={localActivity === character.activity} type="submit"
                   value="Assign"/>
        </form>
    </Panel>
}

export default ControlCharacter
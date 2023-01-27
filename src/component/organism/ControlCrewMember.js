import {DefaultActivities, UNASSIGNED} from "../../domain/CrewActivities";
import React, {useEffect, useState} from "react";
import {doc, runTransaction} from "firebase/firestore";
import {db} from "../../config/firebaseConfig";
import Panel from "../atom/Panel";
import CrewMemberAttributes from "../molecule/CrewMemberAttributes";

const ControlCrewMember = ({crewMember: crewMember, game}) => {
    const [localActivity, setLocalActivity] = useState(UNASSIGNED)

    useEffect(() => {
        setLocalActivity(crewMember.activity)
    }, [crewMember.activity])

    async function setActivity(e, crewMember) {
        e.preventDefault()
        const crewMemberDocRef = doc(db, "games", game.id, "crew", crewMember.id);
        await runTransaction(db, async (transaction) => {
            await transaction.update(crewMemberDocRef, {
                activity: e.target[0].value
            });
        });
    }

    return <Panel style={{
        display: "flex",
        flexDirection: "column",
    }}>
        <CrewMemberAttributes crewMember={crewMember}/>
        <form style={{display: "flex", gap: "5px", flexDirection: "column"}}
              onSubmit={(e) => setActivity(e, crewMember)}>
            <label htmlFor={"activity"} style={{flexBasis: "100%"}}>
                activity:
            </label>
            <select id={"activity"} style={{flex: "1 1 1"}} value={localActivity} onChange={(e) => {
                setLocalActivity(e.target.value)
            }}>
                {DefaultActivities.map(activity =>
                    <option key={activity} value={activity}>{activity}</option>)}
            </select>
            <input disabled={!localActivity || (localActivity === crewMember.activity)} type="submit"
                   value="Assign"/>
        </form>
    </Panel>
}

export default ControlCrewMember
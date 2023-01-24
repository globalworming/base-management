import React, {useEffect, useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {useNavigate} from "react-router-dom";
import {auth, db} from "../../../config/firebaseConfig";
import {addDoc, collection, deleteDoc, doc, onSnapshot, query, where, writeBatch} from "firebase/firestore";
import ShowsAuth from "../../organism/debug/ShowsAuth";
import {GameProgressionState} from "../../../domain/GameProgressionState";

function Dashboard() {
    const [user, loading, error] = useAuthState(auth);
    const [games, setGames] = useState([]);
    const [scenario, setScenario] = useState("fastEndOfDay");
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return
        const q = query(collection(db, "games"), where("facilitator", "==", user.uid));
        return onSnapshot(q, (querySnapshot) => {
            const games = [];
            querySnapshot.forEach((doc) => {
                let game = doc.data();
                game.id = doc.id
                games.push(game);
            });
            setGames(games)
        })
    }, [user])
    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");
    }, [user, loading]);

    const createGame = async (e) => {
        e.preventDefault();
        const gameDocRef = await addDoc(collection(db, "games"), {
            name: "some game " + Date.now(),
            facilitator: user.uid,
            state: GameProgressionState.CREATED,
            scenario,
            // 96 to have 24 hours in 15 minutes
            //progressionRate: 96,
            // two hours per second
            progressionRate: 7200,
            day: 1,
            hour: -1,
            activeEvents: [],
            tickProgress: 0
        });

        const batch = writeBatch(db);
        const characters = [
            {name: "Yumi Chatea", health: 100, activity: ""},
            {name: "Zoe Müller", health: 100, activity: ""},
            {name: "Maxis Gavranovic", health: 100, activity: ""},
        ]
        characters.forEach(character => {
            const characterDocRef = doc(collection(db, "games", gameDocRef.id, "characters"));
            batch.set(characterDocRef, character);
        })
        await batch.commit();
    };

    async function deleteGame(id) {
        // TODO does not delete subcollections, use clean up job deleting orphaned subcollections
        await deleteDoc(doc(db, "games", id));
    }

    async function copyTextToClipboard(text) {
        if ('clipboard' in navigator) {
            return await navigator.clipboard.writeText(text);
        } else {
            return document.execCommand('copy', true, text);
        }
    }


    return (<>
        <h1 style={{width: "100%"}}>Welcome Facilitator</h1>
        <form style={{display: "flex", gap: "5px"}} onSubmit={createGame}>
            <label style={{display: "flex", gap: "5px"}}>
                scenario:
                <select defaultValue="fastEndOfDay" onChange={(e) => {
                    setScenario(e.target.value)
                }}>
                    { // FIXME refactor DRY
                    }
                    <option value={"fastEndOfDay"}>fast end of day</option>
                    <option value={"catastrophe"}>catastrophe</option>
                </select>
            </label>
            <button className={"create-game"} type="submit">
                create new game
            </button>
        </form>
        <hr style={{width: "100%"}}/>
        <div>
            <h2>Games in progress</h2>
            {games.map(it => {
                const inviteLink = window.location.href.split("/#")[0] + "/#/join/" + it.id;

                return <div key={it.id}>
                    <pre>{JSON.stringify(it, null, 2)}</pre>
                    <button onClick={() => navigate(`/facilitate/${it.id}`)}>continue</button>
                    <button onClick={() => copyTextToClipboard(inviteLink)}>copy invitation link</button>
                    <input className={"invite-link"} type="text" readOnly value={inviteLink}/>
                    <button onClick={() => deleteGame(it.id)}>❌</button>
                </div>
            })}
        </div>
        <hr style={{width: "100%"}}/>

        <ShowsAuth/>

    </>);
}

export default Dashboard;
import React, {useEffect, useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {useNavigate} from "react-router-dom";
import {auth, db} from "../../../config/firebaseConfig";
import {collection, deleteDoc, doc, onSnapshot, query, where} from "firebase/firestore";
import ShowsAuth from "../../organism/debug/ShowsAuth";
import {createNewGame} from "../../../persistence";
import Scenarios from "../../../domain/scenario";
import Panel from "../../atom/Panel";

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
        <form style={{display: "flex", gap: "5px"}} onSubmit={(e) => {
            e.preventDefault();
            createNewGame(user, scenario)
        }}>
            <label style={{display: "flex", gap: "5px"}}>
                scenario:
                <select defaultValue="fastEndOfDay" onChange={(e) => {
                    setScenario(e.target.value)
                }}>
                    {
                        Object.keys(Scenarios).map((key) => {
                            return <option value={key} key={key}>{key}</option>;
                        })
                    }
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

                return <Panel key={it.id}>
                    <h1>{it.scenario}</h1> <h2>{it.name}</h2>
                    <button onClick={() => navigate(`/facilitate/${it.id}`)}>continue</button>
                    <button onClick={() => copyTextToClipboard(inviteLink)}>copy invitation link</button>
                    <input className={"invite-link"} type="text" readOnly value={inviteLink}/>
                    <button style={{display: "none"}} onClick={() => deleteGame(it.id)}>❌</button>
                </Panel>
            })}
        </div>
        <hr style={{width: "100%"}}/>

        <ShowsAuth/>

    </>);
}

export default Dashboard;
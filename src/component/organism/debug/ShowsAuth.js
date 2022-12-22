import {useAuthState} from "react-firebase-hooks/auth";
import {auth, logout} from "../../../config/firebaseConfig";
import React from "react";


function ShowsAuth() {
    const [user, loading, error] = useAuthState(auth);
    if (loading) {
        return <><h2>Auth</h2>loading</>
    }

    return <> <h2>Auth</h2>
        <pre>{JSON.stringify(user, null, 2)}</pre>
        <button onClick={logout}>
            Logout
        </button></>
}

export default ShowsAuth
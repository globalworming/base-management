import React from "react";


function ShowsEvents({events}) {
    if (!events) return null
    return <><h2>Events</h2>
        <pre>{JSON.stringify(events, null, 2)}</pre>
    </>
}

export default ShowsEvents;
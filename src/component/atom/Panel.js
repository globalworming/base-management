import React from "react";

const Panel = function ({children}) {
    return <div style={{border: "3px double black", padding: "5px", borderRadius: "5px"}}>
        {children}
    </div>
}

export default Panel
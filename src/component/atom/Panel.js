import React from "react";

const Panel = function ({children, style}) {
    return <div style={Object.assign(style || {}, {border: "3px double black", padding: "5px", borderRadius: "5px"})}>
        {children}
    </div>
}

export default Panel
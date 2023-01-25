import Panel from "../atom/Panel";
import React from "react";
import {Views} from "../page/play/Play";

const SelectView = ({focusView, setFocusView}) => <Panel style={{
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    width: "15%"
}}>
    {
        Object.keys(Views).map(view => {
            let viewValue = Views[view];
            return <button
                style={focusView === viewValue ? {
                    borderWidth: "5px",
                    borderStyle: "groove",
                    borderColor: "red",
                } : {
                    borderWidth: "5px",
                    borderStyle: "solid",
                    borderColor: "darkgray",
                }}
                type={"button"} onClick={() => setFocusView(viewValue)}
                key={view}
            >{viewValue}</button>;
        })
    }
</Panel>;

export default SelectView
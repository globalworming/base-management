import React, {useEffect, useState} from "react";

const GameOver = ({game}) => {
    const [opacity, setOpacity] = useState(0)

    useEffect(() => {
        const timer = setTimeout(() => setOpacity(1), 100);
        return () => clearTimeout(timer);
    })

    if (!game.gameOver) {
        return null
    }

    return <div style={{
        position: "absolute",
        top: "20%",
        background: "black",
        textAlign: "center",
        padding: "3rem",
        width: "100%",
        boxShadow: "0px 0px 15px 20px black",
        color: "darkred",
        opacity: opacity,
        transition: "opacity 3s", fontFamily: "Optimus", fontSize: "30px", textShadow: "darkred -2px 7px 6px"
    }}>
        <h1>Game Over</h1>
        {game.gameOver}
    </div>
}

export default GameOver
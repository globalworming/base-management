import React from "react";

const GameOver = (game) => {

    if (!game.gameOver) {
        return null
    }

    return <div style={{
        position: "absolute",
        top: "20%",
        background: "darkred",
        textAlign: "center",
        padding: "3rem",
        width: "100%",
        boxShadow: "0px 0px 15px 20px darkred"
    }}>
        {game.gameOver}
    </div>
}

export default GameOver
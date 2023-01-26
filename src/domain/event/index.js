import FireInSmelter from "./FireInSmelter";
import ProgressionSpeedNormal from "./ProgressionSpeedNormal";
import ProgressionSpeedFast from "./ProgressionSpeedFast";
import HaltProgression from "./HaltProgression";
import JumpTicks from "./JumpTicks";
import ScenarioEnds from "./ScenarioEnds";
import CircuitBoardFailure from "./circuitBoardFaillure/CircuitBoardFailure";

// TODO create event class with 'handle' method that takes the game state and returns the resulting game state
// or create a reducer that does basically the same. then instead of handling transactions in the event,
// apply all events and then persist the resulting state
const Events = {
    CircuitBoardFailure,
    FireInSmelter,
    HaltProgression,
    JumpTicks,
    ProgressionSpeedNormal,
    ProgressionSpeedFast,
    ScenarioEnds
};
export default Events;

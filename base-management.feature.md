# Scenario: Proof of Concept 
https://globalworming.github.io/base-management/  
Because I was curious about the technical feasibility, I wanted to check a few things:

* can we use CSV as a way to script scenarios "keyword-driven": ✅ yes, currently new games
  use [the catastrophe.csv](src/domain/scenario/catastrophe.csv) and check the specific events for the current day/hour.
  Proper spreadsheet support is also possible but csv plays nicer with git
* can the game be "driven" by the facilitator application and a real time database: ✅ yes, the
  [Phase Progression Service](src/component/service/PhaseProgressionService.js) keeps track of time, updates the games day and hour state, the [Event Service](src/component/service/EventService.js) checks the game day/hour and looks up and executes the events from the CSV, [Game Controls](src/component/organism/ProgressControls.js) can be used to start the game, the next day or play/pause  

## Feature: Works End-to-End
To see it working, follow the steps. That's basically a test script that can be automated later 

| actor       | step                                                              | expected outcome                               |
|-------------|-------------------------------------------------------------------|------------------------------------------------|
| facilitator | open browser on https://globalworming.github.io/base-management/  | see login form                                 |
|             | login as guest                                                    | see "Welcome Facilitator"                      |
|             | create new game                                                   | see new game under "Games in progress"         |
|             | copy invitation link                                              |                                                |
|             | continue game                                                     | see "you are facilitating {gameName}"          |
| player      | open browser (inkognito or different profile) on {invitationLink} | see 'create player' form                       |
|             | create player with name {name}                                    | see "you are playing {gameName} as {name}"     |
| facilitator | start game                                                        | ingame-time progresses very fast               |
|             |                                                                   | at 13:00 ingame-time progresses sligtly slower |
|             |                                                                   | at 14:00 see active event "fire in smelter"    |
|             |                                                                   | at 14:00 ingame-time progresses slower         |
| player      |                                                                   | at 14:00 see active event "fire in smelter"    |
| facilitator |                                                                   | at 15:00 game progress is halted               |

## next:
- check UX when multiple players simultaneously assign character activities
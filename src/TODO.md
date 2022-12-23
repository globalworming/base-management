### as very basic funcions, mock and simulate where needed to go fast
- [x] login
- [x] create game, 
- [x] examples scenario
- [x] copy invite
- [x] one player joins
- [X] facilitator start day
- [x] scenario as tabular data
- [x] first day with an event that changes a world attribute
- [X] a fast forward event
- [X] ticking stops at end of day
- [x] start next day
- [x] fix hashrouter invite link on github pages
- [X] create player automatically selects

### editor convenience
- [ ] load all scenarios and sanity check
- [ ] fully edit game state

### tech debt
- [ ] refactor firebase listeners to single context providers
- [ ] refactor centralize game control transactions 
- [ ] no automated quality checks at all

### notes
- [ ] do multi actor e2e test, check serenity js maybe
- [ ] check connected/disconnected https://firebase.google.com/docs/database/web/offline-capabilities
- [ ] check security rules to ensure you cant mess with other peoples game data, though that's probably a minor issue
- [ ] check firebase performance monitoring
- [ ] how much will it cost to run a game? 10k games?
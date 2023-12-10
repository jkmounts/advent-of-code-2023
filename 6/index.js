const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');

// Parse Text

let [raceTimes, recordDistances] = input.trim().split(/\n+/);
raceTimes = raceTimes.split(/\s+/);
raceTimes.shift();
raceTimes = raceTimes.map(Number);
recordDistances = recordDistances.split(/\s+/);
recordDistances.shift();
recordDistances = recordDistances.map(Number);

class Race {
  constructor(raceNumber) {
    this.raceNumber = raceNumber;
    this.time = raceTimes[raceNumber];
    this.record = recordDistances[raceNumber];
  }

  get winningTimes() {
    // Get shortest button hold that allows a win
    let shortestTime = 0;
    for(let buttonHeldTime = 0; !shortestTime; buttonHeldTime++) {
      const speed = buttonHeldTime;
      const timeRemaining = this.time - buttonHeldTime;
      const distanceTraveled = speed * timeRemaining;
      shortestTime = distanceTraveled > this.record ? buttonHeldTime : 0;
    }
    let longestTime = 0;
    for(let buttonHeldTime = this.time; !longestTime; buttonHeldTime--) {
      const speed = buttonHeldTime;
      const timeRemaining = this.time - buttonHeldTime;
      const distanceTraveled = speed * timeRemaining;
      longestTime = distanceTraveled > this.record ? buttonHeldTime : 0;
    }
    return longestTime - shortestTime + 1;
  }
}

const races = Array.from(Array(raceTimes.length), (_, index) => new Race(index));

const total = races.reduce((total, currentRace, index) => {
  const numberOfWinningTimes = currentRace.winningTimes;
  index === 0 ? total += numberOfWinningTimes : total *= numberOfWinningTimes;
  return total;
}, 0)

console.log('Part 1 - Total Winning Times Multiplied:', total);

// Part 2
raceTimes = [Number(raceTimes.join(''))];
recordDistances= [Number(recordDistances.join(''))];

const race = new Race(0);
console.log('Part 2 - Number of way to win big race:', race.winningTimes);
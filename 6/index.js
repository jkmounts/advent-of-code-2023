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
    const winningTimes = [];
    for (let buttonHeldTime = 0; buttonHeldTime <= this.time; buttonHeldTime++) {
      const speed = buttonHeldTime;
      const timeRemaining = this.time - buttonHeldTime;
      const distanceTraveled = speed * timeRemaining;
      distanceTraveled > this.record ? winningTimes.push({ buttonHeldTime, speed, distanceTraveled }) : null;
    }
    return winningTimes;
  }
}

const races = Array.from(Array(raceTimes.length), (_, index) => new Race(index));

const total = races.reduce((total, currentRace, index) => {
  const numberOfWinningTimes = currentRace.winningTimes.length;
  index === 0 ? total += numberOfWinningTimes : total *= numberOfWinningTimes;
  return total;
}, 0)

console.log('Part 1 - Total Winning Times Multiplied:', total);

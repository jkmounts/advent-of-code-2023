
const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');

const lines = input.split(/\r?\n/);

const games = lines.map((line) => {
  const game = {}

  const [prefix, pullsRaw = ''] = line.split(':');
  game.id = Number(prefix.split(' ')[1]);

  game.pulls = pullsRaw.split(';').map((pull) => {
    let colors = pull.split(',');
    colors = colors.map((color) => {
      const [number, text] = color.trim().split(' ');
      return [text, Number(number)];
    })
    return Object.fromEntries(colors);
  })
  
  return game;
})

// Part One

const maxCubes = { red: 12, green: 13, blue: 14 };

const possibleGames = games.filter((game) => {
  return game.pulls.every(pull => {
      return Object.keys(maxCubes).every((color) => {
        return pull[color] ? pull[color] <= maxCubes[color] : true;
      })
  });
})

const sumOfIds = possibleGames.reduce((total, curr) => {
  total += curr.id;
  return total;
}, 0)

console.log(sumOfIds);

// Part Two
const possibleColors = ['red', 'green', 'blue'];

const minCubesPerGame = games.map((game) => {
  return possibleColors.map((color) => {
    return game.pulls.reduce((minCubesNeeded, pull) => {
      pull[color] && pull[color] > minCubesNeeded ? minCubesNeeded = pull[color] : null;
      return minCubesNeeded;
    }, 0)
  })
})

const sumOfPower = minCubesPerGame.reduce((total, game) => {
  total += game.reduce((prev, curr) => {
    return prev * curr;
  });
  return total;
}, 0)

console.log(sumOfPower);
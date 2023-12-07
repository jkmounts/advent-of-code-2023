// https://adventofcode.com/2023/day/1
// https://adventofcode.com/2023/day/1/input

const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');

const lines = input.split(/\r?\n/);

let total = 0;

const spelledNumbers = [
  'one','two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'
]

const convertStringToNumber = (string) => {
  return Number(string) ? Number(string) : spelledNumbers.findIndex((spelledNumber) => spelledNumber === string) + 1
}

lines.forEach((line) => {
  const matches = Array.from(line.matchAll(new RegExp(`(?=([0-9]|${spelledNumbers.join('|')}))`, 'g'))).map((match) => match[1]);
  firstNumber = convertStringToNumber(matches[0]);
  lastNumber = convertStringToNumber(matches.at(-1));
  lineCalibration = `${firstNumber}${lastNumber}`;
  total += Number(lineCalibration);
})

return total;
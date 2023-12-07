const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');

const lines = input.split(/\r?\n/);

// Set-Up

class SchematicNumber {
  constructor(lineNumber, startingColumn) {
    this.lineNumber = lineNumber;
    this.startingColumn = startingColumn;
    this.valueAsString = '';

    const firstDigit = lines[lineNumber][startingColumn];
    let currentCharacter = firstDigit;

    while (!isNaN(currentCharacter)) {
      this.valueAsString += currentCharacter;
      const increment = this.valueAsString.length;
      currentCharacter = lines[lineNumber][startingColumn + increment]
    }
  }
  get value() {
    return Number(this.valueAsString);
  }
  get length() {
    return this.valueAsString.length;
  }
  get line() {
    return lines[this.lineNumber];
  }
  get endingColumn() {
    return this.startingColumn + this.length - 1;
  }
  get adjacentBoxCoordinates() {
    const boxStartingColumn = this.startingColumn > 0 ? this.startingColumn - 1 : 0;
    const boxStartingRow = this.lineNumber > 0 ? this.lineNumber - 1 : 0;
    const boxEndingColumn = this.endingColumn < this.line.length ? this.endingColumn + 1 : this.endingColumn;
    const boxEndingRow = this.lineNumber < lines.length -1 ? this. lineNumber + 1 : this.lineNumber;
    return { boxStartingColumn, boxStartingRow, boxEndingColumn, boxEndingRow };
  }
  get adjacentValues() {
    const adjacentValues = [];
    // Number before
    if (this.startingColumn > 0) {
      adjacentValues.push(this.line[this.startingColumn - 1])
    }
    // Number After
    if (this.endingColumn < (this.line.length - 1)) {
      adjacentValues.push(this.line[this.endingColumn + 1])
    }
    // Line ABove
    if (this.lineNumber > 0) {
      adjacentValues.push(
        ...lines[this.lineNumber - 1].slice(this.adjacentBoxCoordinates.boxStartingColumn, this.adjacentBoxCoordinates.boxEndingColumn + 1)
      )
    }
    // Line After
    if (this.lineNumber < this.adjacentBoxCoordinates.boxEndingRow) {
      adjacentValues.push(
        ...lines[this.lineNumber + 1].slice(this.adjacentBoxCoordinates.boxStartingColumn, this.adjacentBoxCoordinates.boxEndingColumn + 1)
      )
    }
  return adjacentValues;
  }
  get isPartNumber() {
    return this.adjacentValues.some(value => value !== '.' && isNaN(value));
  }
}

class PossibleGear {
  constructor(lineNumber, columnPosition) {
    this.lineNumber = lineNumber;
    this.columnPosition = columnPosition;
  }
  get line() {
    return lines[this.lineNumber]
  }
  get isOnFirstLine() {
    return this.lineNumber === 0;
  }
  get isOnLastLine() {
    return this.lineNumber === lines.length - 1;
  }
  get isInFirstColumn() {
    return this.columnPosition === 0;
  }
  get isInLastColumn() {
    return this.columnPosition === this.line.length - 1;
  }

  get adjacentPartNumbers() {
    const adjacentPartNumbers = [];

    function getPartNumberAtPosition(column, line) {
      return partNumbers.find((partNumber) => {
        return (
          partNumber.lineNumber === line &&
          column >= partNumber.startingColumn && 
          column <= partNumber.endingColumn
        );
      })
    }
    // Check Characters Before
    if (!this.isInFirstColumn) {
      const partNumber = getPartNumberAtPosition(this.columnPosition - 1, this.lineNumber);
      partNumber ? adjacentPartNumbers.push(partNumber) : null;
    }
    // Check  Characters After
    if(!this.isInLastColumn) {
      const partNumber = getPartNumberAtPosition(this.columnPosition + 1, this.lineNumber);
      partNumber ? adjacentPartNumbers.push(partNumber) : null;
    }
    // Check Line Before
    if(!this.isOnFirstLine) {
      const set = new Set();
      const position1 = getPartNumberAtPosition(this.columnPosition -1, this.lineNumber - 1)
      position1 ? set.add(position1) : null;
      const position2 = getPartNumberAtPosition(this.columnPosition, this.lineNumber - 1)
      position2 ? set.add(position2) : null;
      const position3 = getPartNumberAtPosition(this.columnPosition + 1, this.lineNumber - 1)
      position3 ? set.add(position3) : null;

      adjacentPartNumbers.push(...set);
    }

    // Check Line After
    if(!this.isOnLastLine) {
      const set = new Set();
      const position1 = getPartNumberAtPosition(this.columnPosition - 1, this.lineNumber + 1)
      position1 ? set.add(position1) : null;
      const position2 = getPartNumberAtPosition(this.columnPosition, this.lineNumber + 1)
      position2 ? set.add(position2) : null;
      const position3 = getPartNumberAtPosition(this.columnPosition + 1, this.lineNumber + 1)
      position3 ? set.add(position3) : null;

      adjacentPartNumbers.push(...set);
    }
    return adjacentPartNumbers;
  }

  get isGear() {
    return this.adjacentPartNumbers.length >= 2;
  }

  get gearRatio() {
    if (this.isGear) {
      const total = this.adjacentPartNumbers.reduce((total, partNumber, index) => {
        if (index === 0) {
          total += partNumber.value;
        } else {
          total *= partNumber.value;
        }
        return total;
      }, 0)
      return total;
    }
  }
}

function* getNumbersAndPossibleGears(lines) {
  let lineNumber = 0;
  let columnPosition = 0;
  while(lineNumber < lines.length) {
    const line = lines[lineNumber];
    while (columnPosition < line.length) {
      if (!isNaN(line[columnPosition])) {
        const schematicNumber = new SchematicNumber(lineNumber, columnPosition);
        yield schematicNumber;
        columnPosition += schematicNumber.length;
      } else if (line[columnPosition] === '*') {
        const possibleGear = new PossibleGear(lineNumber, columnPosition);
        columnPosition++
        yield possibleGear;
      } else {
        columnPosition++;
      }
    }
    lineNumber++;
    columnPosition = 0;
  }
}

const numbersAndPossibleGears = Array.from(getNumbersAndPossibleGears(lines));

const partNumbers = numbersAndPossibleGears.filter((item) => item.isPartNumber);
const gears = numbersAndPossibleGears.filter((item) => item.isGear);

// Part 1

const total = partNumbers.reduce((total, currentPartNumber) => {
  total += currentPartNumber.value;
  return total;
}, 0)

console.log('Part 1 - Sum of all part numbers:', total);

// Part 2

const gearRatioTotal = gears.reduce((total, gear) => {
  total += gear.gearRatio
  return total;
}, 0)

console.log('Part 2 - Sum of all gear ratios:', gearRatioTotal);

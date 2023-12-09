const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, 'example-input.txt'), 'utf-8');

// Create Seeds and Map Values

function mapLocations(startingValue, reverse = false) {
  const locations = {};
  let nextValue = startingValue;
  const sections = reverse ? Object.keys(almanac).reverse() : Object.keys(almanac);
  const rangeToUse = reverse ? 'destination' : 'source';
  const targetRange = reverse ? 'source' : 'destination';
  for (almanacSection of sections) {
    const [ source, destination ] = reverse ? almanacSection.split('-to-').reverse() : almanacSection.split('-to-');
    const range = almanac[almanacSection].find((range) => {
      return range[`${rangeToUse}Start`] <= nextValue && range[`${rangeToUse}End`] >= nextValue;
    });
    if (range) {
      locations[destination] = range[`${targetRange}Start`] + (nextValue - range[`${rangeToUse}Start`]);
    } else {
      locations[destination] = nextValue;
    }
    nextValue = locations[destination];
  }
  return locations;
}

class Seed {
  constructor(seedNumber) {
    this.seedNumber = seedNumber;
    Object.assign(this, mapLocations(seedNumber));
  }
}

const almanac = input.split(/[\n]{2}/)
  .reduce((almanacObject, section, index) => {
    const [sectionName, values] = section.split(':');
      switch (index) {
        case 0:
          almanacObject[sectionName.trim()] = 
            values.trim().split(/\s+/)
              .map((value) => Number(value.trim()));
          break;
        default:
          almanacObject[sectionName.split('map')[0].trim()] = 
            values.trim().split(/\n/).map((value) => {
              const [destinationStart, sourceStart, range] = value.split(/\s+/).map(Number);
              return { 
                destinationStart,
                destinationEnd: destinationStart + range,
                sourceStart,
                sourceEnd: sourceStart + range - 1,
                range };
            })
          break;
      }
    return almanacObject;
  }, {});

let givenSeedNumbers = almanac.seeds;
delete almanac.seeds;

// Part One

const seeds = givenSeedNumbers.map(seed => new Seed(seed));

console.log('Part 1 - Lowest Location Number:', Math.min(...seeds.map((seed) => seed.location)));

// Part Two


class Range {
  constructor(type, range) {
    this.type = type;
    this.start = range.start;
    this.end = (range.start + range.length) - 1;
    this.length = range.length;
  }

  convertTo(desiredType) {
    let processedValues = 0;
    const allValuesProcessed = () => processedValues === this.length;
    const numberOfValuesRemaining = () => this.length - processedValues;
    const ranges = [];

    while(!allValuesProcessed()) {
      const almanacEntry = almanac['seed-to-soil'].find((entry) => {
        return entry.sourceStart <= (this.start + processedValues + 1) && entry.sourceEnd >= (this.start + processedValues + 1);
      });
      if (almanacEntry) {
        const remainingEntries = almanacEntry.sourceEnd - (this.start + processedValues);
        const newRangeLength = remainingEntries >= this.length ? this.length : remainingEntries;
        ranges.push(new Range('soil', { start: almanacEntry.destinationStart + processedValues, length: newRangeLength }));
        processedValues += newRangeLength;
      } else {
        ranges.push(new Range('soil', { start: this.start + processedValues, length: 1 }))
        processedValues++;
      }
    }
    return ranges;
  }
}

const seedRanges = []

for (let index = 0; index < givenSeedNumbers.length; index += 2) {
  const [start, length] = [givenSeedNumbers[index], givenSeedNumbers[index+1]]
  seedRanges.push(new Range('seed', { start, length }));
}

console.log(seedRanges);

console.log(seedRanges[0].convertTo());
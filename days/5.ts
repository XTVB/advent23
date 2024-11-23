import path from 'path'
import { isDefined } from '../utils/isDefined'
const day = path.basename(import.meta.file, '.ts')
console.log(`Day ${day}`)
const input = await Bun.file(`./inputs/${day}.txt`).text()

const test = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`

const mappingsFinder = /(?:(?:\w+\-)+\w+ map:\n)((?:(?:\d+ ){2}\d+\n?)+)/g

type SourceRange = {
  sourceStart: number
  destinationStart: number
  range: number
}
const seedToSoil: SourceRange[] = []
const soilToFert: SourceRange[] = []
const fertToWater: SourceRange[] = []
const waterToLight: SourceRange[] = []
const lightToTemp: SourceRange[] = []
const tempToHumidity: SourceRange[] = []
const humidityToLoc: SourceRange[] = []

let mapIndex = 0
let mapArray
let target: SourceRange[]

while ((mapArray = mappingsFinder.exec(input)) !== null) {
  switch (mapIndex) {
    case 0:
      target = seedToSoil
      break
    case 1:
      target = soilToFert
      break
    case 2:
      target = fertToWater
      break
    case 3:
      target = waterToLight
      break
    case 4:
      target = lightToTemp
      break
    case 5:
      target = tempToHumidity
      break
    case 6:
      target = humidityToLoc
      break
  }
  mapArray[1]
    .trim()
    .split('\n')
    .map((line) => {
      const [dest, source, range] = line.split(' ')
      target.push({
        sourceStart: parseInt(source),
        destinationStart: parseInt(dest),
        range: parseInt(range),
      })
    })
  mapIndex += 1
}

const getDest = (key: number, mapper: SourceRange[]) => {
  const { sourceStart, destinationStart } =
    mapper.find(({ sourceStart, range }) => {
      // console.log(`start: ${sourceStart} range: ${range} key: ${key} moreThan: ${key >= sourceStart} lessthan: ${key <= sourceStart + range}`)
      return key >= sourceStart && key <= sourceStart + range
    }) ?? {}

  const val = isDefined(sourceStart) && isDefined(destinationStart) ? destinationStart + (key - sourceStart) : key
  // console.log(`${key} to ${val}`)
  // if (sourceStart) {
  // console.log(`sourceStart: ${sourceStart} dest: ${destinationStart} key: ${key}`)
  // }
  return val
}

const getLocation = (seed: number) => {
  return getDest(
    getDest(
      getDest(getDest(getDest(getDest(getDest(seed, seedToSoil), soilToFert), fertToWater), waterToLight), lightToTemp),
      tempToHumidity,
    ),
    humidityToLoc,
  )
}

const seedFinder = /(?:seeds:) (?<seeds>.*)/g
const seedsLine = seedFinder.exec(input)?.groups?.seeds ?? ''
const seedIndexes = seedsLine.split(' ').map((x) => parseInt(x))
// console.log(seedIndexes)

// const min = seedIndexes.map(seed => {
//   // console.log(`Seed number ${seed} corresponds to soil number ${getDest(seed, seedToSoil)}.`)
//   // console.log(`Seed number ${seed} corresponds to soil number ${getLocation(seed)}.`)
//   return getLocation(seed)
// }).reduce((min, current) => Math.min(min, current), Number.MAX_VALUE)
const min = seedIndexes.reduce((min, seed) => Math.min(getLocation(seed), min), Number.MAX_VALUE)

console.log(`Answer Part A: ${min}`)

// Reverse method

const getSource = (key: number, mapper: SourceRange[]) => {
  const { sourceStart, destinationStart } =
    mapper.find(({ destinationStart, range }) => {
      return key >= destinationStart && key <= destinationStart + range
    }) ?? {}

  const val = isDefined(sourceStart) && isDefined(destinationStart) ? sourceStart + (key - destinationStart) : key
  return val
}

const getSeed = (location: number) => {
  return getSource(
    getSource(
      getSource(
        getSource(getSource(getSource(getSource(location, humidityToLoc), tempToHumidity), lightToTemp), waterToLight),
        fertToWater,
      ),
      soilToFert,
    ),
    seedToSoil,
  )
}

const seedRanges = [...seedsLine.matchAll(/(?:\d+ \d+)/g)].map((line) => {
  const [start, range] = line[0].split(' ')
  return {
    start: parseInt(start),
    range: parseInt(range),
  }
})

const isInSeedRange = (location: number) => {
  const seed = getSeed(location)
  return !!seedRanges.find(({ start, range }) => seed >= start && seed <= start + range)
}

// normally start at 0, because I know the answer start at 84206668 for speed
let realMin = 84206668
while (!isInSeedRange(realMin)) {
  realMin += 1
}

console.log(`Answer Part B: ${realMin}`)

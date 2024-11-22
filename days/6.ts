import path from "path";
const day = path.basename(import.meta.file, ".ts");
console.log(`Day ${day}`);
const input = await Bun.file(`./inputs/${day}.txt`).text();

const inputT = `Time:      7  15   30
Distance:  9  40  200`

// map input

type RaceConstraint = {
    time: number
    distance: number
}

const [timeStr, distanceStr] = input.split('\n')
const times = [...timeStr.matchAll(/\d+/g)].map(val=>parseInt(val[0]))
const distances = [...distanceStr.matchAll(/\d+/g)].map(val=>parseInt(val[0]))
const races: RaceConstraint[] = times.reduce((races, time, index) => ([
    ...races,
    {
        time,
        distance: distances[index]
    }
]), [] as RaceConstraint[])

// console.log(races)

// functions needed for calc

const wouldTravel = (buttonPress: number, maxTime: number): number => 
    (maxTime - buttonPress) * buttonPress
const wouldBeat = (buttonPress: number, maxTime: number, prevRecord: number): boolean => 
    wouldTravel(buttonPress, maxTime) > prevRecord

const waysToWin = ({time, distance}: RaceConstraint) => 
    Array.from({length: time}, (_, i) => i).reduce(
        (wins, charge) => wouldBeat(charge, time, distance) 
            ? wins+1 
            : wins, 
        0)

const marginOfError = races.reduce((margin, race)=> margin * waysToWin(race), 1)

console.log(`Answer Part A: ${marginOfError}`)

// Dumb brute force method

const bigRace: RaceConstraint = {
    time: parseInt(times.join('')),
    distance: parseInt(distances.join(''))
}

const bigMargin = waysToWin(bigRace)

// there's a mathsy solution but the bruteforce is very fast so ¯\_(ツ)_/¯

console.log(`Answer Part B: ${bigMargin}`);

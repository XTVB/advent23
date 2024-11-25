import path from 'path'
import { isDefined } from '../utils/isDefined'
import { Point } from '../utils/matrix'
const day = path.basename(import.meta.file, '.ts')
console.log(`Day ${day}`)
const input = await Bun.file(`./inputs/${day}.txt`).text()

const inputT = `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`

type Map = {
  rows: string[]
  cols: string[]
}

const parseMap = (input: string): Map => {
  const rows = input.split('\n')
  const cols = []
  for (let i = 0; i < rows[0].length; i++) {
    const col = rows.map((row) => row[i]).join('')
    cols.push(col)
  }
  return { rows, cols }
}

const visualise = (map: Map): void => {
  console.log(map.rows.join('\n'))
  console.log('\n')
}

const maps = input.split('\n\n').map(parseMap)

const checkBothSides = (line: string[], i: number): boolean => {
  for (let j = 1; j < i + 1; j++) {
    const left = line[i - j]
    const right = line[i + 1 + j]
    if (!isDefined(right)) {
      return true
    }
    if (left !== right) {
      return false
    }
  }
  return true
}

const findSymmetry = (line: string[], ignoreIndex: number = -1): number => {
  //   console.log(`Ignore Index: ${ignoreIndex}`)
  for (let i = 0; i < line.length; i++) {
    if (i === ignoreIndex) {
      continue
    }
    if (line[i] === line[i + 1]) {
      if (checkBothSides(line, i)) {
        return i
      }
    }
  }
  return -1
}

const summary = (map: Map, ignoreSum: number = 0): number => {
  const columnSymmetry = findSymmetry(map.cols, ignoreSum % 100 == 0 ? undefined : ignoreSum - 1)
  //   console.log(`Column Symmetry: ${columnSymmetry}`)
  if (columnSymmetry >= 0) {
    return columnSymmetry + 1
  }
  const rowSymmetry = findSymmetry(map.rows, ignoreSum % 100 == 0 ? ignoreSum / 100 - 1 : undefined)
  //   console.log(`Row Symmetry: ${rowSymmetry}`)
  return (rowSymmetry + 1) * 100
}

const summarise = (maps: Map[]): number => maps.reduce((acc, map) => acc + summary(map), 0)

const sumA = summarise(maps)

// console.log(maps.map((map) => summary(map)))
// console.log(maps[0])
// visualise(maps[0])
// console.log(summary(maps[0]))
console.log(`Answer Part A: ${sumA}`)

// find biggest square
// const biggestSquare = maps.reduce((max, map) => {
//   return Math.max(max, map.rows.length * map.cols.length)
// }, 0)

// console.log(`Biggest Square: ${biggestSquare}`)

// const findSmudge = (map: Map): Point => {
//   const original = summary(map)
//   for (let i = 0; i < map.rows.length; i++) {
//     for (let j = 0; j < map.cols.length; j++) {
//       const val = map.rows[i][j]
//       const newVal = val === '.' ? '#' : '.'
//       const newMap = structuredClone(map)
//       newMap.rows[i] = map.rows[i].slice(0, j) + newVal + map.rows[i].slice(j + 1)
//       newMap.cols[j] = map.cols[j].slice(0, i) + newVal + map.cols[j].slice(i + 1)
//       const newSum = summary(newMap, original)
//       if (newSum > 0 && original !== newSum) {
//         // visualise(newMap)
//         // console.log(`Original: ${original} New: ${newSum}`)
//         return [j, i]
//       }
//     }
//   }
//   return [-1, -1]
// }
const findDeSmudgedSummary = (map: Map): number => {
  const original = summary(map)
  for (let i = 0; i < map.rows.length; i++) {
    for (let j = 0; j < map.cols.length; j++) {
      const val = map.rows[i][j]
      const newVal = val === '.' ? '#' : '.'
      const newMap = structuredClone(map)
      newMap.rows[i] = map.rows[i].slice(0, j) + newVal + map.rows[i].slice(j + 1)
      newMap.cols[j] = map.cols[j].slice(0, i) + newVal + map.cols[j].slice(i + 1)
      const newSum = summary(newMap, original)
      if (newSum > 0 && original !== newSum) {
        return newSum
      }
    }
  }
  return 0
}

// visualise(maps[1])
// console.log(findSmudge(maps[1]))
// console.log(maps.map(findDeSmudgedSummary))

const deSmudgedSummarise = (maps: Map[]): number => maps.reduce((acc, map) => acc + findDeSmudgedSummary(map), 0)

const totalB = deSmudgedSummarise(maps)

console.log(`Answer Part B: ${totalB}`)

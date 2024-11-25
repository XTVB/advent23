import path from 'path'
import { compareMatrixes, displayMatrix, parseMatrix, printMatrix } from '../utils/matrix'
const day = path.basename(import.meta.file, '.ts')
console.log(`Day ${day}`)
const input = await Bun.file(`./inputs/${day}.txt`).text()

const inputT = `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`

const matrix = parseMatrix(input)

// original implementation
// const fallNorth = (original: string[][]): string[][] => {
//   const matrix = structuredClone(original)
//   for (let i = 1; i < matrix.length; i++) {
//     for (let j = 0; j < matrix[0].length; j++) {
//       if (matrix[i][j] === 'O') {
//         for (let k = i - 1; k >= 0; k--) {
//           if (k === 0 && matrix[k][j] === '.') {
//             matrix[i][j] = '.'
//             matrix[k][j] = 'O'
//             break
//           }
//           if (['O', '#'].includes(matrix[k][j])) {
//             matrix[i][j] = '.'
//             matrix[k + 1][j] = 'O'
//             break
//           }
//         }
//       }
//     }
//   }
//   return matrix
// }
// improved implementation ~ 2x faster
const fallNorth = (original: string[][]): string[][] => {
  // faster not to clone the matrix
  // const matrix = structuredClone(original)
  const matrix = original
  for (let x = 0; x < matrix[0].length; x++) {
    let indexStart = 0
    let rockCount = 0
    for (let y = indexStart; y < matrix.length; y++) {
      let val = matrix[y][x]
      if (val === 'O') {
        rockCount++
      }
      if (val === '#' || y === matrix.length - 1) {
        let z = indexStart
        while (rockCount > 0) {
          matrix[z][x] = 'O'
          rockCount--
          z++
        }
        const reachedEnd = z > y
        while (z < y) {
          matrix[z][x] = '.'
          z++
        }
        if (val !== '#' && !reachedEnd) {
          matrix[y][x] = '.'
        }
        indexStart = y + 1
      }
    }
  }
  return matrix
}

const northLoad = (matrix: string[][]) => {
  const max = matrix.length
  const loads = matrix.map((row, index) => {
    const os = row.filter((cell) => cell === 'O').length
    // console.log(row, os)
    return os * (max - index)
  })
  //   console.log(loads)
  return loads.reduce((acc, curr) => acc + curr, 0)
}

// const a = performance.now()
const northMatrix = fallNorth(structuredClone(matrix))
// const timeTaken = performance.now() - a
// console.log(`Time: ${timeTaken}ms`)
// console.log(`Estimate: ${(timeTaken * 1000000) / 60 / 60}h`)

const loadA = northLoad(northMatrix)

console.log(`Answer Part A: ${loadA}`)

// printMatrix(northMatrix)
// console.log(
//   displayMatrix(northMatrix) ===
//     `OOOO.#.O..
// OO..#....#
// OO..O##..O
// O..#.OO...
// ........#.
// ..#....#.#
// ..O..#.O.O
// ..O.......
// #....###..
// #....#....`
// )

// detect when the cycles start looping, modulo the remaining cycle length in order to not have to calculate 10**9 cycles

const falWest = (original: string[][]): string[][] => {
  const matrix = original
  for (let y = 0; y < matrix.length; y++) {
    let indexStart = 0
    let rockCount = 0
    for (let x = indexStart; x < matrix[0].length; x++) {
      let val = matrix[y][x]
      if (val === 'O') {
        rockCount++
      }
      if (val === '#' || x === matrix[0].length - 1) {
        let z = indexStart
        while (rockCount > 0) {
          matrix[y][z] = 'O'
          rockCount--
          z++
        }
        const reachedEnd = z > x
        while (z < x) {
          matrix[y][z] = '.'
          z++
        }
        if (val !== '#' && !reachedEnd) {
          matrix[y][x] = '.'
        }
        indexStart = x + 1
      }
    }
  }
  return matrix
}
const fallSouth = (original: string[][]): string[][] => {
  const matrix = original
  for (let x = 0; x < matrix[0].length; x++) {
    let indexStart = matrix.length - 1
    let rockCount = 0
    for (let y = indexStart; y >= 0; y--) {
      let val = matrix[y][x]
      if (val === 'O') {
        rockCount++
      }
      if (val === '#' || y === 0) {
        let z = indexStart
        while (rockCount > 0) {
          matrix[z][x] = 'O'
          rockCount--
          z--
        }
        const reachedEnd = z < y
        while (z > y) {
          matrix[z][x] = '.'
          z--
        }
        if (val !== '#' && !reachedEnd) {
          matrix[y][x] = '.'
        }
        indexStart = y - 1
      }
    }
  }
  return matrix
}

const fallEast = (original: string[][]): string[][] => {
  const matrix = original
  for (let y = 0; y < matrix.length; y++) {
    let indexStart = matrix[0].length - 1
    let rockCount = 0
    for (let x = indexStart; x >= 0; x--) {
      let val = matrix[y][x]
      if (val === 'O') {
        rockCount++
      }
      if (val === '#' || x === 0) {
        let z = indexStart
        while (rockCount > 0) {
          matrix[y][z] = 'O'
          rockCount--
          z--
        }
        const reachedEnd = z < x
        while (z > x) {
          matrix[y][z] = '.'
          z--
        }
        if (val !== '#' && !reachedEnd) {
          matrix[y][x] = '.'
        }
        indexStart = x - 1
      }
    }
  }
  return matrix
}

const cycle = (matrix: string[][], debug = false) => {
  if (debug) {
    printMatrix(matrix)
    console.log('\n ---------------> \n')
  }
  const north = fallNorth(matrix)
  if (debug) {
    printMatrix(north)
    console.log('\n ---------------> \n')
  }
  const west = falWest(north)
  if (debug) {
    printMatrix(west)
    console.log('\n ---------------> \n')
  }
  const south = fallSouth(west)
  if (debug) {
    printMatrix(south)
    console.log('\n ---------------> \n')
  }
  const east = fallEast(south)
  if (debug) {
    printMatrix(east)
    console.log('\n ---------------> \n')
  }
  return east
}

const cycleMap = new Map()
const indexResults = []
let cycles = 1000000000
let loop
while ((loop = cycleMap.get(displayMatrix(matrix))) === undefined) {
  cycleMap.set(displayMatrix(matrix), {
    index: cycleMap.size,
    cycle: cycle(matrix),
  })
  indexResults.push(structuredClone(matrix))
  cycles--
}

const loopedCycles = indexResults.slice(loop.index)
const index = (cycles % loopedCycles.length) - 1
const postCyclesLoad = northLoad(loopedCycles[index])

// console.log(
//   displayMatrix(indexResults[0]) ===
//     `.....#....
// ....#...O#
// ...OO##...
// .OO#......
// .....OOO#.
// .O#...O#.#
// ....O#....
// ......OOOO
// #...O###..
// #..OO#....`
// )
// console.log(
//   displayMatrix(indexResults[1]) ===
//     `.....#....
// ....#...O#
// .....##...
// ..O#......
// .....OOO#.
// .O#...O#.#
// ....O#...O
// .......OOO
// #..OO###..
// #.OOO#...O`
// )
// console.log(
//   displayMatrix(indexResults[2]) ===
//     `.....#....
// ....#...O#
// .....##...
// ..O#......
// .....OOO#.
// .O#...O#.#
// ....O#...O
// .......OOO
// #...O###.O
// #.OOO#...O`
// )

console.log(`Answer Part B: ${postCyclesLoad}`)

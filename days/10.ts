import path from "path"
const day = path.basename(import.meta.file, ".ts")
console.log(`Day ${day}`)
const input = await Bun.file(`./inputs/${day}.txt`).text()

const inputA = `..F7.
.FJ|.
SJ.L7
|F--J
LJ...`

const inputB = `..........
.S------7.
.|F----7|.
.||OOOO||.
.||OOOO||.
.|L-7F-J|.
.|II||II|.
.L--JL--J.
..........`

const inputC = `.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...`

const inputD = `FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`

const matrix = input.split("\n").map((row) => row.split(""))
// console.log(matrix)

enum Tile {
  Vertical = "|",
  Horizontal = "-",
  BendNE = "L",
  BendNW = "J",
  BendSW = "7",
  BendSE = "F",
  Ground = ".",
  Start = "S",
}

const tileToString = (tile: Tile | string): string => {
  switch (tile) {
    case Tile.Vertical:
    case "|":
      return "Vertical"
    case Tile.Horizontal:
    case "-":
      return "Horizontal"
    case Tile.BendNE:
    case "L":
      return "BendNE"
    case Tile.BendNW:
    case "J":
      return "BendNW"
    case Tile.BendSW:
    case "7":
      return "BendSW"
    case Tile.BendSE:
    case "F":
      return "BendSE"
    case Tile.Ground:
    case ".":
      return "Ground"
    case Tile.Start:
    case "S":
      return "Start"
    default:
      throw new Error(`Unknown tile: ${tile}`)
  }
}

type Point = [number, number]

const findStart = (matrix: string[][]): Point => {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] === Tile.Start) {
        return [x, y]
      }
    }
  }
  return [-1, -1]
}

const start = findStart(matrix)
// console.log(start)

const findStartDirection = (matrix: string[][], start: Point): string => {
  let [x, y] = start
  const right = matrix[y]?.[x + 1]
  const left = matrix[y]?.[x - 1]
  const down = matrix[y + 1]?.[x]
  const up = matrix[y - 1]?.[x]
  // console.log(`Start: ${x},${y} ${stringToTile(right)} ${stringToTile(left)} ${stringToTile(down)} ${stringToTile(up)}`)
  if (right === Tile.Horizontal || right === Tile.BendNW || right === Tile.BendSW) {
    return "right"
  }
  if (left === Tile.Horizontal || left === Tile.BendNE || left === Tile.BendSE) {
    return "left"
  }
  if (down === Tile.Vertical || down === Tile.BendSE || down === Tile.BendSW) {
    return "down"
  }
  if (up === Tile.Vertical || up === Tile.BendNE || up === Tile.BendNW) {
    return "up"
  }
  return ""
}

const makeBlack = (message: string) => {
  return `\x1b[30m${message}\x1b[0m`
}
const makeRed = (message: string) => {
  return `\x1b[31m${message}\x1b[0m`
}
const makeBlue = (message: string) => {
  return `\x1b[34m${message}\x1b[0m`
}
const makeGreen = (message: string) => {
  return `\x1b[32m${message}\x1b[0m`
}
const makeYellow = (message: string) => {
  return `\x1b[33m${message}\x1b[0m`
}
const makePurple = (message: string) => {
  return `\x1b[35m${message}\x1b[0m`
}

const logRed = (message: string) => {
  console.log(makeRed(message))
}

const traverse = (matrix: string[][], start: Point): number[][] => {
  let [x, y] = start
  let direction = findStartDirection(matrix, start)
  let path = [[x + 1, y + 1]]
  //   let path = 'S'
  if (direction === "right") {
    x++
  }
  if (direction === "left") {
    x--
  }
  if (direction === "down") {
    y++
  }
  if (direction === "up") {
    y--
  }
  const makeMove = () => {
    switch (matrix[y][x]) {
      case Tile.Vertical:
        // console.log(`Vertical: ${x},${y} ${direction}`)
        matrix[y][x] = makeBlue(matrix[y][x])
        if (direction === "down") {
          y++
        } else {
          y--
        }
        break
      case Tile.Horizontal:
        // console.log(`Horizontal: ${x},${y} ${direction}`)
        matrix[y][x] = makeBlue(matrix[y][x])
        if (direction === "right") {
          x++
        } else {
          x--
        }
        break
      case Tile.BendNE:
        // console.log(`BendNE: ${x},${y} ${direction}`)
        matrix[y][x] = makeRed(matrix[y][x])
        if (direction === "down") {
          x++
          direction = "right"
        } else {
          y--
          direction = "up"
        }
        break
      case Tile.BendNW:
        // console.log(`BendNW: ${x},${y} ${direction}`)
        matrix[y][x] = makePurple(matrix[y][x])
        if (direction === "down") {
          x--
          direction = "left"
        } else {
          y--
          direction = "up"
        }
        break
      case Tile.BendSW:
        // console.log(`BendSW: ${x},${y} ${direction}`)
        matrix[y][x] = makeGreen(matrix[y][x])
        if (direction === "up") {
          x--
          direction = "left"
        } else {
          y++
          direction = "down"
        }
        break
      case Tile.BendSE:
        // console.log(`BendSE: ${x},${y} ${direction}`)
        matrix[y][x] = makeYellow(matrix[y][x])
        if (direction === "up") {
          x++
          direction = "right"
        } else {
          y++
          direction = "down"
        }
        break
    }
  }
  // console.log(`Start: ${x},${y} ${direction}`)
  while (true) {
    if (matrix[y][x] === Tile.Ground) {
      break
    }
    if (matrix[y][x] === Tile.Start) {
      matrix[y][x] = makeBlack(matrix[y][x])
      break
    }
    // path += matrix[y][x]
    path.push([x + 1, y + 1])
    makeMove()
  }
  return path
}

const route = traverse(matrix, start)

const furthest = Math.round(route.length / 2)
// console.log(matrix.map((row) => row.join("")).join("\n"))

console.log(`Answer Part A: ${furthest}`)

// console.log(route)

// calculate the area using shoe lace formula
const area = (route: number[][]): number => {
  let sum = 0

  for (let i = 0; i < route.length - 1; i++) {
    sum += route[i][0] * route[i + 1][1] - route[i + 1][0] * route[i][1]
  }
  sum += route[route.length - 1][0] * route[0][1] - route[0][0] * route[route.length - 1][1]
  return Math.abs(sum) / 2
}

// By pick's theorem the area of a polygon on a grid is given by A = i + b/2 - 1 where i is the number of interior points and b is the number of boundary points
const boundary = route.length
const totalArea = area(route)
const interior = Math.floor(totalArea - boundary / 2 + 1)

console.log(`Answer Part B: ${interior}`)

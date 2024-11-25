import path from 'path'
import { Point, displayMatrix, parseMatrix } from '../utils/matrix'
const day = path.basename(import.meta.file, '.ts')
console.log(`Day ${day}`)
const input = await Bun.file(`./inputs/${day}.txt`).text()

const inputT = `.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`

type Cell = '.' | '|' | '-' | '/' | '\\'

enum Direction {
  Up = '^',
  Down = 'v',
  Left = '<',
  Right = '>',
}

const matrix = parseMatrix<Cell>(input)

const updateTrackingMatrixes = (
  point: Point,
  direction: Direction,
  arrowMatrix: (Cell | Direction | string)[][],
  energyMatrix: ('#' | Cell)[][],
  entered: Map<string, boolean>
) => {
  const [x, y] = point
  if (x < 0 || y < 0 || x >= matrix[0].length || y >= matrix.length) {
    return false
  }
  const key = `${x},${y}${direction}`
  if (entered.has(key)) {
    return false
  }
  energyMatrix[y][x] = '#'
  entered.set(`${x},${y}${direction}`, true)
  const arrowVal = arrowMatrix[y][x]
  if (arrowVal === '.') {
    arrowMatrix[y][x] = direction
  } else if ([Direction.Left, Direction.Right, Direction.Up, Direction.Down].includes(arrowVal as Direction)) {
    arrowMatrix[y][x] = '2'
  } else if (!isNaN(parseInt(arrowVal))) {
    arrowMatrix[y][x] = `${parseInt(arrowVal) + 1}`
  }
  return true
}

const nextPosition = (position: Point, direction: Direction): Point => {
  switch (direction) {
    case Direction.Right:
      return [position[0] + 1, position[1]]
    case Direction.Left:
      return [position[0] - 1, position[1]]
    case Direction.Up:
      return [position[0], position[1] - 1]
    case Direction.Down:
      return [position[0], position[1] + 1]
  }
}

const nextDirection = (cell: Cell, direction: Direction): Direction[] => {
  switch (cell) {
    case '-':
      if (direction === Direction.Up || direction === Direction.Down) {
        return [Direction.Left, Direction.Right]
      } else {
        return [direction]
      }
    case '|':
      if (direction === Direction.Left || direction === Direction.Right) {
        return [Direction.Up, Direction.Down]
      } else {
        return [direction]
      }
    case '/':
      switch (direction) {
        case Direction.Right:
          return [Direction.Up]
        case Direction.Left:
          return [Direction.Down]
        case Direction.Up:
          return [Direction.Right]
        case Direction.Down:
          return [Direction.Left]
      }
    case '\\':
      switch (direction) {
        case Direction.Right:
          return [Direction.Down]
        case Direction.Left:
          return [Direction.Up]
        case Direction.Up:
          return [Direction.Left]
        case Direction.Down:
          return [Direction.Right]
      }
    case '.':
    default:
      return [direction]
  }
}

const move = (
  position: Point,
  direction: Direction,
  arrowMatrix: (Cell | Direction | string)[][],
  energyMatrix: ('#' | Cell)[][],
  entered: Map<string, boolean>
) => {
  //   console.log(position, direction)
  position = nextPosition(position, direction)
  //   console.log(position)
  if (updateTrackingMatrixes(position, direction, arrowMatrix, energyMatrix, entered)) {
    let directions = nextDirection(matrix[position[1]][position[0]], direction)
    directions.forEach((dir) => {
      //   console.log(dir)
      move(position, dir, arrowMatrix, energyMatrix, entered)
    })
  }
}

const energisedFromThisPath = (
  arrowMatrix: (Cell | Direction | string)[][],
  energyMatrix: ('#' | Cell)[][],
  entered: Map<string, boolean>,
  start: Point = [0, 0],
  startingDirection: Direction = Direction.Right
): number => {
  let position = start
  let directions = nextDirection(matrix[position[1]][position[0]], startingDirection)
  updateTrackingMatrixes(start, startingDirection, arrowMatrix, energyMatrix, entered)
  directions.forEach((dir) => {
    move(position, dir, arrowMatrix, energyMatrix, entered)
  })

  return energyMatrix.flat().filter((cell) => cell === '#').length
}

const arrowMatrix = parseMatrix<Cell | Direction | string>(input)
const energyMatrix = parseMatrix<'#' | Cell>(input)
const entered = new Map<string, boolean>()

const energised = energisedFromThisPath(arrowMatrix, energyMatrix, entered)
// console.log(displayMatrix(arrowMatrix))
// console.log('---')
// console.log(displayMatrix(energyMatrix))

console.log(`Answer Part A: ${energised}`)

const getStartingOptions = (matrix: Cell[][]) => {
  const options = []
  for (let i = 0; i < matrix[0].length; i++) {
    options.push([i, 0, Direction.Down])
    options.push([i, matrix.length - 1, Direction.Up])
  }
  for (let i = 0; i < matrix.length; i++) {
    options.push([i, 0, Direction.Right])
    options.push([i, matrix[0].length - 1, Direction.Left])
  }
  return options
}

const bestCharge = getStartingOptions(matrix).reduce((max, [x, y, direction]) => {
  const arrowMatrix = parseMatrix<Cell | Direction | string>(input)
  const energyMatrix = parseMatrix<'#' | Cell>(input)
  const entered = new Map<string, boolean>()
  const charge = energisedFromThisPath(
    arrowMatrix,
    energyMatrix,
    entered,
    [x as number, y as number],
    direction as Direction
  )
  return Math.max(max, charge)
}, 0)

console.log(`Answer Part B: ${bestCharge}`)

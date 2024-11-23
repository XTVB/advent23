import path from 'path'
import { Point, displayMatrix, parseMatrix, printMatrix } from '../utils/matrix'
const day = path.basename(import.meta.file, '.ts')
console.log(`Day ${day}`)
const input = await Bun.file(`./inputs/${day}.txt`).text()

const inputT = `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`

type GalaxyPoint = '.' | '#'

const matrixPartA = parseMatrix<GalaxyPoint>(input)

const getColumnsToExpand = (matrix: GalaxyPoint[][]): number[] => {
  const columnsToExpand: number[] = []
  for (let x = 0; x < matrix[0].length; x++) {
    for (let y = 0; y < matrix.length; y++) {
      if (matrix[y][x] === '#') {
        break
      }
      if (y === matrix.length - 1) {
        columnsToExpand.push(x)
      }
    }
  }
  return columnsToExpand
}

const expandColumns = (matrix: GalaxyPoint[][]): GalaxyPoint[][] => {
  getColumnsToExpand(matrix).map((x, index) => {
    matrix.map((row) => {
      row.splice(x + index, 0, '.')
    })
  })
  return matrix
}

const getRowsToExpand = (matrix: GalaxyPoint[][]): number[] => {
  const rowsToExpand: number[] = []
  matrix.map((row, y) => {
    if (row.every((point) => point === '.')) {
      rowsToExpand.push(y)
    }
  })
  return rowsToExpand
}

const expandRows = (matrix: GalaxyPoint[][]): GalaxyPoint[][] => {
  getRowsToExpand(matrix).map((y, index) => {
    matrix.splice(
      y + index,
      0,
      matrix[0].map(() => '.'),
    )
  })

  return matrix
}

const expand = (matrix: GalaxyPoint[][]): GalaxyPoint[][] => {
  return expandRows(expandColumns(matrix))
}

expand(matrixPartA)

const galaxyPositions = (matrix: GalaxyPoint[][]): Point[] => {
  const positions: Point[] = []
  matrix.map((row, y) => {
    row.map((point, x) => {
      if (point === '#') {
        positions.push([x, y])
      }
    })
  })
  return positions
}

const positions = galaxyPositions(matrixPartA)

// console.log(positions)

const minSteps = (from: Point, to: Point): number => {
  const [x1, y1] = from
  const [x2, y2] = to
  return Math.abs(x1 - x2) + Math.abs(y1 - y2)
}

let totalSteps = 0
let galaxy: Point | undefined
while ((galaxy = positions.pop()) !== undefined) {
  totalSteps += positions.reduce((total, position) => {
    const steps = galaxy ? minSteps(galaxy, position) : 0
    return total + steps
  }, 0)
}

console.log(`Answer Part A: ${totalSteps}`)

const matrixPartB = parseMatrix<GalaxyPoint>(input)

const positionsPartB = galaxyPositions(matrixPartB)

// could be used for part A also, just set expansion to 2 and don't manually expand the matrix
const minStepsPartB = (
  from: Point,
  to: Point,
  expandedColum: number[],
  expandededRows: number[],
  expansion: number,
): number => {
  const [x1, y1] = from
  const [x2, y2] = to
  const passedColumns = expandedColum.filter(
    (column) => (column > x1 && column < x2) || (column > x2 && column < x1),
  ).length
  const extraColumns = passedColumns > 0 ? passedColumns * (expansion - 1) : 0
  const passedRows = expandededRows.filter((row) => (row > y1 && row < y2) || (row > y2 && row < y1)).length
  const extraRows = passedRows > 0 ? passedRows * (expansion - 1) : 0
  //   console.log(
  //     `From: ${from}, To: ${to}, Expanded Columns: ${expandedColum}, Expanded Rows: ${expandededRows}
  //     Passed Columns: ${passedColumns}, Passed Rows: ${passedRows} extraColumns: ${extraColumns}, extraRows: ${extraRows}`
  //   )
  return Math.abs(x1 - x2) + Math.abs(y1 - y2) + extraColumns + extraRows
}

const expandedColumns = getColumnsToExpand(matrixPartB)
const expandedRows = getRowsToExpand(matrixPartB)
let totalStepsB = 0
let galaxyB: Point | undefined
while ((galaxyB = positionsPartB.pop()) !== undefined) {
  totalStepsB += positionsPartB.reduce((total, position) => {
    const steps = galaxyB ? minStepsPartB(galaxyB, position, expandedColumns, expandedRows, 1000000) : 0
    return total + steps
  }, 0)
}

// console.log(minStepsPartB(positionsPartB[4], positionsPartB[8], expandedColumns, expandedRows, 2))

console.log(`Answer Part B: ${totalStepsB}`)

// 2 -> 374
// 10 -> 1030
// 100 -> 8410

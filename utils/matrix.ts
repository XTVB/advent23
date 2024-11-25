type Point = [x: number, y: number]

const parseMatrix = <T>(matrix: string): T[][] => {
  return matrix.split('\n').map((row) => row.split('')) as T[][]
}

const displayMatrix = <T>(matrix: T[][]): string => {
  return matrix.map((row) => row.join('')).join('\n')
}

const printMatrix = <T>(matrix: T[][]): void => {
  console.log(matrix.map((row) => row.join('')).join('\n'))
}

export { Point, parseMatrix, displayMatrix, printMatrix }

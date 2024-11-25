type Point = [x: number, y: number]

const parseMatrix = <T = string>(matrix: string): T[][] => {
  return matrix.split('\n').map((row) => row.split('')) as T[][]
}

const displayMatrix = <T>(matrix: T[][]): string => {
  return matrix.map((row) => row.join('')).join('\n')
}

const compareMatrixes = <T>(matrix1: T[][], matrix2: T[][]): boolean => {
  if (matrix1.length !== matrix2.length) {
    return false
  }
  return displayMatrix(matrix1) === displayMatrix(matrix2)
}

const printMatrix = <T>(matrix: T[][]): void => {
  console.log(displayMatrix(matrix))
}

export { Point, parseMatrix, displayMatrix, compareMatrixes, printMatrix }

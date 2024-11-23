import path from "path"
const day = path.basename(import.meta.file, ".ts")
console.log(`Day ${day}`)
const lines = (await Bun.file(`./inputs/${day}.txt`).text()).split("\n")

// console.log(lines);

// const test = `467..114..
// ...*......
// ..35..633.
// ......#...
// 617*......
// .....+.58.
// ..592.....
// ......755.
// ...$.*....
// .664.598..`.split("\n");
const test = `.......5......
..7*..*.....4*
...*13*......9
.......15.....
..............
..............
..............
..............
..............
..............
21............
...*9.........`.split("\n")

// console.log(test);

type GearCoOrd = {
  gearX: number
  gearY: number
}

type NumberCoOrd = {
  startX: number
  endX: number
  y: number
}

// const matrix = test.map((text) => text.split(""));
const matrix = lines.map((text) => text.split(""))
const get = (y: number, x: number): string => {
  return matrix[y]?.[x]
}

const isPartNumber = ({ startX, endX, y }: NumberCoOrd): boolean => {
  const isSymbol = /[^\d.]/g
  for (let i = y - 1; i <= y + 1; i++) {
    for (let j = startX - 1; j <= endX + 1; j++) {
      if (i === y && j >= startX && j < endX) {
        continue
      }
      const val = get(i, j)
      //   console.log(`x: ${j} y: ${i} val: ${val}`);
      if (val && isSymbol.test(val)) {
        return true
      }
    }
  }

  return false
}

const toNumber = ({ startX, endX, y }: NumberCoOrd): number => {
  const collect: string[] = []
  for (let i = startX; i < endX + 1; i++) {
    collect.push(get(y, i))
  }
  return parseInt(collect.join(""))
}

const partNumbers: NumberCoOrd[] = []
for (let y = 0; y < matrix.length; y++) {
  // for (let y = 0; y < 1; y++) {

  const line = matrix[y]
  //   console.log(line);
  let index = 0
  while (index < line.length) {
    if (!Number.isNaN(parseInt(line[index]))) {
      let startX = index
      let endX = startX
      while (!Number.isNaN(parseInt(line[endX]))) {
        endX += 1
      }
      const testNumber: NumberCoOrd = {
        startX,
        endX: endX - 1,
        y,
      }
      if (isPartNumber(testNumber)) {
        partNumbers.push(testNumber)
      }

      index = endX + 1
    } else {
      index += 1
    }
  }
}

const totalA = partNumbers.map(toNumber).reduce((a, b) => a + b, 0)
console.log(`Answer Part A: ${totalA}`)

const getGearRatio = ({ gearX, gearY }: GearCoOrd): number => {
  const connectedParts = partNumbers.filter(({ startX, endX, y }) => {
    const correctY = y >= gearY - 1 && y <= gearY + 1
    const correctX =
      (gearX - 1 >= startX && gearX - 1 <= endX) ||
      (gearX >= startX && gearX <= endX) ||
      (gearX + 1 >= startX && gearX + 1 <= endX)
    return correctX && correctY
  })

  if (connectedParts.length === 2) {
    return connectedParts.reduce((a, b) => a * toNumber(b), 1)
  }

  return 0
}

const gearRatios = []
for (let y = 0; y < matrix.length; y++) {
  const line = matrix[y]
  for (let x = 0; x < line.length; x++) {
    if (line[x] === "*") {
      const testGear: GearCoOrd = {
        gearX: x,
        gearY: y,
      }
      const ratio = getGearRatio(testGear)
      if (ratio) {
        gearRatios.push(ratio)
      }
    }
  }
}

const totalB = gearRatios.reduce((a, b) => a + b, 0)
console.log(`Answer Part B: ${totalB}`)

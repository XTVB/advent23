import path from 'path'
const day = path.basename(import.meta.file, '.ts')
console.log(`Day ${day}`)
const input = await Bun.file(`./inputs/${day}.txt`).text()

const inputT = `19, 13, 30 @ -2,  1, -2
18, 19, 22 @ -1, -1, -2
20, 25, 34 @ -2, -2, -4
12, 31, 28 @ -1, -2, -1
20, 19, 15 @  1, -5, -3`

type Hailstone = {
  pos: [x: number, y: number, z: number]
  vel: [x: number, y: number, z: number]
}

const hailStones = input.split('\n').map((line) => {
  const [posStr, velStr] = line.split(' @ ')
  const pos = posStr.split(',').map((p) => parseInt(p))
  const vel = velStr.split(',').map((v) => parseInt(v))
  return { pos, vel } as Hailstone
})

// console.log(hailStones)

const y = (x: number) => {
  return 22.5 - 0.5 * x
}

const y2 = (x: number) => {
  return x + 1
}

type Func = {
  m: number
  c: number
  startX: number
  modX: number
}

type Range = [min: number, max: number]

const calcLine = (hail: Hailstone): Func => {
  const [x, y] = hail.pos
  const [vx, vy] = hail.vel
  const m = vy / vx
  const c = y - m * x
  return { m, c, startX: x, modX: vx }
}

const overlap = (f1: Func, f2: Func): [x: number, y: number] | null => {
  if (f1.m === f2.m && f1.startX !== f2.startX) return null
  const x = (f2.c - f1.c) / (f1.m - f2.m)
  const y = f1.m * x + f1.c
  return [parseFloat(x.toFixed(3)), parseFloat(y.toFixed(3))]
}

const willIntersectInrange = (f1: Func, f2: Func, range: Range): boolean => {
  const [min, max] = range
  const intersect = overlap(f1, f2)
  if (!intersect) {
    return false
  }
  const [x, y] = intersect
  if (
    (x > f1.startX && f1.modX < 0) ||
    (x < f1.startX && f1.modX > 0) ||
    (x > f2.startX && f2.modX < 0) ||
    (x < f2.startX && f2.modX > 0)
  ) {
    return false
  }

  return x >= min && x <= max && y >= min && y <= max
}

const hailFuncs = hailStones.map((hail) => calcLine(hail))

const targetArea: Range = [200000000000000, 400000000000000]
// const targetArea: Range = [7, 27]
let count = 0
let hailFunc: Func | undefined
let debugCount = 0
while ((hailFunc = hailFuncs.shift()) !== undefined) {
  for (const otherHailFunc of hailFuncs) {
    if (willIntersectInrange(hailFunc, otherHailFunc, targetArea)) {
      count++
    } else if (debugCount > 0) {
      console.log(`${JSON.stringify(hailFunc)} ${JSON.stringify(otherHailFunc)}`)
      debugCount--
    }
  }
}

console.log(`Answer Part A: ${count}`)

// console.log(`Answer Part B: ${totalB}`)

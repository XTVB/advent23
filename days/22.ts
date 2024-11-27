import path from 'path'
const day = path.basename(import.meta.file, '.ts')
console.log(`Day ${day}`)
const input = await Bun.file(`./inputs/${day}.txt`).text()

const inputT = `1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9`

const inputB = `0,0,1~0,1,1
1,1,1~1,1,1
0,0,2~0,0,2
0,1,2~1,1,2`

type Point3D = [x: number, y: number, z: number]
type Volume = string[][][]
type Block = [name: string, start: Point3D, end: Point3D]

const initVolume = (x: number, y: number, z: number): Volume => {
  const area: Volume = []
  for (let i = 0; i < x; i++) {
    area.push([])
    for (let j = 0; j < y; j++) {
      area[i].push([])
      for (let k = 0; k < z; k++) {
        area[i][j].push(k === 0 ? '-' : '.')
      }
    }
  }
  return area
}

const blocks = input.split('\n').map((blockStr, index) => {
  const [start, end] = blockStr.split('~').map((point) => point.split(',').map((p) => parseInt(p)) as Point3D)
  // names starting with 'A'
  const block: Block = [String.fromCharCode(65 + index), start, end]
  return block
})
const maxX = Math.max(...blocks.map((block) => Math.max(block[1][0], block[2][0]))) + 1
const maxY = Math.max(...blocks.map((block) => Math.max(block[1][1], block[2][1]))) + 1
const maxZ = Math.max(...blocks.map((block) => Math.max(block[1][2], block[2][2]))) + 1
const startingVol = initVolume(maxX, maxY, maxZ)

const volModBlock = (block: Block, disintegrate: boolean = false, volume: Volume = startingVol): Volume => {
  const [name, start, end] = block
  const [x1, y1, z1] = start
  const [x2, y2, z2] = end
  for (let i = x1; i <= x2; i++) {
    for (let j = y1; j <= y2; j++) {
      for (let k = z1; k <= z2; k++) {
        if (disintegrate && volume[i][j][k] === name) {
          volume[i][j][k] = '.'
        } else {
          volume[i][j][k] = name
        }
      }
    }
  }
  return volume
}

const mapPlane = (lines: string[][]) =>
  lines.reduce((line, slice) => {
    if (!line) {
      return slice
    }
    return slice.map((val, index) => {
      if (val === '-') {
        return '-'
      }
      if (val === '.') {
        return line[index]
      }
      if (line[index] === '.' || line[index] === val) {
        return val
      }
      return '?'
    })
  })
const planeToStr = (plane: string[][]) => {
  let planeStr = ''
  for (let z = plane[0].length - 1; z >= 0; z--) {
    for (let i = 0; i < plane.length; i++) {
      planeStr += plane[i][z]
    }
    planeStr += '\n'
  }
  return planeStr
}

const visualiseX = (volume: Volume = startingVol): string => {
  const xzPlane = volume.map(mapPlane)
  return planeToStr(xzPlane)
}

const printXz = (volume: Volume = startingVol): void => {
  console.log(visualiseX(volume))
}

const visualiseY = (volume: Volume = startingVol): string => {
  const flippedVolume = volume.map((_, index) => volume.map((line) => line[index]))

  const yzPlane = flippedVolume.map(mapPlane)
  return planeToStr(yzPlane)
}
const printYz = (volume: Volume = startingVol): void => {
  console.log(visualiseY(volume))
}

const sortBlocks = (blocks: Block[]): Block[] => {
  return blocks.sort((a, b) => {
    const [_, startA, endA] = a
    const [__, startB, endB] = b
    const lowestA = Math.min(startA[2], endA[2])
    const lowestB = Math.min(startB[2], endB[2])
    return lowestA - lowestB
  })
}

const supports = new Map<string, string[]>()

const canFall = (block: Block, volume: Volume = startingVol, updateSupports: boolean = true): boolean => {
  const [name, start, end] = block
  const [x1, y1, z1] = start
  const [x2, y2, z2] = end
  let hitSomething = false
  for (let i = x1; i <= x2; i++) {
    for (let j = y1; j <= y2; j++) {
      for (let k = z1 - 1; k <= z2 - 1; k++) {
        const spot = volume[i][j][k]
        if (spot === '.') {
          continue
        }
        if (spot === '-' || spot !== name) {
          if (updateSupports && spot !== '-') {
            supports.set(spot, [...(supports.get(spot) || []), name])
          }
          hitSomething = true
        }
      }
    }
  }
  return !hitSomething
}

const fallBlock = (block: Block, volume: Volume = startingVol): Block => {
  const [name, start, end] = block
  const [x1, y1, z1] = start
  const [x2, y2, z2] = end
  if (canFall(block, volume)) {
    volModBlock(block, true, volume)
    const newBlock: Block = [name, [x1, y1, z1 - 1], [x2, y2, z2 - 1]]
    volModBlock(newBlock, false, volume)
    return fallBlock(newBlock, volume)
  }
  return block
}

// if allowed is true, it will return true if the block is disintegratable
// first part wants true, second part wants false
const filterBlocks = (block: Block, fallenBlocks: Block[], allowed: boolean = true, debug: boolean = false) => {
  const [name] = block
  const supported = supports.get(name)
  if (!supported) {
    return allowed
  }
  if (debug) {
    console.log(supported)
  }
  const ifDisintegrated = volModBlock(block, true, structuredClone(startingVol))
  const wouldFall = supported.filter((name) => {
    const block = fallenBlocks.find((block) => block[0] === name)!
    const can = canFall(block, ifDisintegrated, false)
    if (debug) {
      console.log(`Block ${name} can fall: ${can}`)
    }
    return can
  })
  if (debug) {
    console.log(wouldFall)
  }
  return wouldFall.length === 0 ? allowed : !allowed
}

sortBlocks(blocks)
blocks.map((block) => volModBlock(block))
const fallenBlocks = blocks.map((block) => fallBlock(block))
// const disintegratableBlocks = fallenBlocks.filter((block) => filterBlocks(block, fallenBlocks)).map((block) => block[0])
const nonDisintegratableBlocks = fallenBlocks
  .filter((block) => filterBlocks(block, fallenBlocks, false))
  .map((block) => block[0])

// console.log(blocks)
// console.log(fallenBlocks)
// printXz()
// printYz()
// console.log(supports)
// console.log(disintegratableBlocks)

// easier to keep the filter the same and do some maths so as to not have to filter twice
console.log(`Answer Part A: ${fallenBlocks.length - nonDisintegratableBlocks.length}`)

const fallBlockOnce = (block: Block, volume: Volume = startingVol): number => {
  const [name, start, end] = block
  const [x1, y1, z1] = start
  const [x2, y2, z2] = end
  if (canFall(block, volume)) {
    volModBlock(block, true, volume)
    const newBlock: Block = [name, [x1, y1, z1 - 1], [x2, y2, z2 - 1]]
    volModBlock(newBlock, false, volume)
    return 1
  }
  return 0
}

const countFalls = (block: Block, blocks: Block[] = fallenBlocks, volume: Volume = startingVol): number => {
  const ifDisintegrated = volModBlock(block, true, structuredClone(startingVol))
  return blocks.slice(blocks.indexOf(block)).reduce((count, block) => {
    return count + fallBlockOnce(block, ifDisintegrated)
  }, 0)
}

const chainFallCount = nonDisintegratableBlocks.reduce((count, name) => {
  return count + countFalls(fallenBlocks.find((b) => b[0] === name)!)
}, 0)

console.log(`Answer Part B: ${chainFallCount}`)

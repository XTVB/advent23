import path from 'path'
const day = path.basename(import.meta.file, '.ts')
console.log(`Day ${day}`)
const input = await Bun.file(`./inputs/${day}.txt`).text()

const inputA = `1,0,1~1,2,1
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
  // with the full array of blocks numbers are clearer than characters
  // const block: Block = [`${index}`, start, end]
  return block
})
const maxX = Math.max(...blocks.map((block) => Math.max(block[1][0], block[2][0]))) + 1
const maxY = Math.max(...blocks.map((block) => Math.max(block[1][1], block[2][1]))) + 1
const maxZ = Math.max(...blocks.map((block) => Math.max(block[1][2], block[2][2]))) + 1
let startingVol = initVolume(maxX, maxY, maxZ)

const volModBlock = (block: Block, disintegrate: boolean = false, volume: Volume = startingVol): Volume => {
  const [name, start, end] = block
  const [x1, y1, z1] = start
  const [x2, y2, z2] = end
  for (let i = x1; i <= x2; i++) {
    for (let j = y1; j <= y2; j++) {
      for (let k = z1; k <= z2; k++) {
        if (disintegrate) {
          volume[i][j][k] = '.'
        } else {
          volume[i][j][k] = name
        }
      }
    }
  }
  return volume
}

// slightly more efficient than volModBlock twice
const volMoveBlock = (source: Block, target: Block, volume: Volume = startingVol): Volume => {
  const [sourceName, sourceStart, sourceEnd] = source
  const [_, targetStart, targetEnd] = target
  const [sourceX1, sourceY1, sourceZ1] = sourceStart
  const [sourceX2, sourceY2, sourceZ2] = sourceEnd
  const targetZ1 = targetStart[2]
  const targetZ2 = targetEnd[2]

  if (sourceZ1 !== sourceZ2) {
    // save a little bit of editing by calculating the overlap
    const outside = Math.min(sourceZ2 - targetZ2, sourceZ2 - sourceZ1 + 1)
    for (let i = sourceX1; i <= sourceX2; i++) {
      for (let j = sourceY1; j <= sourceY2; j++) {
        for (let k = 0; k < outside; k++) {
          volume[i][j][sourceZ2 - k] = '.'
          volume[i][j][targetZ1 + k] = sourceName
        }
      }
    }
  } else {
    for (let i = sourceX1; i <= sourceX2; i++) {
      for (let j = sourceY1; j <= sourceY2; j++) {
        volume[i][j][sourceZ1] = '.'
        volume[i][j][targetZ1] = sourceName
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
    return a[1][2] - b[1][2]
  })
}

const supports = new Map<string, Set<string>>()
const supportedBy = new Map<string, Set<string>>()

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
            supports.set(spot, (supports.get(spot) || new Set()).add(name))
            supportedBy.set(name, (supportedBy.get(name) || new Set()).add(spot))
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
  let newBlock: Block = [name, [x1, y1, z1], [x2, y2, z2]]
  while (canFall(newBlock, volume)) {
    newBlock = [name, [x1, y1, newBlock[1][2] - 1], [x2, y2, newBlock[2][2] - 1]]
  }
  if (block[1][2] !== newBlock[1][2]) {
    volMoveBlock(block, newBlock, volume)
  }
  return newBlock
}

// if allowed is true, it will return true if the block is disintegratable
// first part wants true, second part wants false
const filterBlocks = (block: Block, allowed: boolean = true, debug: boolean = false) => {
  const [name] = block
  const supported = supports.get(name)
  if (!supported) {
    return allowed
  }
  if (debug) {
    console.log(supported)
  }
  for (const supportedName of supported) {
    if (supportedBy.get(supportedName)?.size === 1) {
      return !allowed
    }
  }
  return allowed
}

sortBlocks(blocks)
blocks.map((block) => volModBlock(block))
const fallenBlocks = blocks.map((block) => fallBlock(block))
// const disintegratableBlocks = fallenBlocks.filter((block) => filterBlocks(block)).map((block) => block[0])
const nonDisintegratableBlocks = fallenBlocks.filter((block) => filterBlocks(block, false)).map((block) => block[0])

// console.log(blocks)
// console.log(fallenBlocks)
// printXz()
// printYz()
// console.log(supports)
// console.log(disintegratableBlocks)
// console.log(nonDisintegratableBlocks)

// easier to keep the filter the same and do some maths so as to not have to filter twice
console.log(`Answer Part A: ${fallenBlocks.length - nonDisintegratableBlocks.length}`)

const countFalls = (block: Block, blocks: Block[] = fallenBlocks): number => {
  const [name] = block
  const fallen = [name]

  return blocks.slice(blocks.indexOf(block) + 1).reduce((count, block) => {
    const supportedByBlock = [...(supportedBy.get(block[0])?.values() ?? [])]
    if (supportedByBlock.length > 0 && supportedByBlock.every((name) => fallen.includes(name))) {
      fallen.push(block[0])
      return count + 1
    }
    return count
  }, 0)
}

const chainFallCount = nonDisintegratableBlocks.reduce((count, name) => {
  return count + countFalls(fallenBlocks.find((b) => b[0] === name)!)
}, 0)

console.log(`Answer Part B: ${chainFallCount}`)

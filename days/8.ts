import path from 'path'
const day = path.basename(import.meta.file, '.ts')
console.log(`Day ${day}`)
const input = await Bun.file(`./inputs/${day}.txt`).text()

const inputA = `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`

const inputB = `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`

const inputC = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`

const instrReg = /([RL]+)/g

const directions = instrReg.exec(input)?.[0] ?? ''
// console.log(directions)

const nodeReg = /(?:(\w{3}) = \((\w{3}), (\w{3})\))/g

type Nodes = Record<string, { left: string; right: string }>

const nodes: Nodes = {}
let nodeArray
while ((nodeArray = nodeReg.exec(input)) !== null) {
  const [_, node, left, right] = nodeArray
  nodes[node] = {
    left,
    right,
  }
}
// console.log(nodes)

const nextNode = (nodes: Nodes, source: string, direction: string): string => {
  const { left, right } = nodes[source]
  return direction === 'L' ? left : right
}

const countSteps = (
  nodes: Nodes,
  directions: string,
  startingNode: string = 'AAA',
  completeFn: (node: string) => boolean = (node: string) => node === 'ZZZ',
): number => {
  let node = startingNode,
    count = 0,
    directionIndex = 0
  while (!completeFn(node)) {
    let direction = directions[directionIndex]
    count += 1
    node = nextNode(nodes, node, direction)
    directionIndex = directions.length === directionIndex + 1 ? 0 : directionIndex + 1
  }
  return count
}

const steps = countSteps(nodes, directions)

console.log(`Answer Part A: ${steps}`)

const startingNodes = Object.keys(nodes).filter((node) => node.endsWith('A'))

// console.log(startingNodes)

// brute force method that's way too slow
// const countGhostSteps = (nodes: Nodes, startingNodes: string[], directions: string) => {
//     let onNodes = startingNodes
//     let count = 0
//     let directionIndex = 0
//     while (!onNodes.every(node=>node.endsWith('Z'))) {
//         let direction = directions[directionIndex]
//         count += 1
//         onNodes = onNodes.map(node=>nextNode(nodes, node, direction))
//         directionIndex = directions.length === directionIndex + 1 ? 0 : directionIndex + 1
//         if (count > 10000000) {
//             break
//         }
//     }
//     console.log(onNodes)
//     return count
// }

// instead you need to recognise that they're all different valued loops and calculate the lcm
// calculate the lowest common multiple using the formula for greatest common divisor (thank you internet)
const gcd = (a: number, b: number): number => (a ? gcd(b % a, a) : b)

const lcm = (a: number, b: number) => (a * b) / gcd(a, b)

const ghostSteps = startingNodes.map((starting) =>
  countSteps(nodes, directions, starting, (node: string) => node.endsWith('Z')),
)
const stepsConvergeAt = ghostSteps.reduce(lcm)

console.log(`Answer Part B: ${stepsConvergeAt}`)

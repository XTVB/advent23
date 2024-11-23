import path from 'path'
const day = path.basename(import.meta.file, '.ts')
console.log(`Day ${day}`)
// const input = (await Bun.file(`./inputs/${day}.txt`).text())

const input = `?###???????? 3,2,1
.###.##.#...
.###.##..#..
.###.##...#.
.###.##....#
.###..##.#..
.###..##..#.
.###..##...#
.###...##.#.
.###...##..#
.###....##.#`

// console.log(`Answer Part A: ${totalA}`)
// console.log(`Answer Part B: ${totalB}`)

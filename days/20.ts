import path from 'path'
const day = path.basename(import.meta.file, '.ts')
console.log(`Day ${day}`)
// const input = (await Bun.file(`./inputs/${day}.txt`).text())

const input = `broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a`

// console.log(`Answer Part A: ${totalA}`)
// console.log(`Answer Part B: ${totalB}`)

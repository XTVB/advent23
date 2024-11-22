import path from "path";
const day = path.basename(import.meta.file, ".ts");
console.log(`Day ${day}`);
const lines = (await Bun.file(`./inputs/${day}.txt`).text()).split("\n");



// console.log(`Answer Part A: ${totalA}`)
// console.log(`Answer Part B: ${totalB}`);

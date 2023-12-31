import latestDay from "./getLatest";

const newDay = latestDay() + 1;

const fileStart =
  'import path from "path";\n' +
  'const day = path.basename(import.meta.file, ".ts");\n' +
  'console.log(`Day ${day}`);\n' +
  'const lines = (await Bun.file(`./inputs/${day}.txt`).text()).split("\\n");\n\n\n\n' +
  "// console.log(`Answer Part A: ${totalA}`)\n" +
  "// console.log(`Answer Part B: ${totalB}`);\n";

await Bun.write(`${import.meta.dir}/../days/${newDay}.ts`, fileStart);
await Bun.write(`${import.meta.dir}/../inputs/${newDay}.txt`, "");

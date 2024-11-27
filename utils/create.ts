import latestDay from './getLatest'

const newDay = latestDay() + 1

const fileStart =
  "import path from 'path'\n" +
  "const day = path.basename(import.meta.file, '.ts')\n" +
  'console.log(`Day ${day}`)\n' +
  '// const input = (await Bun.file(`./inputs/${day}.txt`).text())\n\n' +
  'const input = ``\n\n' +
  '// console.log(`Answer Part A: ${totalA}`)\n' +
  '// console.log(`Answer Part B: ${totalB}`)\n'

const input = Bun.env.AOC_SESSION_KEY
  ? await fetch(`https://adventofcode.com/2023/day/${newDay}/input`, {
      headers: {
        cookie: `session=${Bun.env.AOC_SESSION_KEY}`,
      },
    })
      .then((res) => res.text())
      .then((res) => res.trim())
  : ''

await Bun.write(`${import.meta.dir}/../days/${newDay}.ts`, fileStart)
await Bun.write(`${import.meta.dir}/../inputs/${newDay}.txt`, input)

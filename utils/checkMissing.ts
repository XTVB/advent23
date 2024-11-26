import latestDay from './getLatest'
import { isDefined } from './isDefined'

const answersReg = /(Answer Part A: (?<partA>.*))|(Answer Part B: (?<partB>.*))/g

for (let day = 1; day < latestDay() + 1; day++) {
  const proc = Bun.spawn(['bun', 'run', `days/${day}.ts`], {
    cwd: `${import.meta.dir}/../`,
  })

  const text = await new Response(proc.stdout).text()
  const matchingGroups = [...text.matchAll(answersReg)].map((m) => m.groups)
  const hasA = isDefined(matchingGroups.find((g) => g?.partA))
  const hasB = isDefined(matchingGroups.find((g) => g?.partB))
  if (!hasA && !hasB) {
    console.log(`Day ${day} is missing both parts\n`)
    continue
  }
  if (!hasA) {
    console.log(`Day ${day} is missing part A\n`)
  }
  if (!hasB) {
    console.log(`Day ${day} is missing part B\n`)
  }
}

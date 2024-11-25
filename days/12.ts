import path from 'path'
const day = path.basename(import.meta.file, '.ts')
console.log(`Day ${day}`)
// const input = await Bun.file(`./inputs/${day}.txt`).text()

const input = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`

type Condition = {
  cogs: string
  config: number[]
}

const lines = input.split('\n')
const conditions = lines.map((line) => {
  const [cogs, config] = line.split(' ')
  const condition: Condition = {
    cogs,
    config: config.split(',').map(Number),
  }
  return condition
})

// count number of ? in cogs
const countFlex = (cogs: string) => {
  let count = 0
  for (let i = 0; i < cogs.length; i++) {
    if (cogs[i] === '?') {
      count++
    }
  }
  return count
}

// console.log(conditions)

// quite doable to just enumerate all possibilities
// const maxFlex = conditions.reduce((max, condition) => Math.max(max, countFlex(condition.cogs)), 0)
// console.log(2 ** maxFlex)

const arrayCompare = (a: number[], b: number[]) => {
  if (a.length !== b.length) {
    return false
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false
    }
  }
  return true
}

const groupsReg = /(#+)/g

const fulfillsConfig = (cogs: string, config: number[]) =>
  arrayCompare(
    [...cogs.matchAll(groupsReg)].map((m) => m[1].length),
    config,
  )

const tryValue = (cogs: string, remainingFlex: number, config: number[]): number => {
  if (remainingFlex === 0) {
    return fulfillsConfig(cogs, config) ? 1 : 0
  }
  const ifBlank = tryValue(cogs.replace('?', '.'), remainingFlex - 1, config)
  const ifSharp = tryValue(cogs.replace('?', '#'), remainingFlex - 1, config)
  return ifBlank + ifSharp
}

const enumerateCogs = (cogs: string, config: number[]) => tryValue(cogs, countFlex(cogs), config)

// const possibleArrangements = conditions
//   .map((condition) => enumerateCogs(condition.cogs, condition.config))
//   .reduce((total, current) => total + current, 0)

// console.log(`Answer Part A: ${possibleArrangements}`)

// Part B
// no longer possible to enumerate, gonna have to be a bit more clever
// console.log(2 ** (maxFlex * 5 + 4))

const unfoldCogs = (cogs: string) => `${cogs}?${cogs}?${cogs}?${cogs}?${cogs}`
const unfoldConfig = (config: number[]) => [...config, ...config, ...config, ...config, ...config]

const unfoldedConditions = conditions.map((condition) => ({
  cogs: unfoldCogs(condition.cogs),
  config: unfoldConfig(condition.config),
}))

console.log(unfoldedConditions[0])

// TODO
// console.log(`Answer Part B: ${totalB}`)

import path from 'path'
const day = path.basename(import.meta.file, '.ts')
console.log(`Day ${day}`)
const input = await Bun.file(`./inputs/${day}.txt`).text()

const inputT = `px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`

const [workflowStr, partsStr] = input.split('\n\n')

type Part = {
  x: number
  m: number
  a: number
  s: number
}

type Rule = {
  destination: string
} & (
  | {
      key: '*'
      operator: '*'
      threshold: number
    }
  | {
      key: keyof Part
      operator: '>' | '<'
      threshold: number
    }
)

const ruleReg = /(?<key>\w)(?<operator>[><])(?<threshold>\d+)/
const toRule = (ruleStr: string): Rule => {
  const [condition, destination] = ruleStr.split(':')
  if (!destination) {
    return {
      key: '*',
      operator: '*',
      threshold: 0,
      destination: condition,
    }
  }
  const { key, operator, threshold } = ruleReg.exec(condition)?.groups ?? {}
  return {
    key: key as keyof Part,
    operator: operator as '>' | '<',
    threshold: parseInt(threshold),
    destination,
  }
}

const workflowReg = /(?<name>\w+)\{(?<rules>.*)\}/
const workflows = workflowStr.split('\n').reduce((workflowMap, workflow) => {
  const { name, rules } = workflowReg.exec(workflow)?.groups ?? {}
  workflowMap.set(name, rules.split(',').map(toRule))
  return workflowMap
}, new Map<string, Rule[]>())

const partsReg = /x=(?<x>\d+),m=(?<m>\d+),a=(?<a>\d+),s=(?<s>\d+)/
const parts = partsStr.split('\n').map((part) => {
  const { x, m, a, s } = partsReg.exec(part)?.groups ?? {}
  return { x: parseInt(x), m: parseInt(m), a: parseInt(a), s: parseInt(s) }
})

const accepted: Part[] = []
const rejected: Part[] = []

const processPart = (part: Part, workflows: Map<string, Rule[]>, startingWorkflow: string = 'in') => {
  let destination = startingWorkflow
  while (destination !== 'R' && destination !== 'A') {
    const rules = workflows.get(destination)
    if (!rules) {
      throw new Error(`No rules found for workflow ${destination}`)
    }
    const rule = rules.find((rule) => {
      if (rule.key === '*') {
        return true
      }
      const value = part[rule.key]
      switch (rule.operator) {
        case '>':
          return value > rule.threshold
        case '<':
          return value < rule.threshold
        default:
          return false
      }
    }) as Rule // we always have a wildcard rule to match
    destination = rule.destination
  }
  if (destination === 'A') {
    accepted.push(part)
  } else {
    rejected.push(part)
  }
}

// console.log(workflows)
// console.log(parts)
parts.map((part) => processPart(part, workflows))
// console.log(accepted)
// console.log(rejected)

const totalA = accepted.reduce((total, { x, m, a, s }) => total + x + m + a + s, 0)

console.log(`Answer Part A: ${totalA}`)

// attempt at part B
type Constraint = {
  key: keyof Part
  operator: '>' | '<'
  threshold: number
}

const globalConstraints: Constraint[][] = []

const buildConstraints = (workflow: string, constraints: Constraint[] = []) => {
  const rules = workflows.get(workflow)
  if (!rules) {
    throw new Error(`No rules found for workflow ${workflow}`)
  }
  for (const rule of rules) {
    const { key, operator, threshold, destination } = rule
    let newConstraints =
      // bug was here: thresholds need adjusting for the non-destination
      key !== '*'
        ? [...constraints, { key, operator, threshold: operator === '<' ? threshold - 1 : threshold + 1 }]
        : [...constraints]
    if (key !== '*') {
      constraints.push({ key, operator: operator === '<' ? '>' : '<', threshold })
    }
    if (destination === 'R') {
      continue
    }
    if (destination === 'A') {
      globalConstraints.push(newConstraints)
      continue
    }
    buildConstraints(destination, newConstraints)
  }
}
buildConstraints('in')

type Range = {
  min: number
  max: number
}
type Possibility = {
  [key in keyof Part]: Range
}

const reducePossibility = (possibility: Possibility, constraint: Constraint) => {
  const { key, operator, threshold } = constraint
  const range = possibility[key]
  switch (operator) {
    case '>':
      // bug was here: dont modify the threshold for the non-destination
      range.min = Math.max(range.min, threshold)
      break
    case '<':
      // bug was here: dont modify the threshold for the non-destination
      range.max = Math.min(range.max, threshold)
      break
  }
}

const getPossibility = (constraints: Constraint[]): Possibility => {
  const initialPossibility: Possibility = {
    x: { min: 1, max: 4000 },
    m: { min: 1, max: 4000 },
    a: { min: 1, max: 4000 },
    s: { min: 1, max: 4000 },
  }
  const possibility = constraints.reduce((possibility, constraint) => {
    reducePossibility(possibility, constraint)
    return possibility
  }, initialPossibility)
  return possibility
}
const numberValid = (possibility: Possibility): number => {
  const { x, m, a, s } = possibility
  return (x.max - x.min + 1) * (m.max - m.min + 1) * (a.max - a.min + 1) * (s.max - s.min + 1)
}
const getThresholds = (constraints: Constraint[]): number => {
  const possibility = getPossibility(constraints)
  if (!possibility) {
    return 0
  }
  return numberValid(possibility)
}

// console.log(globalConstraints.map(getPossibility))
// console.log(globalConstraints.map(getThresholds).reduce((total, num) => total + num, 0))

// second attempt at part B (both attempts had similar bugs, both fixed now)

const validPossibilities: Possibility[] = []
const followPath = (possibility: Possibility, workflow: string) => {
  const rules = workflows.get(workflow)
  if (!rules) {
    throw new Error(`No rules found for workflow ${workflow}`)
  }
  for (const rule of rules) {
    const { key, operator, threshold, destination } = rule
    let newPossibility = structuredClone(possibility)
    if (key !== '*') {
      if (operator === '>') {
        newPossibility[key].min = Math.max(newPossibility[key].min, threshold + 1)
        // bug was here: dont modify the threshold for the non-destination
        possibility[key].max = Math.min(possibility[key].max, threshold)
      } else {
        newPossibility[key].max = Math.min(newPossibility[key].max, threshold - 1)
        // bug was here: dont modify the threshold for the non-destination
        possibility[key].min = Math.max(possibility[key].min, threshold)
      }
    }
    if (destination === 'R') {
      continue
    }
    if (destination === 'A') {
      validPossibilities.push(newPossibility)
      continue
    }
    followPath(newPossibility, destination)
  }
}
const inital: Possibility = {
  x: { min: 1, max: 4000 },
  m: { min: 1, max: 4000 },
  a: { min: 1, max: 4000 },
  s: { min: 1, max: 4000 },
}
followPath(inital, 'in')
// console.log(globalConstraints.map(getThresholds).reduce((total, num) => total + num, 0) - 167409079868000)
const numberOfPossibilities = validPossibilities.reduce((total, possibility) => total + numberValid(possibility), 0)

console.log(`Answer Part B: ${numberOfPossibilities}`)

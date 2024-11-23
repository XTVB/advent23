import path from "path"
const day = path.basename(import.meta.file, ".ts")
console.log(`Day ${day}`)
const input = (await Bun.file(`./inputs/${day}.txt`).text()).split("\n")

const inputT = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`.split("\n")

const sequences = input.map((str) => str.split(" ").map((val) => parseInt(val)))

const diffs = (sequence: number[]) => {
  const diffs = sequence.map((val, index) => sequence[index + 1] - val)
  diffs.pop()
  return diffs
}

const getVisual = (sequence: number[]): number[][] => {
  let diff = diffs(sequence)
  let visual = [sequence, diff]
  let count = 0
  while (!diff.every((val) => val === 0)) {
    diff = diffs(diff)
    visual.push(diff)
  }
  return visual
}

const extrapolate = (sequence: number[]): number => {
  const visual = getVisual(sequence)
  while (visual.length > 2) {
    const lastDiffs = visual.pop()!
    const secondLastDiffs = visual[visual.length - 1]
    const nextValue = secondLastDiffs[secondLastDiffs.length - 1] + lastDiffs[lastDiffs.length - 1]
    secondLastDiffs.push(nextValue)
  }
  const lastDiffs = visual.pop()!
  const secondLastDiffs = visual[visual.length - 1]
  return secondLastDiffs[secondLastDiffs.length - 1] + lastDiffs[lastDiffs.length - 1]
}

const predictSum = sequences.reduce((total, sequence) => total + extrapolate(sequence), 0)

console.log(`Answer Part A: ${predictSum}`)

const extrapolateBackwards = (sequence: number[]): number => {
  const visual = getVisual(sequence)
  while (visual.length > 2) {
    const lastDiffs = visual.pop()!
    const secondLastDiffs = visual[visual.length - 1]
    const nextValue = secondLastDiffs[0] - lastDiffs[0]
    secondLastDiffs.unshift(nextValue)
  }
  const lastDiffs = visual.pop()!
  const secondLastDiffs = visual[visual.length - 1]
  return secondLastDiffs[0] - lastDiffs[0]
}

// console.log(sequences.map(sequence => extrapolateBackwards(sequence)))

const historySum = sequences.reduce((total, sequence) => total + extrapolateBackwards(sequence), 0)

console.log(`Answer Part B: ${historySum}`)

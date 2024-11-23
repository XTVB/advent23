import path from 'path'
const day = path.basename(import.meta.file, '.ts')
console.log(`Day ${day}`)
const lines = (await Bun.file(`./inputs/${day}.txt`).text()).split('\n')

const convertToNum = (test: string): number => {
  const int = parseInt(test)

  if (!Number.isNaN(int)) {
    return int
  }

  switch (test) {
    case 'one':
      return 1
    case 'two':
      return 2
    case 'three':
      return 3
    case 'four':
      return 4
    case 'five':
      return 5
    case 'six':
      return 6
    case 'seven':
      return 7
    case 'eight':
      return 8
    case 'nine':
      return 9
    default:
      return 0
  }
}

const NUMS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
const reg = /(\d)/g

let useStrings = false

const constructReg = () => {
  return useStrings ? new RegExp(`(?=(\\d|${NUMS.join('|')}))`, 'g') : /(\d)/g
}

const firstNum = (line: string): number => {
  return convertToNum([...line.matchAll(constructReg())].at(0)?.at(1) ?? '')
}
const lastNum = (line: string): number => {
  return convertToNum([...line.matchAll(constructReg())].at(-1)?.at(1) ?? '')
}

const firstAndLastNum = (line: string): number => {
  return parseInt(`${firstNum(line)}${lastNum(line)}`)
}

const totalA = lines.map(firstAndLastNum).reduce((a, b) => a + b, 0)
console.log(`Answer Part A: ${totalA}`)
useStrings = true
const totalB = lines.map(firstAndLastNum).reduce((a, b) => a + b, 0)
console.log(`Answer Part B: ${totalB}`)

// const test = `two1nine
// eightwothree
// abcone2threexyz
// xtwone3four
// 4nineeightseven2
// zoneight234
// 7pqrstsixteen`.split("\n");
// console.log(test.map(firstAndLastNum));
// console.log(test.map(firstAndLastNum).reduce((a, b) => a + b, 0));
// console.log(constructReg());
// console.log(firstAndLastNum("eighthree"));

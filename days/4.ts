import path from 'path'
const day = path.basename(import.meta.file, '.ts')
console.log(`Day ${day}`)
const lines = (await Bun.file(`./inputs/${day}.txt`).text()).split('\n')

const tests = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`.split('\n')

const test = tests[0]

const getNumbers = (str: string): number[] => {
  return str
    .split(' ')
    .map((x) => parseInt(x))
    .filter((x) => !Number.isNaN(x))
}

const getScoring = (run: string) => {
  const [_, game] = run.split(':')

  const [winning, have] = game.split('|')

  const winNumbers = getNumbers(winning)
  const haveNumbers = getNumbers(have)

  return haveNumbers.filter((x) => winNumbers.includes(x)).length
}

const getScore = (run: string) => {
  const scoring = getScoring(run)

  return scoring === 0 ? 0 : 2 ** (scoring - 1)
}

const totalA = lines.map(getScore).reduce((a, b) => a + b, 0)
console.log(`Answer Part A: ${totalA}`)

const getCards = (runs: string[]) => {
  const cardCount: { [key: number]: number } = {}

  for (let i = runs.length - 1; i >= 0; i--) {
    const cardNumber = i + 1
    const cardScore = getScoring(runs[i])
    let total = 1
    for (let n = cardNumber + 1; n <= cardNumber + cardScore; n++) {
      total += cardCount[n]
    }
    cardCount[cardNumber] = total
  }
  return Object.values(cardCount).reduce((a, b) => a + b, 0)
}

const totalB = getCards(lines)
console.log(`Answer Part B: ${totalB}`)

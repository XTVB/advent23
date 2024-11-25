import path from 'path'
const day = path.basename(import.meta.file, '.ts')
console.log(`Day ${day}`)
const input = await Bun.file(`./inputs/${day}.txt`).text()

// const input = `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`

const HASH = (input: string) =>
  input.split('').reduce((hash, char) => {
    hash += char.charCodeAt(0)
    hash = hash * 17
    return hash % 256
  }, 0)

const instr = input.split(',')

const hashSum = instr.map(HASH).reduce((a, b) => a + b)

console.log(`Answer Part A: ${hashSum}`)

type Instruction = {
  label: string
  action: '=' | '-'
  focal: number
}

type Lens = {
  label: string
  value: number
}

const instrReg = /(?<label>\w+)(?<action>=|-)(?<focal>\d?)/
const parse = (instr: string): Instruction => {
  const { label, action, focal } = instrReg.exec(instr)?.groups ?? {}
  //   console.log(instr)
  //   console.log(label, action, focal)
  return { label, action: action as '=' | '-', focal: parseInt(focal) }
}

// console.log(instr.map(parse))
const map = new Map<number, Lens[]>()

const applyInstruction = (instr: Instruction) => {
  const { label, action, focal } = instr
  if (action === '-') {
    if (map.has(HASH(label))) {
      const lenses = map.get(HASH(label))!
      const index = lenses.findIndex((l) => l.label === label)
      if (index > -1) {
        lenses.splice(index, 1)
      }
    }
  } else {
    // console.log(label)
    if (map.has(HASH(label))) {
      const lenses = map.get(HASH(label))!
      const index = lenses.findIndex((l) => l.label === label)
      if (index > -1) {
        lenses[index].value = focal
      } else {
        lenses.push({ label, value: focal })
      }
    } else {
      map.set(HASH(label), [{ label, value: focal }])
    }
  }
}

instr.forEach((i) => {
  applyInstruction(parse(i))
})

const focus = [...map.entries()].reduce((total, [box, lenses]) => {
  const lens = lenses.reduce((lensTotal, { value }, index) => lensTotal + (box + 1) * (index + 1) * value, 0)
  return total + lens
}, 0)

console.log(`Answer Part B: ${focus}`)

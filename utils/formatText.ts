const makeBold = <T extends string>(message: T): T => {
  return `\x1b[1m${message}\x1b[0m` as T
}

const makeDim = <T extends string>(message: T): T => {
  return `\x1b[2m${message}\x1b[0m` as T
}

const makeItalic = <T extends string>(message: T): T => {
  return `\x1b[3m${message}\x1b[0m` as T
}

const makeUnderline = <T extends string>(message: T): T => {
  return `\x1b[4m${message}\x1b[0m` as T
}

const makeInverse = <T extends string>(message: T): T => {
  return `\x1b[7m${message}\x1b[0m` as T
}

const makeHidden = <T extends string>(message: T): T => {
  return `\x1b[8m${message}\x1b[0m` as T
}

const makeStrikethrough = <T extends string>(message: T): T => {
  return `\x1b[9m${message}\x1b[0m` as T
}

const makeBlack = <T extends string>(message: T): T => {
  return `\x1b[30m${message}\x1b[0m` as T
}
const makeRed = <T extends string>(message: T): T => {
  return `\x1b[31m${message}\x1b[0m` as T
}

const makeGreen = <T extends string>(message: T): T => {
  return `\x1b[32m${message}\x1b[0m` as T
}

const makeYellow = <T extends string>(message: T): T => {
  return `\x1b[33m${message}\x1b[0m` as T
}

const makeBlue = <T extends string>(message: T): T => {
  return `\x1b[34m${message}\x1b[0m` as T
}

const makePurple = <T extends string>(message: T): T => {
  return `\x1b[35m${message}\x1b[0m` as T
}
const makeCyan = <T extends string>(message: T): T => {
  return `\x1b[36m${message}\x1b[0m` as T
}

const makeLightGrey = <T extends string>(message: T): T => {
  return `\x1b[37m${message}\x1b[0m` as T
}

const makeDarkGrey = <T extends string>(message: T): T => {
  return `\x1b[90m${message}\x1b[0m` as T
}

const makeLightRed = <T extends string>(message: T): T => {
  return `\x1b[91m${message}\x1b[0m` as T
}

const makeLightGreen = <T extends string>(message: T): T => {
  return `\x1b[92m${message}\x1b[0m` as T
}

const makeLightYellow = <T extends string>(message: T): T => {
  return `\x1b[93m${message}\x1b[0m` as T
}

const makeLightBlue = <T extends string>(message: T): T => {
  return `\x1b[94m${message}\x1b[0m` as T
}

const makeLightPurple = <T extends string>(message: T): T => {
  return `\x1b[95m${message}\x1b[0m` as T
}

const makeLightCyan = <T extends string>(message: T): T => {
  return `\x1b[96m${message}\x1b[0m` as T
}

const makeWhite = <T extends string>(message: T): T => {
  return `\x1b[97m${message}\x1b[0m` as T
}

type Colour =
  | 'black'
  | 'red'
  | 'blue'
  | 'green'
  | 'yellow'
  | 'purple'
  | 'cyan'
  | 'lightGrey'
  | 'darkGrey'
  | 'lightRed'
  | 'lightGreen'
  | 'lightYellow'
  | 'lightBlue'
  | 'lightPurple'
  | 'lightCyan'
  | 'white'

const logColour = (message: string, colour: Colour) => {
  switch (colour) {
    case 'black':
      console.log(makeBlack(message))
      break
    case 'red':
      console.log(makeRed(message))
      break
    case 'blue':
      console.log(makeBlue(message))
      break
    case 'green':
      console.log(makeGreen(message))
      break
    case 'yellow':
      console.log(makeYellow(message))
      break
    case 'purple':
      console.log(makePurple(message))
      break
    case 'cyan':
      console.log(makeCyan(message))
      break
    case 'lightGrey':
      console.log(makeLightGrey(message))
      break
    case 'darkGrey':
      console.log(makeDarkGrey(message))
      break
    case 'lightRed':
      console.log(makeLightRed(message))
      break
    case 'lightGreen':
      console.log(makeLightGreen(message))
      break
    case 'lightYellow':
      console.log(makeLightYellow(message))
      break
    case 'lightBlue':
      console.log(makeLightBlue(message))
      break
    case 'lightPurple':
      console.log(makeLightPurple(message))
      break
    case 'lightCyan':
      console.log(makeLightCyan(message))
      break
    case 'white':
      console.log(makeWhite(message))
      break
  }
}

export {
  makeBold,
  makeDim,
  makeItalic,
  makeUnderline,
  makeInverse,
  makeHidden,
  makeStrikethrough,
  makeBlack,
  makeRed,
  makeBlue,
  makeGreen,
  makeYellow,
  makePurple,
  makeCyan,
  makeLightGrey,
  makeDarkGrey,
  makeLightRed,
  makeLightGreen,
  makeLightYellow,
  makeLightBlue,
  makeLightPurple,
  makeLightCyan,
  makeWhite,
  Colour,
  logColour,
}

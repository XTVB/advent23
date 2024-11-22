import path from "path";
import { isDefined } from "../utils/isDefined";
const day = path.basename(import.meta.file, ".ts");
console.log(`Day ${day}`);
const input = (await Bun.file(`./inputs/${day}.txt`).text()).split("\n");

const inputT = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`.split("\n")

enum Rank {
    HIGH_CARD,
    PAIR,
    TWO_PAIR,
    THREE,
    FULL_HOUSE,
    FOUR,
    FIVE
}

const rankToString = (rank: Rank): string => {
    switch (rank) {
        case Rank.HIGH_CARD:
            return "High Card";
        case Rank.PAIR:
            return "Pair";
        case Rank.TWO_PAIR:
            return "Two Pair";
        case Rank.THREE:
            return "Three of a Kind";
        case Rank.FULL_HOUSE:
            return "Full House";
        case Rank.FOUR:
            return "Four of a Kind";
        case Rank.FIVE:
            return "Five of a Kind";
        default:
            return "Unknown Rank";
    }
}

type Hand = {
    cards: string[] // e.g. T55J5
    bid: number
    rank: Rank
}

// PLAN: map hands to rank, sort, multiply

const countHand = (hand: string[]) => {
    return hand.reduce((dict, cur)=>{
        dict[cur] = dict[cur] ? dict[cur] + 1 : 1
        return dict
    },{} as Record<string, number>)
}

const mapSymbol = (symbol: string, usingJokers: boolean): number => {
    switch(symbol) {
        case 'T':
            return 10
        case 'J':
            return usingJokers ? 0 : 11
        case 'Q':
            return 12
        case 'K':
            return 13
        case 'A':
        default:
            return 14
    }
}

// const highestCard = (firstCard: string, secondCard: string): number => {
//     let firstVal = parseInt(firstCard)
//     firstVal = isNaN(firstVal) ? mapSymbol(firstCard) : firstVal
//     let secondVal = parseInt(secondCard)
//     secondVal = isNaN(secondVal) ? mapSymbol(secondCard) : secondVal
    
//     return secondVal - firstVal
// }

const sortCard = (firstCard: string, secondCard: string, usingJokers: boolean): number => {
    let firstVal = parseInt(firstCard)
    firstVal = isNaN(firstVal) ? mapSymbol(firstCard, usingJokers) : firstVal
    let secondVal = parseInt(secondCard)
    secondVal = isNaN(secondVal) ? mapSymbol(secondCard, usingJokers) : secondVal
    
    return firstVal - secondVal
}

const rankHand = (hand: string[]): Rank => {
    const count = Object.values(countHand(hand))
    if (count.length === 5) {
        return Rank.HIGH_CARD
    }
    const [first, second, third, fourth] = count.sort().reverse()
    if (first === 5) {
        return Rank.FIVE
    }
    if (first === 4) {
        return Rank.FOUR
    }
    if (first === 3) {
        return second === 2 ? Rank.FULL_HOUSE : Rank.THREE
    }
    // if (first === 2) {
        return second === 2 ? Rank.TWO_PAIR : Rank.PAIR
    // }
}

const hands: Hand[] = input.map(line => {
    const [handStr, bidStr] = line.split(' ')
    const hand = handStr.split('')
    return {
        cards: hand,
        bid: parseInt(bidStr),
        rank: rankHand(hand)
    }
})

const compareIndexes = (index: number, handA: string[], handB: string[], usingJokers: boolean): number => {
    const comp = sortCard(handA[index], handB[index], usingJokers)
    if (comp === 0) {
        return compareIndexes(index+1, handA, handB, usingJokers)
    }
    return comp
}

const compareHands = (handA: Hand, handB: Hand, usingJokers: boolean = false): number => {
    const rankComparison =  handA.rank - handB.rank
    if (rankComparison === 0) {
        return compareIndexes(0, handA.cards, handB.cards, usingJokers)
    }
    return rankComparison
}

const scores = hands.sort(compareHands).map(({bid}, index)=>bid*(index+1))
const total = scores.reduce((total, score) => total+score, 0)

console.log(`Answer Part A: ${total}`)

const rankHandFlex = (hand: string[]): Rank => {
    const handCount = countHand(hand)
    const numberOfJokers = handCount['J'] ?? 0
    delete handCount['J']
    const count = Object.values(handCount)
    if (count.length === 5) {
        return Rank.HIGH_CARD
    }
    let [first, second] = count.sort().reverse()
    first = isDefined(first) ? first + numberOfJokers : first
    if (first === 5 || numberOfJokers === 5) {
        return Rank.FIVE
    }
    if (first === 4) {
        return Rank.FOUR
    }
    if (first === 3) {
        return second === 2 ? Rank.FULL_HOUSE : Rank.THREE
    }
    // if (first === 2) {
        return second === 2 ? Rank.TWO_PAIR : Rank.PAIR
    // }
}

const flexHands: Hand[] = input.map(line => {
    const [handStr, bidStr] = line.split(' ')
    const hand = handStr.split('')
    return {
        cards: hand,
        bid: parseInt(bidStr),
        rank: rankHandFlex(hand)
    }
})

const flexScores = flexHands.sort((a, b)=>compareHands(a, b, true)).map(({bid}, index)=>bid*(index+1))
const flexTotal = flexScores.reduce((total, score) => total+score, 0)

// console.log(flexHands.sort((a, b)=>compareHands(a, b, true)).map(({cards, rank})=>({
//     cards,
//     rank: rankToString(rank)
// })))

// await Bun.write(`${import.meta.dir}/../outputs/7-test.txt`, JSON.stringify(flexHands.sort((a, b)=>compareHands(a, b, true)).map(({cards, rank})=>({
//     cards,
//     rank: rankToString(rank)
// }))));

console.log(`Answer Part B: ${flexTotal}`);

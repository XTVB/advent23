import path from "path";
const day = path.basename(import.meta.file, ".ts");
console.log(`Day ${day}`)
const lines = (await Bun.file(`./inputs/${day}.txt`).text()).split("\n");

const tests = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`.split("\n");
const test = tests[0];

const maxRed = 12;
const maxGreen = 13;
const maxBlue = 14;

const getId = (idStr: string): number => {
  const gameTest = /Game (\d+)/g;
  return parseInt(gameTest.exec(idStr)?.at(1) ?? "");
};
const countRed = (run: string): number => {
  const redTest = /(\d+) red/g;
  return parseInt(redTest.exec(run)?.at(1) ?? "");
};

const countGreen = (run: string): number => {
  const greenTest = /(\d+) green/g;
  return parseInt(greenTest.exec(run)?.at(1) ?? "");
};

const countBlue = (run: string): number => {
  const blueTest = /(\d+) blue/g;
  return parseInt(blueTest.exec(run)?.at(1) ?? "");
};

const checkRun = (run: string): boolean => {
  const red = countRed(run);
  if (red > maxRed) {
    return false;
  }
  const green = countGreen(run);
  if (green > maxGreen) {
    return false;
  }
  const blue = countBlue(run);
  if (blue > maxBlue) {
    return false;
  }
  return true;
};

const checkRuns = (runs: string[]): boolean => {
  for (let run of runs) {
    if (!checkRun(run)) {
      return false;
    }
  }
  return true;
};

const check = (game: string) => {
  const [idStr, runStr] = game.split(": ");
  const runs = runStr.split("; ");
  const id = getId(idStr);
  return { id, possible: checkRuns(runs) };
};

// console.log(
//   tests
//     .map(check)
//     .filter(({ possible }) => possible)
//     .map(({ id }) => id)
//     .reduce((a, b) => a + b, 0)
// );
const totalA = lines
  .map(check)
  .filter(({ possible }) => possible)
  .map(({ id }) => id)
  .reduce((a, b) => a + b, 0);
console.log(`Answer Part A: ${totalA}`);

const minRed = (test: string): number => {
  const redTest = /(\d+) red/g;
  return Math.max(
    1,
    ...[...test.matchAll(redTest)].map(([_, a]) => parseInt(a))
  );
};
const minGreen = (test: string): number => {
  const greenTest = /(\d+) green/g;
  return Math.max(
    1,
    ...[...test.matchAll(greenTest)].map(([_, a]) => parseInt(a))
  );
};
const minBlue = (test: string): number => {
  const blueTest = /(\d+) blue/g;
  return Math.max(
    1,
    ...[...test.matchAll(blueTest)].map(([_, a]) => parseInt(a))
  );
};

const power = (game: string) => {
  return minRed(game) * minBlue(game) * minGreen(game);
};

const totalB = lines.map(power).reduce((a, b) => a + b, 0);
console.log(`Answer Part B: ${totalB}`);

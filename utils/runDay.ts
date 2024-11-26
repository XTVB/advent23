import latestDay from './getLatest'
const day = parseInt(Bun.argv[2])

if (isNaN(day) || day < 1 || day > latestDay()) {
  console.log(`Invalid day: ${day}`)
} else {
  const proc = Bun.spawn(['bun', 'run', `days/${day}.ts`], {
    cwd: `${import.meta.dir}/../`,
  })

  const text = await new Response(proc.stdout).text()
  console.log(text)
}

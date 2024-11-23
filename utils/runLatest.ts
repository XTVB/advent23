import latestDay from './getLatest'

const proc = Bun.spawn(['bun', 'run', `days/${latestDay()}.ts`], {
  cwd: `${import.meta.dir}/../`,
})

const text = await new Response(proc.stdout).text()
console.log(text)

import latestDay from "./getLatest"

for (let day = 1; day < latestDay() + 1; day++) {
  const proc = Bun.spawn(["bun", "run", `days/${day}.ts`], {
    cwd: `${import.meta.dir}/../`,
  })

  const text = await new Response(proc.stdout).text()
  console.log(text)
}

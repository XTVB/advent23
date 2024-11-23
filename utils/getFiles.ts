import { readdir } from "node:fs/promises"
import { join } from "node:path"

const getFiles = async (directoryPath: string) => {
  const fileNames = await readdir(directoryPath) // returns a JS array of just short/local file-names, not paths.
  const filePaths = fileNames.map((fn) => join(directoryPath, fn))
  return filePaths
}

export default getFiles

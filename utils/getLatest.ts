import path from "path";
import getFiles from "./getFiles";

const dayFileNames = await getFiles(`${import.meta.dir}/../days`);

const latestDay = () => {
  return Math.max(
    ...dayFileNames.map((f) => parseInt(path.basename(f, ".ts")))
  );
};

export default latestDay;
export default function (outputType: string) {
  if (!outputType) throw new Error();
  if (outputType === "csv") {
    return "arrayToCsv";
  }
}

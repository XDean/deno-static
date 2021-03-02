import {cli} from "./deps.ts";

type Options = {
  file: string
}

const parse = await new cli.Command<Options>()
  .name("deno-static")
  .version("1.0.0")
  .description("Convert file to ts file")
  .arguments('<input> [output]')
  .parse(Deno.args);

const input = parse.args[0]
const output = parse.args[1] || input + '.ts'

const bytes = await Deno.readFile(input)

const staticContent = `export default new Uint8Array([${bytes.join(', ')}])`

Deno.writeTextFile(output, staticContent)


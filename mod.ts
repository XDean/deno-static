import {cmd, fs, path, prompt} from "./deps.ts";

type Options = {
  deep: number
  ext: string[]
  overwrite: boolean
}

const parse = await new cmd.Command<Options>()
  .name("deno-static")
  .version("1.0.0")
  .description("Convert file to ts file")
  .option('-d, --deep <deep:number>', 'max recursive depth')
  .option('-e, --ext <ext:string[]>', 'include file extensions')
  .option('-o, --overwrite [overwrite:boolean]', 'overwrite exist file')
  .arguments('<input> [output]')
  .parse(Deno.args);

const input = parse.args[0]
const output = parse.args[1]
const suffix = '.static.ts';

const [inputFolder, inputFiles] = await async function () {
  const inputInfo = await Deno.lstat(input)
  if (inputInfo.isFile) {
    return [path.dirname(input), [path.basename(input)]]
  } else if (inputInfo.isDirectory) {
    console.log(`scanning ${input}`)
    const res = []
    for await (const f of fs.walk(input, {
      includeDirs: false,
      maxDepth: parse.options.deep,
      exts: parse.options.ext,
    })) {
      if (!f.name.endsWith(suffix)){
        res.push(path.relative(input, f.path))
      }
    }
    console.log(`find ${res.length} files matched`)
    return [input, res]
  } else {
    throw 'symbol link not supported'
  }
}()

async function generate(inputFile: string, outputFile: string) {
  console.log(`generate ${inputFile} -> ${outputFile}`)
  if (await fs.exists(outputFile)) {
    const overwrite = parse.options.overwrite || await prompt.Confirm.prompt(`${outputFile} already exists, overwrite?`)
    if (overwrite) {
      console.log(`overwrite existing ${outputFile}`)
    } else {
      console.log(`skip ${inputFile}`)
      return
    }
  }
  const bytes = await Deno.readFile(inputFile)
  const staticContent = `export default new Uint8Array([${bytes.join(', ')}])`
  await fs.ensureFile(outputFile)
  await Deno.writeTextFile(outputFile, staticContent)
}

if (inputFiles.length == 1 && output.endsWith(suffix)) {
  await generate(path.join(inputFolder, inputFiles[0]), output)
} else {
  const outputFolder = await async function () {
    if (!!output) {
      await fs.ensureDir(output)
      return output
    } else {
      return inputFolder
    }
  }()

  for (const inputFile of inputFiles) {
    await generate(path.join(inputFolder, inputFile), path.join(outputFolder, inputFile + suffix))
  }
}


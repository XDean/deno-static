# Deno Static

Generate typescript file from static file

## Installation

```shell
deno install --allow-read --allow-write --unstable --name=deno-static https://deno.land/x/deno_static/mod.ts
deno-static -h
```

## Usage

```shell
Usage:   deno-static <input> [output]
Version: v1.0.2

Description:

generate typescript from static file

Options:

-h, --help                    - Show this help.
-V, --version                 - Show the version number for this program.
-d, --deep       <deep>       - max recursive depth
-e, --ext        <ext[]>      - include file extensions
-o, --overwrite  [overwrite]  - overwrite exist file

Examples:

    Generate for single file: deno-static README.md
    Generate for folder:      deno-static static/
    Output to other folder:   deno-static static/ dist/

```
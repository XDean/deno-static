# Deno Static

Convert a static file to typescript file

## Installation

```shell
deno install --allow-read --allow-write --unstable --name=deno-static https://deno.land/x/deno_static/mod.ts
```

## Usage

```shell
deno-static <input> [output] 
```

If output not given, default output is `<input>.ts`
# ScaffoldMaker
This is a tool for generating scaffolding.

## Usage

The usage of this tool is very simple, you only need to fill in the configuration file to construct a simple scaffolding program. Then publish it to the npm.

```shell
git clone https://github.com/CairBin/ScaffoldMaker.git
cd ScaffoldMaker
npm install
```

You must change `package.json` to ensure that the package name and other fields are correct.

`package.json`

```json
{
  "name": "vite-element",
  "version": "1.0.1",
  "description": "This is a tool for generating vite templates.",
  "main": "index.js",
  "bin": {
    "run": "./bin/index.js"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "vite",
    "elementUI"
  ],
  "author": "cairbin",
  "license": "MIT",
  "dependencies": {
    "chalk": "^4.0.0",
    "commander": "^10.0.1",
    "download-git-repo": "^3.0.2",
    "figlet": "^1.6.0",
    "fs-extra": "^11.1.1",
    "inquirer": "^8.2.0",
    "ora": "^5.1.0",
    "shell": "^0.5.1",
    "shelljs": "^0.8.5",
    "symbol": "^0.3.1"
  }
}
```



`lib/config.json`

```json
{
    "consoleLogo":"Vite-Element",
    "remote":"http://github.com/cairbin/ViteElementTemplate.git",
    "branch":"main",
    "registry":"https://registry.npmjs.org/"
}
```

* `consoleLogo` The name of a project with a WordArt effect output from the console
* `remote` The github repository of your templates.
* `branch` Repository branch
* `registry` The registry of npm

## Publish

If you want to publish to the npm, please see [npm-publish | npm Docs (npmjs.com)](https://docs.npmjs.com/cli/v6/commands/npm-publish).

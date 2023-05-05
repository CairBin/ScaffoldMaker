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

* `package.json`

```json
{
    "name": "ScaffoldMaker",
    "version": "1.0.1",
    "description": "This is a tool for generating templates.",
    "main": "index.js",
    "bin": {
        "scmaker": "./bin/index.js"
    },
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "keywords": [],
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
        "symbol": "^0.3.1",
        "log-symbols": "^4.1.0"
    }
}
```
Where the `name` field is the name of the scaffold, and `version` is the version of the scaffold. Please modify the bin field to confirm your command.For example,if you want the user to input `superexp create ProjectName` to create a project named `ProjectName`,you have to change `bin` as follows.

```json
"bin": {
    "superexp": "./bin/index.js"
}
```

* `./config/config.json`

```json
{
    "console_logo":"ScaffoldMaker",
    "npm":{
        "registry":"https://registry.npmjs.org/",
        "mirrors":{
            "taobao":"https://registry.npm.taobao.org/",
            "cnpm":"http://registry.cnpmjs.org "
        }
    },
    "templates":{
        "remote":{
            "ExpressTemplate":{
                "clone": "https://github.com/CairBin/ExpressTemplate.git#main",
                "zip": "https://codeload.github.com/CairBin/ExpressTemplate/zip/refs/heads/main",
                "mirrors": {
                    "GitCode": {
                        "clone":"https://gitcode.net/qq_42759112/ExpressTemplate.git#main",
                        "zip":"https://gitcode.net/qq_42759112/ExpressTemplate/-/archive/main/ExpressTemplate-main.zip"
                    }
                }
            }
        },
        "local":{
            "ExpressTemplate":"ExpressTemplate"
        }
    }
}
```
* `console_logo` logo output in the console
* `npm` npm registry and its mirrors
* `templates` your template files

When configuring the mirrors of NPM, you need to strictly follow the format of key as name and value as URL.Those keys will and these keys will serve as option names to provide user selection.

The `remote` field in templates is used to retrieve template files from the git repository. It is not difficult to see that it contains several sub objects, with the sub object key being the option name.

In particular, the `clone` contains the **git URL** and the **branch**.You should connect them with `#`, such as `https://github.com/CairBin/ExpressTemplate.git#main`.

If **Git** is not installed on the user's device, download the compressed package through the zip field instead of using `git clone`.

The `mirrors` field of the template is similar to the above.

Now that ScaffoldMaker supports local templates, you only need to modify the `local` field of the configuration file and place your template folder in the `./template` directory.The key of the `local` sub object is the template name and the value is the relative path of the `./template` directory.



## Publish

If you want to publish to the npm, please see [npm-publish | npm Docs (npmjs.com)](https://docs.npmjs.com/cli/v6/commands/npm-publish).

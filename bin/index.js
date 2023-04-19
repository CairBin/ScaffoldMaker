#! /usr/bin/env node

const { program } = require("commander");
const figlet = require('figlet')
const chalk = require('chalk')
const configJson = require('./../lib/config.json')
program
    .command('create [name]')
    .description('create a new project')
    .option('-f, --force', 'overwrite target directory if it exist')
    .action((name, options) => {
        require('../lib/create.js')(name,options)
    })

program
    .version(`v${require('../package.json').version}`)
    .usage('<command> [option]')


program
    .on('--help', () => {
        console.log('\r\n' + figlet.textSync(configJson.consoleLogo, {
            font: 'Ghost',
            horizontalLayout: 'default',
            verticalLayout: 'default',
            width: 80,
            whitespaceBreak: true
        }));
        console.log(`\r\nRun ${chalk.cyan(`roc <command> --help`)} show details\r\n`)
    })

program.parse(process.argv)
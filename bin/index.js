#! /usr/bin/env node
const { program } = require("commander");
const figlet = require('figlet')
const chalk = require('chalk')
const configJson = require('./../config/config.json')

program
    .command('create [name]')
    .description('create a new project')
    .option('-l, --local', 'obtain templates locally')
    .option('-f, --force', 'overwrite target directory if it exists')
    .action((name, options) => {
        require('./../lib/create/index.js')(name,options)
    })

program
    .version(`v${require('../package.json').version}`,'-v, --version')
    .usage('<command> [option]')

program
    .on('--help', () => {
        console.log('\r\n' + figlet.textSync(configJson.console_logo, {
            font: 'Ghost',
            horizontalLayout: 'default',
            verticalLayout: 'default',
            width: 80,
            whitespaceBreak: true
        }));
        console.log(`\r\nRun ${chalk.cyan(`roc <command> --help`)} show details\r\n`)
    })

program.parse(process.argv)
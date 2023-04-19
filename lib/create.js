const path = require('path')
const fs = require('fs-extra')
const ora = require('ora')
const chalk = require('chalk')
const symbol = require('log-symbols')
const inquirer = require('inquirer')
const clone = require('./clone.js')
const shell = require('shelljs')
const configJson = require('./config.json')

const remote = configJson.remote
const registry = configJson.registry
let branch = configJson.branch


module.exports = async function (name, options) {
    const cwd = process.cwd()
    const target = path.join(cwd, name)
    
    if (!shell.which('git')) {
        console.log(symbol.error, 'Git command error')
        shell.exit(1)
    }

    if (name.match(/[^A-Za-z0-9\u4e00-\u9fa5_-]/g)) {
        console.log(symbol.error, 'The project name contains illegal characters.');
        return;
    }
    
    if (fs.existsSync(target)) {
        if (options.force) {
            await fs.remove(target)
        } else {
            const inquirerParams = [{
                name: 'action',
                type: 'list',
                message:'The target file directory already exists.\nPlease choose the following operation:',
                choices: [
                    { name: 'Remove', value: 'remove' },
                    {name:'Cancel',value:'cancel'}
                ]
            }]
            
            let inquirerData = await inquirer.prompt(inquirerParams);
            if (!inquirerData.action) {
                return;
            } else if (inquirerData.action === 'remove') {
                console.log(`\r\nRemoving...`)
                await fs.remove(target)
            } else if (inquirerData.action === 'cancel') {
                return false
            }
        }
    }


    await clone(`direct:${remote}#${branch}`, name, {
        clone: true
    })

    let questions = [
        {
            type: 'input',
            message: `Please input program name: ${name}`,
            name: 'name',
            validate(val) {
                if (val.match(/[^A-Za-z0-9\u4e00-\u9fa5_-]/g)) {
                    return 'Error:The project name contains illegal characters.'
                }
                return true;
            }
        },
        {
            type: 'input',
            message: 'Please input keywords(separate with commas):',
            name: 'keywords'
        },
        {
            type: 'input',
            message: 'Please input description:',
            name: 'description'
        },
        {
            type: 'input',
            message: 'Please input author name:',
            name: 'author'
        }
    ]

    let confirm = await inquirer.prompt([{
        type: 'confirm',
        message: 'Are you sure to configure package.json?:',
        default: 'Y',
        name: 'isConfirm'
    }])

    if (!confirm.isConfirm)
        return false

    let jsonData = fs.readFileSync(`./${name}/package.json`, (err, data) => {
        console.log('Reading file', err, data)
    })

    jsonData = JSON.parse(jsonData)
    Object.keys(answers).forEach(item => {
        if (item === name) {
            jsonData[item] = answers[item] && answers[item].trim() ? answers[item] : name
        } else if (answers[item] && answers[item].trim()) {
            jsonData[item] = answers[item]
        }
    })

    console.log('package.json:\n', jsonData)



    let obj = JSON.stringify(jsonData, null, '\t')
    fs.writeSync(`./${name}/package.json`, obj, function (err, data) {
        console.log('Writing file', err, data);
    })

    if (shell.exec(`cd ${shell.pwd()}/${name} && git init`).code !== 0) {
        console.log(symbol.error, chalk.red('Failed to init git'));
        shell.exit(1)
    }

    const installSpinner = ora('Installing dependencies').start();
    if (shell.exec(`cd ${shell.pwd()}/${name} && npm config set registry ${registry} && npm install -d`).code !== 0) {
        console.log(symbol.error, chalk.yellow('Failed to install dependencies'));
        shell.exit(1)
    }
    installSpinner.succeed(chalk.green('Installed dependencies successfully.'))
    installSpinner.succeed(chalk.green('Success'))
    shell.exit(1)
}
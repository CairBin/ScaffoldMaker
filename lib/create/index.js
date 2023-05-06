const path = require('path')
const fs = require('fs-extra')
const ora = require('ora')
const chalk = require('chalk')
const symbol = require('log-symbols')
const inquirer = require('inquirer')
const shell = require('shelljs')

//utils
const clone = require('../../utils/clone/index.js')
const copy = require('../../utils/copy/index.js')
const check = require('./../../utils/check/index.js')

//config
const config = require('./../../config/config.json')
const { localTmpMap,remoteTmpMap,mapToChoice, npmMirrorMap } = require('./../../config/load.js')

let target = ''
let tmpObj = {
    method: 'remote',
    tmpName: 'ExpressTemplate',
    registry: config.npm.registry,
    remote: '',
    disableGit:false
}

const forceParam = async (force)=>{
    if (fs.existsSync(target)) {
        if (force) {
            fs.removeSync(target)
        } else {
            const inquirerParams = [{
                name: 'action',
                type: 'list',
                message: 'The target file directory already exists.\nPlease choose the following operation:',
                choices: [
                    { name: 'Remove', value: 'remove' },
                    { name: 'Cancel', value: 'cancel' }
                ]
            }]

            let inquirerData = await inquirer.prompt(inquirerParams)
            if (!inquirerData.action) {
                return;
            } else if (inquirerData.action === 'remove') {
                console.log(`\r\nRemoving...`)
                fs.removeSync(target)
            } else if (inquirerData.action === 'cancel') {
                shell.exit(1)
            }
        }
    }
}

const selector = async (message,mapper,callback) => {
    var sel = await inquirer.prompt([{
        name: 'action',
        type: 'list',
        message: message,
        choices:mapToChoice(mapper)
    }])

    await callback(sel.action)
}

const confirmer = async (message, callback) => {
    let myconfirm = await inquirer.prompt([{
        type: 'confirm',
        message: message,
        default: 'N',
        name: 'confirm'
    }])

    callback && await callback(myconfirm.confirm)
}

const selRemote = (obj) => {
    if (tmpObj.disableGit)
        tmpObj.remote = `direct:${obj.zip}`
    else
        tmpObj.remote = `direct:${obj.clone}`
}

const localParam = async (local) => {
    if (local)
    {
        tmpObj.method = 'local'
        await selector('Please select a local template:', localTmpMap, async (res) => {
            if (!res)
                shell.exit(1)
            else
                tmpObj.tmpName = res
        })

        return
    } 
    

    var selMethod = await inquirer.prompt([{
        name:'action',
        type: 'list',
        message: 'Please select a method to obtain template:',
        choices:[{name:'Local',value:'local'},{name:'Remote',value:'remote'}]
    }])

    if (selMethod.action === 'remote') {
        tmpObj.method = 'remote'
        await selector('Please select a remote template', remoteTmpMap, async (res) => {
            if (!res)
                shell.exit(1)
            else {
                if (res.mirrors === undefined || res.mirrors === {}) {
                    console.log(symbol.info, 'no git repository for this template')
                    selRemote(res)
                } else {
                    
                    await confirmer('Do you want to use mirror for this template?', async (cof) => {
                        if (cof) {
                            var mirrorMap = new Map(Object.entries(res.mirrors))
                            await selector('Please select a mirror of the template:', mirrorMap, async (m) => {
                                selRemote(m)
                            })
                        } else
                            selRemote(res)
                    })
                }
            }
        })
    } else {
        tmpObj.method = 'local'
        await selector('Please select a local template:', localTmpMap, async (res) => {
            if (!res)
                shell.exit(1)
            else
                tmpObj.tmpName = res
        })
    }
}

const handleOptions = async (options)=>{
    await forceParam(options.force)
    await localParam(options.local)
}

const npmSettings = async () => {
    await confirmer('Do you want to use a mirror of npm?', async (res) => {
        if (res) {
            await selector('Please select a mirror for npm:', npmMirrorMap, async (m) => {
                tmpObj.registry = m
            })
        }
    })
}

const getLocalTmp = async (tmpName) => {
    let tmpPath = path.join(__dirname, `../../template/${tmpName}`)
    if (!fs.existsSync(tmpPath)) {
        console.log(symbol.error, 'cannot find the local template')
        shell.exit(1)
    }

    if (!fs.existsSync(tmpPath + '/package.json')) {
        console.log(symbol.error, 'cannot find package.json from template folder')
        shell.exit(1)
    }

    fs.mkdir(target)
    copy.copyFolder(tmpPath, target, (err) => {
        if (err) {
            console.log(symbol.error, err)
            if (fs.accessSync(target))
                fs.removeSync(target)
            shell.exit(1)
        }
    })
}

const getRemoteTmp = async (name) => {
    await clone(tmpObj.remote, name, tmpObj.disableGit?{extract:true}:{clone:true})
}

const downloadTmp = async (name) => {
    if (tmpObj.method === 'remote') {
        await getRemoteTmp(name)
    } else if (tmpObj.method === 'local') {
        //console.log(symbol.info, tmpObj.method)
        await getLocalTmp(tmpObj.tmpName)
    }
}

const initPrj = async (name) => {
    let questions = [
        {
            type: 'input',
            message: `Please input project name: ${name}`,
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
    let answers = await inquirer.prompt(questions)
    console.log('--------------------------')
    console.log(answers)
    let confirm = await inquirer.prompt([{
        type: 'confirm',
        message: 'Are you sure to configure package.json?:',
        default: 'Y',
        name: 'isConfirm'
    }])

    if (!confirm.isConfirm)
    {
        console.log(symbol.success, chalk.green('Success'))
        return
    }

    let jsonData = fs.readFileSync(`./${name}/package.json`, (err, data) => {
        console.log('Reading file', err, data)
    })

    jsonData = JSON.parse(jsonData)
    Object.keys(answers).forEach(item => {
        if (item === 'name') {
            jsonData[item] = answers[item] && answers[item].trim() ? answers[item] : name
        } else if (answers[item] && answers[item].trim()) {
            jsonData[item] = answers[item]
        }
    })

    console.log('package.json:\n', jsonData)

    let obj = JSON.stringify(jsonData, null, '\t')
    fs.writeFileSync(`./${name}/package.json`, obj, function (err, data) {
        console.log('Writing file', err, data);
    })

}

const installDependencies = async (name) => {
    await confirmer('Do you want to install dependencies for the project?', async (res) => {
        if (res) {
            if (tmpObj.disableGit == false) {
                if (shell.exec(`cd ${shell.pwd()}/${name} && git init`).code !== 0) {
                    console.log(symbol.error, chalk.red('Failed to init git'));
                    shell.exit(1)
                }
            }

            const installSpinner = ora('Installing dependencies').start();
            if (shell.exec(`cd ${shell.pwd()}/${name} && npm config set registry ${tmpObj.registry} && npm install -d`).code !== 0) {
                console.log(symbol.error, chalk.yellow('Failed to install dependencies'));
                shell.exit(1)
            }
            installSpinner.succeed(chalk.green('Installed dependencies successfully.'))
        }
    })
}

module.exports = async function (name, options) {
    check.disableGit(() => {
        console.log(symbol.warning, 'cannot find git command')
        tmpObj.disableGit = true
    })
    check.illegalName(name, () => {
        console.log(symbol.error, 'The project name contains illegal characters.')
        shell.exit(1)
    })
    target = path.join(process.cwd(), name)

    
    await handleOptions(options)
    await npmSettings()
    await downloadTmp(name)
    await initPrj(name)
    await installDependencies(name)

    console.log(symbol.success,chalk.green('Success'))
    shell.exit(1)
}
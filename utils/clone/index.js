const download = require('download-git-repo')
const ora = require('ora')
const chalk = require('chalk')
const logSymbols = require('log-symbols')

module.exports = function (remote, name, option) {
    const cloneSpinner = ora('Pulling…').start();
    return new Promise((resolve, reject) => {
        download(remote, name, option, err => {
            if (err) {
                cloneSpinner.fail();
                console.log(logSymbols.error, chalk.red(err));
                reject(err)
                return
            }
            cloneSpinner.succeed(chalk.green('Success'))
            resolve();
        })
    })
}

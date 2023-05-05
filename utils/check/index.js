const symbol = require('log-symbols')
const shell = require('shelljs')
const illegalName = (name,callback) => {
    if (name.match(/[^A-Za-z0-9\u4e00-\u9fa5_-]/g)) {
        callback && callback()
    }
}

const disableGit = (callback) => {
    if (!shell.which('git')) {
        callback && callback()
    }
}

module.exports = {
    illegalName,
    disableGit
}
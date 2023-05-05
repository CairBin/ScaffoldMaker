const fs = require('fs')
const path = require('path')
const symbol = require('log-symbols')
const shell = require('shelljs')

const config = require('./config.json')

const remoteTmpMap = new Map(Object.entries(config.templates.remote))
const localTmpMap = new Map(Object.entries(config.templates.local))
const npmMirrorMap = new Map(Object.entries(config.npm.mirrors))

const mapToChoice = (mapper) => {
    var choicesArray = []
    mapper.forEach((val, key, map) => {
        var item = {
            name: key,
            value:val
        }
        choicesArray.push(item)
    })

    return choicesArray
}

module.exports = {
    remoteTmpMap,
    localTmpMap,
    npmMirrorMap,
    mapToChoice
}
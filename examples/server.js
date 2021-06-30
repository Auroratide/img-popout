const path = require('path')
const sirv = require('sirv')

module.exports = sirv(path.join(__dirname, 'public'))

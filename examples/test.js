const micro = require('micro')
const listen = require('test-listen')
const service = require('./server')
const {
    openBrowser,
    closeBrowser,
    goto,
    text,
    setConfig,
    waitFor,
} = require('taiko')

const assert = require('assert').strict

describe('test', function() {
    this.timeout(10000)
    let server
    let url

    before(async () => {
        setConfig({
            retryTimeout: 1000
        })

        server = micro(service)
        url = await listen(server)
        
        await openBrowser()
    })

    it('works', async () => {
        await goto(url)
        assert.ok(await text('Hello World').exists(), 'Expected to see text but couldn\'t find it')
    })

    after(async () => {
        await closeBrowser()
        server.close()
    })
})

const micro = require('micro')
const listen = require('test-listen')
const service = require('./server')
const {
    openBrowser,
    closeBrowser,
    goto,
    image,
    setConfig,
    click,
    press,
} = require('taiko')

const assert = require('assert').strict

describe('tests', function() {
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

    it('standard usage', async () => {
        await goto(url)

        assert.ok(await image('Fruit').isVisible(), 'Could not find Fruit image')
        assert.ok(!(await image('Fruit (enlarged)').isVisible()), 'Enlarged Fruit image should not be visible')

        await click(image('Fruit'))
        assert.ok(await image('Fruit (enlarged)').isVisible(), 'Could not find Enlarged Fruit image')

        await click(image('Fruit (enlarged)'))
        assert.ok(!(await image('Fruit (enlarged)').isVisible()), 'Enlarged Fruit image should not be visible')
    })

    it('different images', async () => {
        await goto(url)

        assert.ok(await image('Fruit Small').isVisible(), 'Could not find Fruit image')
        assert.ok(!(await image('Fruit Small (enlarged)').isVisible()), 'Enlarged Fruit image should not be visible')

        await click(image('Fruit Small'))
        assert.ok(await image('Fruit Small (enlarged)').isVisible(), 'Could not find Enlarged Fruit image')

        await click(image('Fruit Small (enlarged)'))
        assert.ok(!(await image('Fruit Small (enlarged)').isVisible()), 'Enlarged Fruit image should not be visible')
    })

    it('keyboard usage', async () => {
        await goto(url)

        assert.ok(await image('Fruit').isVisible(), 'Could not find Fruit image')
        assert.ok(!(await image('Fruit (enlarged)').isVisible()), 'Enlarged Fruit image should not be visible')

        await click(image('Fruit'))
        assert.ok(await image('Fruit (enlarged)').isVisible(), 'Could not find Enlarged Fruit image')

        await press('Escape')
        assert.ok(!(await image('Fruit (enlarged)').isVisible()), 'Enlarged Fruit image should not be visible')
    })

    after(async () => {
        await closeBrowser()
        server.close()
    })
})

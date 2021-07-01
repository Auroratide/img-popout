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
    waitFor,
    $,
    evaluate,
} = require('taiko')

const assert = require('assert').strict

describe('tests', function() {
    this.timeout(10000)
    let server
    let url
    const endpoint = (e) => url + e

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
        await waitFor(async () => !(await image('Fruit (enlarged)').isVisible()))
        assert.ok(!(await image('Fruit (enlarged)').isVisible()), 'Enlarged Fruit image should not be visible')
    })

    it('different images', async () => {
        await goto(url)

        assert.ok(await image('Fruit Small').isVisible(), 'Could not find Fruit image')
        assert.ok(!(await image('Fruit Small (enlarged)').isVisible()), 'Enlarged Fruit image should not be visible')

        await click(image('Fruit Small'))
        assert.ok(await image('Fruit Small (enlarged)').isVisible(), 'Could not find Enlarged Fruit image')

        await click(image('Fruit Small (enlarged)'))
        await waitFor(async () => !(await image('Fruit Small (enlarged)').isVisible()))
        assert.ok(!(await image('Fruit Small (enlarged)').isVisible()), 'Enlarged Fruit image should not be visible')
    })

    it('keyboard usage', async () => {
        await goto(url)

        assert.ok(await image('Fruit').isVisible(), 'Could not find Fruit image')
        assert.ok(!(await image('Fruit (enlarged)').isVisible()), 'Enlarged Fruit image should not be visible')

        await click(image('Fruit'))
        assert.ok(await image('Fruit (enlarged)').isVisible(), 'Could not find Enlarged Fruit image')

        await press('Escape')
        await waitFor(async () => !(await image('Fruit (enlarged)').isVisible()))
        assert.ok(!(await image('Fruit (enlarged)').isVisible()), 'Enlarged Fruit image should not be visible')
    })

    describe('edge cases', () => {
        it('originally empty', async () => {
            await goto(endpoint('/edge-cases'))
            const alt = 'Originally Empty'

            await click('Add Image')

            assert.ok(await image(alt).isVisible(), `Could not find ${alt} image`)
            assert.ok(!(await image(`${alt} (enlarged)`).isVisible()), `Enlarged ${alt} image should not be visible`)

            await click(image(alt))
            assert.ok(await image(`${alt} (enlarged)`).isVisible(), `Could not find Enlarged ${alt} image`)
        })

        it('replacing the image', async () => {
            await goto(endpoint('/edge-cases'))

            await click(image('Original'))
            assert.ok(await image('Original (enlarged)').isVisible(), `Could not find Enlarged Original image`)
            await click(image('Original (enlarged)'))

            await click('Replace Image')
            assert.ok(await image('Replaced').isVisible(), 'Could not find Replaced image')

            await click(image('Replaced'))
            assert.ok(await image('Replaced (enlarged)').isVisible(), 'Could not find Replaced Changed image')
        })
    })

    after(async () => {
        await closeBrowser()
        server.close()
    })
})

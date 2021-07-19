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

    describe('standard cases', () => {
        beforeEach(async () => {
            await goto(endpoint('/'))
        })

        it('standard usage', async () => {
            const section = new Section('Standard Usage')

            await section.image.assertVisible()
            await section.cover.assertHidden()

            await section.image.click()
            await section.cover.assertVisible()

            await section.cover.click()
            await section.cover.assertHidden()
        })
    
        it('different images', async () => {
            const section = new CustomPoppedOutSection('Different Images', 'other')

            await section.image.assertVisible()
            await section.cover.assertHidden()

            await section.image.click()
            await section.cover.assertVisible()

            await section.cover.click()
            await section.cover.assertHidden()
        })
    
        it('keyboard usage', async () => {
            await press('Tab')
            await press('Enter')
            assert.ok(await image('Standard Usage (enlarged)').isVisible(), 'Could not find Enlarged Fruit image')
    
            // Entering again closes the model
            await press('Enter')
            await waitFor(async () => !(await image('Standard Usage (enlarged)').isVisible()))
            assert.ok(!(await image('Standard Usage (enlarged)').isVisible()), 'Enlarged Fruit image should not be visible')
    
            // Escape also closes the model
            await press('Enter')
            assert.ok(await image('Standard Usage (enlarged)').isVisible(), 'Could not find Enlarged Fruit image')
            await press('Escape')
            await waitFor(async () => !(await image('Standard Usage (enlarged)').isVisible()))
            assert.ok(!(await image('Standard Usage (enlarged)').isVisible()), 'Enlarged Fruit image should not be visible')
    
            // Tabbing is trapped in the dialog
            await press('Enter')
            assert.ok(await image('Standard Usage (enlarged)').isVisible(), 'Could not find Enlarged Fruit image')
            await press('Tab')
            await press('Enter')
            await waitFor(async () => !(await image('Standard Usage (enlarged)').isVisible()))
            assert.ok(!(await image('Standard Usage (enlarged)').isVisible()), 'Enlarged Fruit image should not be visible')
        })
    
        it('custom transitions', async () => {
            await click(image('Custom Transitions'))
            assert.ok(await image('Custom Transitions (enlarged)').isVisible(), 'Could not find Enlarged Custom Transitions image')
            
            await click(image('Custom Transitions (enlarged)'))
            assert.ok(await image('Custom Transitions (enlarged)').isVisible(), 'Enlarged Custom Transitions image should be fading out, but is gone')
    
            await waitFor(async () => !(await image('Custom Transitions (enlarged)').isVisible()))
            assert.ok(!(await image('Custom Transitions (enlarged)').isVisible()), 'Enlarged Custom Transitions image should not be visible')
        })
    })

    describe('edge cases', () => {
        beforeEach(async () => {
            await goto(endpoint('/edge-cases'))
        })

        it('originally empty', async () => {
            const alt = 'Originally Empty'

            await click('Add Image')

            assert.ok(await image(alt).isVisible(), `Could not find ${alt} image`)
            assert.ok(!(await image(`${alt} (enlarged)`).isVisible()), `Enlarged ${alt} image should not be visible`)

            await click(image(alt))
            assert.ok(await image(`${alt} (enlarged)`).isVisible(), `Could not find Enlarged ${alt} image`)
        })

        it('replacing the image', async () => {
            await click(image('Original'))
            assert.ok(await image('Original (enlarged)').isVisible(), `Could not find Enlarged Original image`)
            await click(image('Original (enlarged)'))

            await click('Replace Image')
            assert.ok(await image('Replaced').isVisible(), 'Could not find Replaced image')

            await click(image('Replaced'))
            assert.ok(await image('Replaced (enlarged)').isVisible(), 'Could not find Replaced Changed image')
        })

        it('changing the image', async () => {
            assert.ok(await image('Unchanged').isVisible(), 'Could not find Unchanged image')

            await click('Change Image')
            assert.ok(await image('Changed').isVisible(), 'Could not find Changed image')

            await click(image('Changed'))
            assert.ok(await image('Changed (enlarged)').isVisible(), `Could not find Enlarged Changed image`)
        })

        it('multiple images', async () => {
            await click(image('Multiple Large'))
            assert.ok(await image('Multiple Large (enlarged)').isVisible(), 'Could not find Enlarged Multiple Large image')

            await click(image('Multiple Large (enlarged)'))
            await waitFor(async () => !(await image('Multiple Large (enlarged)').isVisible()))

            await click(image('Multiple Small'))
            assert.ok(await image('Multiple Large (enlarged)').isVisible(), 'Could not find Enlarged Multiple Large image')
        })
    })

    after(async () => {
        await closeBrowser()
        server.close()
    })
})

class Section {
    constructor(name) {
        this.name = name
    }

    get image() {
        return new SectionElement(`${this.name} (image)`, image(this.name))
    }

    get cover() {
        return new SectionElement(`${this.name} (cover)`, image(`${this.name} (enlarged)`))
    }
}

class CustomPoppedOutSection extends Section {
    constructor(name, poppedOutLabel) {
        super(name)
        this.poppedOutLabel = poppedOutLabel
    }

    get cover() {
        return new SectionElement(`${this.name} (cover)`, image(`${this.name} (${this.poppedOutLabel})`))
    }
}

class SectionElement {
    constructor(name, selector) {
        this.name = name
        this.selector = selector
    }

    async assertVisible() {
        assert.ok(await this.selector.isVisible(), `Could not find '${this.name}'`)
    }

    async assertHidden() {
        try {
            await waitFor(async () => !(await this.selector.isVisible()))
        } catch (e) {}
        assert.ok(!(await this.selector.isVisible()), `'${this.name}' should not be visible`)
    }

    async click() {
        await click(this.selector)
    }
}
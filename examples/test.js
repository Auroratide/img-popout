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
            const section = new Section('Standard Usage')

            await press('Tab')
            await press('Enter')
            await section.cover.assertVisible()
    
            // Entering again closes the model
            await press('Enter')
            await section.cover.assertHidden()
    
            // Escape also closes the model
            await press('Enter')
            await section.cover.assertVisible()
            await press('Escape')
            await section.cover.assertHidden()
    
            // Tabbing is trapped in the dialog
            await press('Enter')
            await section.cover.assertVisible()
            await press('Tab')
            await press('Enter')
            await section.cover.assertHidden()
        })
    
        it('custom transitions', async () => {
            const section = new Section('Custom Transitions')

            await section.image.click()
            await section.cover.assertVisible()

            await section.cover.click()
            // Should be fading out first
            await section.cover.assertVisible()
            await section.cover.assertHidden()
        })
    })

    describe('edge cases', () => {
        beforeEach(async () => {
            await goto(endpoint('/edge-cases'))
        })

        it('originally empty', async () => {
            const section = new (class extends Section {
                constructor() { super('Originally Empty') }

                async addImage() { await click('Add Image') }
            })

            await section.addImage()

            await section.image.assertVisible()
            await section.cover.assertHidden()

            await section.image.click()
            await section.cover.assertVisible()
        })

        it('replacing the image', async () => {
            let section = new (class extends Section {
                constructor() { super('Replacing the Image') }

                async replaceImage() {
                    await click('Replace Image')
                    return new Section('Replacing the Image (replaced)')
                }
            })

            await section.image.click()
            await section.cover.assertVisible()
            await section.cover.click()
            await section.cover.assertHidden()

            section = await section.replaceImage()

            await section.image.click()
            await section.cover.assertVisible()
            await section.cover.click()
            await section.cover.assertHidden()
        })

        it('changing the image', async () => {
            let section = new (class extends Section {
                constructor() { super('Changing the Image') }

                async changeImage() {
                    await click('Change Image')
                    return new Section('Changing the Image (changed)')
                }
            })

            await section.image.click()
            await section.cover.assertVisible()
            await section.cover.click()
            await section.cover.assertHidden()

            section = await section.changeImage()

            await section.image.click()
            await section.cover.assertVisible()
            await section.cover.click()
            await section.cover.assertHidden()
        })

        it('multiple images', async () => {
            const section = new (class extends Section {
                constructor() { super('Multiple Images') }

                get otherImage() {
                    return new SectionElement(`${this.name} (other image)`, image(`${this.name} (other)`))
                }
            })

            await section.image.click()
            await section.cover.assertVisible()
            await section.cover.click()
            await section.cover.assertHidden()

            await section.otherImage.click()
            await section.cover.assertVisible()
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
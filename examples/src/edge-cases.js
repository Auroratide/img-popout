require('./_global')

document.querySelector('#originally-empty button').onclick = () => {
    document.querySelector('#originally-empty img-popout').innerHTML = '<img src="assets/fruit.png" alt="Originally Empty" />'
}

document.querySelector('#replacing-the-image button').onclick = () => {
    const toReplace = document.querySelector('#replacing-the-image .to-replace')
    if (toReplace) {
        document.querySelector('#replacing-the-image img-popout').removeChild(toReplace)
        const newImage = document.createElement('img')
        newImage.src = 'assets/fruit.png'
        newImage.alt = 'Replacing the Image (replaced)'
        document.querySelector('#replacing-the-image img-popout').append(newImage)
        document.querySelector('#replacing-the-image').title = 'Replacing the Image (replaced)'
    }
}

document.querySelector('#changing-the-image button').onclick = () => {
    const toChange = document.querySelector('#changing-the-image img:first-child')
    toChange.src = 'assets/fruit.png'
    toChange.alt = 'Changing the Image (changed)'
    document.querySelector('#changing-the-image').title = 'Changing the Image (changed)'
}

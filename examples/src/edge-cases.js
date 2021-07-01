document.querySelector('#originally-empty button').onclick = () => {
    document.querySelector('#originally-empty img-popout').innerHTML = '<img src="assets/fruit.png" alt="Originally Empty" />'
}

document.querySelector('#replacing-the-image button').onclick = () => {
    const toReplace = document.querySelector('#replacing-the-image .to-replace')
    if (toReplace) {
        document.querySelector('#replacing-the-image img-popout').removeChild(toReplace)
        const newImage = document.createElement('img')
        newImage.src = 'assets/fruit.png'
        newImage.alt = 'Replaced'
        document.querySelector('#replacing-the-image img-popout').append(newImage)
    }
}

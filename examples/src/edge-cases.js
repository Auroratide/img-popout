document.querySelector('#originally-empty button').onclick = () => {
    document.querySelector('#originally-empty img-popout').innerHTML = '<img src="assets/fruit.png" alt="Originally Empty" />'
}

document.querySelector('#changing-the-image button').onclick = () => {
    document.querySelector('#changing-the-image img-popout').innerHTML = '<img src="assets/fruit.png" alt="Changed" />'
}
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

document.querySelector('#changing-the-image button').onclick = () => {
    const toChange = document.querySelector('#changing-the-image img:first-child')
    toChange.src = 'assets/fruit.png'
    toChange.alt = 'Changed'
}

},{}]},{},[1]);

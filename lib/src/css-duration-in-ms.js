export default (cssValue) => {
    if (!cssValue) return 0
    
    let duration = parseFloat(cssValue)
    if (isNaN(duration)) return 0

    const unitMatch = cssValue.match(/(ms|s)$/)
    if (unitMatch && unitMatch[0] === 's')
        duration *= 1000

    return duration
}

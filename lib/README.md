# img-popout

[![npm package](https://img.shields.io/npm/v/@auroratide/img-popout.svg)](https://www.npmjs.com/package/@auroratide/img-popout)

`img-popout` is a web component for letting users zoom in on a small image to see more details! Clicking on the image gives the user a full-screen view, somewhat modal-style.

![Demo](lib/demo.gif)

## Installation

```
npm install @auroratide/img-popout
```

And in your unbundled code, make sure to import the following:

```
import '@auroratide/img-popout'
```

## Usage

```html
<img-popout>
    <img src="my-image.png" alt="My Image" />
</img-popout>
```

That's basically it!

**But what if I want the popped-out image to be different?**

There's good reason to do this. Perhaps you want a small version to show the user first, and only show the larger, detailed version when desired. In this case, you can use a slot:

```html
<img-popout>
    <img src="small.png" alt="My Image" />
    <img slot="popped-out" src="big.png" loading="lazy" alt="My Image" />
</img-popout>
```

## Customization

At the moment, there's one variable available to customize:

| Variable | Description | Default |
| -------- | ----------- | ------- |
| `--img-popout_bg` | Background for the image when it pops out | `rgba(0, 0, 0, 0.8)` |

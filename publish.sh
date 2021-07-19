#!/bin/bash

npm run clean
npm run build
npm t
npm publish --workspace lib --access=public

import * as path from 'path'
import html from 'rollup-plugin-html'
import css from 'rollup-plugin-css-only'
import { terser } from 'rollup-plugin-terser'

export default {
    input: path.join(__dirname, 'src/index.js'),
    output: {
        sourcemap: true,
        format: 'iife',
        name: 'lib',
        file: path.join(__dirname, 'dist', 'index.js'),
    },
    plugins: [
        html({
            htmlMinifierOptions: {
                collapseWhitespace: true,
                collapseBooleanAttributes: true,
                conservativeCollapse: true,
                minifyJS: true,
            },
        }),

        css({
            output: false,
        }),

        terser()
    ],
}

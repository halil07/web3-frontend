import Ts from 'rollup-plugin-typescript2'
import scss from 'rollup-plugin-scss'

export default {
    input: [
        'src/index.ts',
    ],
    output: {
        dir: 'dist',
        format: 'esm',
        sourcemap: true,
        compact: true
    },
    plugins: [ Ts(), scss() ],
    preserveModules: true,
    external: ['react']
}

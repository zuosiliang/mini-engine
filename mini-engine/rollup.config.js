import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { babel } from '@rollup/plugin-babel';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/mini-engine.cjs.js',
      format: 'cjs', // CommonJS format
      name: 'MyLibrary'
    },
    {
      file: 'dist/mini-engine.esm.js',
      format: 'esm', // ES module format
      name: 'MyLibrary'
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
    babel({ babelHelpers: 'bundled' })
  ]
};

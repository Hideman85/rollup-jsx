import {getBabelInputPlugin} from '@rollup/plugin-babel'
import {nodeResolve} from '@rollup/plugin-node-resolve'
import ignore from 'rollup-plugin-ignore'
import commonjs from '@rollup/plugin-commonjs'
import jsx from 'acorn-jsx'
import progress from 'rollup-plugin-progress'

import path from 'path'
import fs from 'fs'
import rimraf from 'rimraf'

const buildDir = path.resolve(`${__dirname}/build`)
if (fs.existsSync(buildDir)) {
  rimraf.sync(buildDir)
}
fs.mkdirSync(buildDir)


const extensions = ['.js', '.jsx', '.ts', '.tsx', '.es6', '.es', '.mjs']

const plugins = [
  ignore(['path', 'os', 'stream', 'fs', 'module'], { commonjsBugFix: true }),
  progress(),
  nodeResolve({
    browser: true,
    dedupe: ['react', 'react-dom', 'axios', 'tslib'],
    preferBuiltins: false,
    extensions
  }),
  //  CommonJS to ESM for dependencies
  commonjs({
    include: /node_modules/,
    ignoreDynamicRequires: false,
    ignoreTryCatch: true,
    transformMixedEsModules: true
  }),
  //  Process our base code with babel
  // getBabelInputPlugin({
  //   exclude: ['node_modules'],
  //   extensions,
  //   presets: [
  //     [
  //       require.resolve('@babel/preset-env'),
  //       {
  //         shippedProposals: true,
  //         loose: true
  //       }
  //     ],
  //     // [
  //     //   require.resolve('@babel/preset-react'),
  //     //   {
  //     //     runtime: 'classic',
  //     //     useBuiltIns: true,
  //     //     development: isEnvDev
  //     //   }
  //     // ]
  //   ],
  //   plugins: [
  //     //  Syntax
  //     require.resolve('@babel/plugin-syntax-jsx')
  //   ],
  //   babelHelpers: 'bundled',
  //   skipPreflightCheck: true
  // })
]

/** **************************************************************
 *               Dispatch the final config
 ************************************************************** */
export default {
  input: path.resolve(`${__dirname}/index.jsx`),
  output: {
    // file: `${buildDir}/app.js`,
    dir: buildDir,
    format: 'esm',
    sourcemap: true,
    inlineDynamicImports: true,
    generatedCode: 'es2015'
  },
  treeshake: true,
  // treeshake: false,
  plugins,
  acornInjectPlugins: [jsx()]
}

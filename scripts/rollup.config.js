const resolve = require('rollup-plugin-node-resolve');
const { uglify } = require('rollup-plugin-uglify')
const babel = require('rollup-plugin-babel');

module.exports = {
  inputOpt: {
    input: 'Calendar.js',
    plugins: [
      resolve(),
      babel({
        presets: [['@babel/preset-env', { modules: false }]],
        runtimeHelpers: true,
        externalHelpers: true
      }),
      uglify({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true
        }
      })
    ]
  },
  outputOpt: {
    file: 'Calendar.min.js',
    format: 'umd',
    name:'Calendar'
  }
};




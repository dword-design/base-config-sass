import { spawn } from 'child-process-promise'
import withLocalTmpDir from 'with-local-tmp-dir'
import outputFiles from 'output-files'
import packageConfig from '../package.config'
import sortPackageJson from 'sort-package-json'
import expect from 'expect'
import { readFile } from 'fs-extra'
import P from 'path'
import { endent } from '@dword-design/functions'

export default () => withLocalTmpDir(__dirname, async () => {
  await outputFiles({
    'node_modules/bar': {
      'index.js': 'module.exports = 1',
      'index.css': 'html { background: green; }',
      'package.json': JSON.stringify({ main: 'index.css' }),
    },
    'package.json': JSON.stringify(sortPackageJson({
      ...packageConfig,
      dependencies: {
        'bar': '^1.0.0',
      },
      devDependencies: {
        '@dword-design/base-config-sass': '^1.0.0',
      },
    }), undefined, 2),
    'src/index.scss': endent`
      @import '~bar';

      body {
        background: red;
      }
    `,
  })
  await spawn('base', ['build'])
  expect(await readFile(P.resolve('dist', 'index.css'), 'utf8')).toEqual(endent`
    html {
      background: green; }

    body {
      background: red; }
  ` + '\n')
})

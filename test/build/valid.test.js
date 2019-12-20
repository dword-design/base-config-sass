import { spawn } from 'child-process-promise'
import withLocalTmpDir from 'with-local-tmp-dir'
import expect from 'expect'
import outputFiles from 'output-files'
import glob from 'glob-promise'
import { endent } from '@dword-design/functions'
import { readFile } from 'fs-extra'
import P from 'path'
import sortPackageJson from 'sort-package-json'
import packageConfig from '../package.config'

export default () => withLocalTmpDir(__dirname, async () => {
  await outputFiles({
    'dist/foo.txt': 'foo',
    'package.json': JSON.stringify(sortPackageJson({
      ...packageConfig,
      devDependencies: {
        '@dword-design/base-config-css': '^1.0.0',
      },
    }), undefined, 2),
    'src/foo/test.sass': endent`
      $color: blue
      body
        color: $color
    `,
    'src/test.txt': 'foo',
    'src/index.scss': endent`
      $color: red;
      body {
        background: $color;
      }
    `,
  })
  const { stdout } = await spawn('base', ['build'], { capture: ['stdout'] })
  expect(await glob('**', { cwd: 'dist', dot: true })).toEqual([
    'foo',
    'foo/test.css',
    'index.css',
  ])
  expect(await readFile(P.resolve('dist', 'foo', 'test.css'), 'utf8')).toEqual(endent`
    body {
      color: blue; }
  ` + '\n')
  expect(await readFile(P.resolve('dist', 'index.css'), 'utf8')).toEqual(endent`
    body {
      background: red; }
  ` + '\n')
  expect(stdout).toMatch(new RegExp(endent`
    ^Copying config files …
    Updating README.md …
    Rendering Complete, saving \.css file\.\.\.
    Wrote CSS to .*?\/dist\/foo\/test\.css
    Rendering Complete, saving \.css file\.\.\.
    Wrote CSS to .*?\/dist\/index\.css
    Wrote 2 CSS files to .*?\/dist
    $
  `))
})

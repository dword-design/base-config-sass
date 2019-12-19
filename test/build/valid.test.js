import { spawn } from 'child-process-promise'
import withLocalTmpDir from 'with-local-tmp-dir'
import expect from 'expect'
import outputFiles from 'output-files'
import glob from 'glob-promise'
import { endent, omit } from '@dword-design/functions'
import { readFile } from 'fs-extra'
import P from 'path'
import sortPackageJson from 'sort-package-json'

export const it = () => withLocalTmpDir(__dirname, async () => {
  const { minimalPackageConfig, minimalProjectConfig } = require('@dword-design/base')
  await outputFiles({
    ...minimalProjectConfig |> omit('src/index.js'),
    'dist/foo.txt': 'foo',
    'package.json': JSON.stringify(sortPackageJson({
      ...minimalPackageConfig,
      devDependencies: {
        '@dword-design/base-config-sass': '^1.0.0',
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
    'foo/test.sass',
    'index.css',
    'index.scss',
    'test.txt',
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

export const timeout = 10000

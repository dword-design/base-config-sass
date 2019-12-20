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
        '@dword-design/base-config-sass': '^1.0.0',
      },
    }), undefined, 2),
    'src/foo/test.scss': endent`
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
    'foo/test.scss',
    'index.scss',
    'test.txt',
  ])
  expect(await readFile(P.resolve('dist', 'foo', 'test.scss'), 'utf8')).toEqual(endent`
    $color: blue
    body
      color: $color
  `)
  expect(await readFile(P.resolve('dist', 'index.scss'), 'utf8')).toEqual(endent`
    $color: red;
    body {
      background: $color;
    }
  `)
  expect(stdout).toMatch(new RegExp(endent`
    ^Copying config files …
    Updating README.md …
    Copying sass files …
    Sass files successfully copied.
    $
  `))
})

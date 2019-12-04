import { spawn } from 'child_process'
import withLocalTmpDir from 'with-local-tmp-dir'
import expect from 'expect'
import outputFiles from 'output-files'
import { minimalProjectConfig } from '@dword-design/base'
import glob from 'glob-promise'
import { endent, omit } from '@functions'
import { readFile } from 'fs'
import P from 'path'

export const it = () => withLocalTmpDir(__dirname, async () => {
  await outputFiles({
    ...minimalProjectConfig |> omit('src/index.js'),
    'dist/foo.txt': 'foo',
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
  const { stdout } = await spawn('base-sass', ['build'], { capture: ['stdout'] })
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
    package.json valid
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

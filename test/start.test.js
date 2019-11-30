import { spawn } from 'child_process'
import withLocalTmpDir from 'with-local-tmp-dir'
import expect from 'expect'
import outputFiles from 'output-files'
import resolveBin from 'resolve-bin'
import { minimalProjectConfig } from '@dword-design/base'
import glob from 'glob-promise'
import { endent, omit } from '@functions'
import { readFile, outputFile } from 'fs'
import P from 'path'
import waitForChange from 'wait-for-change'

export const it = () => withLocalTmpDir(__dirname, async () => {
  await outputFiles({
    ...minimalProjectConfig |> omit('src/index.js'),
    'dist/foo.txt': 'foo',
    'src/test.txt': 'foo',
    'src/index.scss': endent`
      $color: red;
      body {
        background: $color;
      }
    `,
  })
  const childProcess = spawn(resolveBin.sync('@dword-design/base-sass', { executable: 'base-sass' }), ['start'], { capture: ['stdout'] })
    .catch(error => {
      if (error.code === null) {
        expect(error.stdout).toMatch(new RegExp(endent`
          ^Copying config files …
          Updating README.md …
          Rendering Complete, saving \.css file\.\.\.
          Wrote CSS to .*?\/dist\/index\.css
          Wrote 1 CSS files to .*\/dist
          Rendering Complete, saving \.css file\.\.\.
          Wrote CSS to .*?\/dist/index\.css
          Wrote 1 CSS files to .*?\/dist
          $
        `))
      } else {
        throw error
      }
    })
    .childProcess
  try {
    await waitForChange(P.join('dist', 'index.css'))
    expect(await glob('**', { cwd: 'dist', dot: true })).toEqual([
      'index.css',
      'index.scss',
      'test.txt',
    ])
    expect(await readFile(P.resolve('dist', 'index.css'), 'utf8')).toEqual(endent`
      body {
        background: red; }
    ` + '\n')
    outputFile(P.join('src', 'index.scss'), endent`
      $color: green;
      body {
        background: $color;
      }
    `)
    await waitForChange(P.join('dist', 'index.css'))
    expect(await glob('**', { cwd: 'dist', dot: true })).toEqual([
      'index.css',
      'index.scss',
      'test.txt',
    ])
    expect(await readFile(P.resolve('dist', 'index.css'), 'utf8')).toEqual(endent`
      body {
        background: green; }
    ` + '\n')
  } finally {
    childProcess.kill()
  }
})
export const timeout = 10000

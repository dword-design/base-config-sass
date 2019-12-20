import { spawn } from 'child-process-promise'
import withLocalTmpDir from 'with-local-tmp-dir'
import expect from 'expect'
import outputFiles from 'output-files'
import glob from 'glob-promise'
import { endent } from '@dword-design/functions'
import { readFile, outputFile } from 'fs-extra'
import P from 'path'
import waitForChange from 'wait-for-change'
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
    'src/test.txt': 'foo',
    'src/index.scss': endent`
      $color: red;
      body {
        background: $color;
      }
    `,
  })
  const childProcess = spawn('base', ['start'], { capture: ['stdout'] })
    .catch(error => {
      if (error.code === null) {
        expect(error.stdout).toMatch(new RegExp(endent`
          ^Rendering Complete, saving \.css file\.\.\.
          Wrote CSS to .*?\/dist\/index\.css
          Wrote 1 CSS files to .*\/dist
          Rendering Complete, saving \.css file\.\.\.
          Wrote CSS to .*?\/dist\/index\.css
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
    expect(await glob('**', { cwd: 'dist', dot: true })).toEqual(['index.css'])
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
    expect(await glob('**', { cwd: 'dist', dot: true })).toEqual(['index.css'])
    expect(await readFile(P.resolve('dist', 'index.css'), 'utf8')).toEqual(endent`
      body {
        background: green; }
    ` + '\n')
  } finally {
    childProcess.kill()
  }
})

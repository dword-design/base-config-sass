import { spawn } from 'child_process'
import withLocalTmpDir from 'with-local-tmp-dir'
import expect from 'expect'
import outputFiles from 'output-files'
import resolveBin from 'resolve-bin'
import { minimalProjectConfig } from '@dword-design/base'
import glob from 'glob-promise'
import { endent } from '@functions'

export const it = () => withLocalTmpDir(__dirname, async () => {
  await outputFiles({
    ...minimalProjectConfig,
    'dist/test.txt': 'foo',
    'src/foo/test.sass': endent`
      $color: blue
      body
        color: $color
    `,
    'src/foo.txt': 'foo',
    'src/index.scss': endent`
      $color: red;
      body {
        background: $color;
      }
    `,
  })
  const { stdout } = await spawn(resolveBin.sync('@dword-design/base-sass', { executable: 'base-sass' }), ['prepare'], { capture: ['stdout'] })
  expect(await glob('**', { cwd: 'dist', dot: true })).toEqual([
    'foo',
    'foo/test.css',
    'foo/test.sass',
    'index.css',
    'index.scss',
    'test.txt',
  ])
  expect(stdout).toMatch(/^Copying config files …\nUpdating README.md …\nRendering Complete, saving \.css file\.\.\.\nWrote CSS to .*?\/dist\/foo\/test\.css\nRendering Complete, saving \.css file\.\.\.\nWrote CSS to .*?\/dist\/index\.css\nWrote 2 CSS files to .*?\/dist\n$/)
})
export const timeout = 10000

import execa from 'execa'
import withLocalTmpDir from 'with-local-tmp-dir'
import outputFiles from 'output-files'
import glob from 'glob-promise'
import { endent } from '@dword-design/functions'
import { readFile } from 'fs-extra'
import P from 'path'

export default {
  valid: () =>
    withLocalTmpDir(async () => {
      await outputFiles({
        'dist/foo.txt': 'foo',
        'package.json': JSON.stringify(
          {
            baseConfig: require.resolve('.'),
          },
          undefined,
          2
        ),
        src: {
          'foo/test.scss': endent`
          $color: blue
          body
            color: $color
        `,
          'test.txt': 'foo',
          'index.scss': endent`
          $color: red;
          body {
            background: $color;
          }
        `,
        },
      })
      await execa.command('base prepare')
      const { all } = await execa.command('base prepublishOnly', { all: true })
      expect(await glob('**', { cwd: 'dist', dot: true })).toEqual([
        'foo',
        'foo/test.scss',
        'index.scss',
        'test.txt',
      ])
      expect(await readFile(P.resolve('dist', 'foo', 'test.scss'), 'utf8'))
        .toEqual(endent`
      $color: blue
      body
        color: $color
    `)
      expect(await readFile(P.resolve('dist', 'index.scss'), 'utf8'))
        .toEqual(endent`
      $color: red;
      body {
        background: $color;
      }
    `)
      expect(all).toEqual(endent`
      Copying sass files …
      Sass files successfully copied.
    `)
    }),
}

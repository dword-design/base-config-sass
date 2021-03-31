import { endent, identity, sortBy } from '@dword-design/functions'
import execa from 'execa'
import { readFile } from 'fs-extra'
import globby from 'globby'
import outputFiles from 'output-files'
import P from 'path'
import withLocalTmpDir from 'with-local-tmp-dir'

export default {
  valid: () =>
    withLocalTmpDir(async () => {
      await outputFiles({
        'dist/foo.txt': 'foo',
        'node_modules/base-config-foo/index.js':
          "module.exports = require('../../../src')",
        'package.json': JSON.stringify(
          {
            baseConfig: 'foo',
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
          'index.scss': endent`
          $color: red;
          body {
            background: $color;
          }
        `,
          'index.spec.js': '',
          'test.txt': 'foo',
        },
      })
      await execa.command('base prepare')

      const output = await execa.command('base prepublishOnly', { all: true })
      expect(
        globby('**', { cwd: 'dist', dot: true, filesOnly: false })
          |> await
          |> sortBy(identity)
      ).toEqual(['foo/test.scss', 'index.scss', 'test.txt'])
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
      expect(output.all).toEqual(endent`
      Copying sass files …
      Sass files successfully copied.
    `)
    }),
}

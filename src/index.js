import { base } from '@dword-design/base'
import { spawn } from 'child_process'
import resolveBin from 'resolve-bin'
import glob from 'glob-promise'
import { map, promiseAll } from '@functions'
import { copyFile } from 'fs'
import P from 'path'

export default () => base({
  prepare: async () => {
    await spawn(resolveBin.sync('node-sass'), ['src', '--output', 'dist', '--importer', require.resolve('node-sass-import')], { stdio: 'inherit' })
    const sassFilenames = await glob('**/*.{scss,sass}', { cwd: 'src' })
    await sassFilenames |> map(filename => copyFile(P.resolve('src', filename), P.join('dist', filename))) |> promiseAll
  },
  start: () => spawn(resolveBin.sync('node-sass'), ['--watch', 'src', '--output', 'dist', '--importer', require.resolve('node-sass-import')], { stdio: 'inherit' }),
})

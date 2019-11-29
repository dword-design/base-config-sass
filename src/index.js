import { base } from '@dword-design/base'
import { spawn } from 'child_process'
import resolveBin from 'resolve-bin'
import { copy, remove } from 'fs'

export default () => base({
  prepare: async () => {
    await remove('dist')
    await copy('src', 'dist')
    await spawn(resolveBin.sync('node-sass'), ['src', '--output', 'dist', '--importer', require.resolve('node-sass-import')], { stdio: 'inherit' })
  },
  start: () => spawn(resolveBin.sync('node-sass'), ['--watch', 'src', '--output', 'dist', '--importer', require.resolve('node-sass-import')], { stdio: 'inherit' }),
})

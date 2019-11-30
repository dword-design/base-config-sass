import { base } from '@dword-design/base'
import { spawn } from 'child_process'
import resolveBin from 'resolve-bin'
import { copy, remove } from 'fs'
import chokidar from 'chokidar'
import debounce from 'debounce'

const prepare = async () => {
  await remove('dist')
  await copy('src', 'dist')
  await spawn(resolveBin.sync('node-sass'), ['src', '--output', 'dist', '--importer', require.resolve('node-sass-import')], { stdio: 'inherit' })
}

export default () => base({
  prepare,
  start: () => chokidar
    .watch('src')
    .on(
      'all',
      debounce(
        async () => {
          try {
            await prepare()
          } catch (error) {
            console.log(error)
          }
        },
        200
      )
    ),
})

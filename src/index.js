import { spawn } from 'child-process-promise'
import { remove } from 'fs-extra'
import chokidar from 'chokidar'
import debounce from 'debounce'
import nodeConfig from '@dword-design/base-config-node'
import { merge } from '@dword-design/functions'
import depcheckSassParser from './depcheck-sass-parser'

const build = async () => {
  await remove('dist')
  await spawn('node-sass', ['--output', 'dist', '--importer', require.resolve('./importer'), 'src'], { stdio: 'inherit' })
}

export default {
  build,
  start: () => chokidar
    .watch('src')
    .on(
      'all',
      debounce(
        async () => {
          try {
            await build()
          } catch (error) {
            console.log(error)
          }
        },
        200
      )
    ),
  depcheckConfig: nodeConfig.depcheckConfig
    |> merge({
      parsers: {
        '*.scss': depcheckSassParser,
      },
    }),
}

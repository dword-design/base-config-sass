import { remove, copy } from 'fs-extra'
import chokidar from 'chokidar'
import debounce from 'debounce'
import nodeConfig from '@dword-design/base-config-node'
import { merge } from '@dword-design/functions'
import depcheckSassParser from '@dword-design/depcheck-sass-parser'

const build = async () => {
  console.log('Copying sass files …')
  await remove('dist')
  await copy('src', 'dist')
  console.log('Sass files successfully copied.')
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

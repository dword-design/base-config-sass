import { remove, copy } from 'fs-extra'
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
  depcheckConfig: nodeConfig.depcheckConfig
    |> merge({
      parsers: {
        '*.scss': depcheckSassParser,
      },
    }),
  main: 'index.scss',
}

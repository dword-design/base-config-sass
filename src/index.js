import { remove, copy } from 'fs-extra'
import depcheckConfig from '@dword-design/depcheck-config'
import depcheckSassParser from '@dword-design/depcheck-sass-parser'

export default {
  depcheckConfig: {
    ...depcheckConfig,
    parsers: {
      ...depcheckConfig.parsers,
      '*.scss': depcheckSassParser,
    },
  },
  main: 'index.scss',
  commands: {
    prepublishOnly: async () => {
      console.log('Copying sass files …')
      await remove('dist')
      await copy('src', 'dist')
      console.log('Sass files successfully copied.')
    },
  },
}

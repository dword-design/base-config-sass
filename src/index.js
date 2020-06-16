import depcheckConfig from '@dword-design/depcheck-config'
import depcheckSassParser from '@dword-design/depcheck-sass-parser'
import prepublishOnly from './prepublish-only'

export default {
  depcheckConfig: {
    ...depcheckConfig,
    parsers: {
      ...depcheckConfig.parsers,
      '*.scss': depcheckSassParser,
    },
  },
  gitignore: ['/dist'],
  packageConfig: {
    main: 'dist/index.scss',
  },
  commands: {
    prepublishOnly,
  },
  npmPublish: true,
}

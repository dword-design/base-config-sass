import depcheckSassParser from '@dword-design/depcheck-sass-parser'

import prepublishOnly from './prepublish-only'

export default {
  commands: {
    prepublishOnly,
  },
  depcheckConfig: {
    parsers: {
      '*.scss': depcheckSassParser,
    },
  },
  editorIgnore: ['dist'],
  gitignore: ['/dist'],
  npmPublish: true,
  packageConfig: {
    main: 'dist/index.scss',
  },
}

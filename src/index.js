import depcheckParserSass from '@dword-design/depcheck-parser-sass'

import prepublishOnly from './prepublish-only.js'

export default {
  allowedMatches: ['src'],
  commands: {
    prepublishOnly,
  },
  depcheckConfig: {
    parsers: {
      '**/*.scss': depcheckParserSass,
    },
  },
  editorIgnore: ['dist'],
  gitignore: ['/dist'],
  npmPublish: true,
  packageConfig: {
    main: 'dist/index.scss',
  },
}

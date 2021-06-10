import depcheckParserSass from '@dword-design/depcheck-parser-sass'

import prepublishOnly from './prepublish-only'

export default {
  allowedMatches: ['src'],
  commands: {
    prepublishOnly,
  },
  coverageFileExtensions: ['.scss'],
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

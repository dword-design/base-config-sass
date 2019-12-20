import getPackageName from 'get-package-name'
import requirePackageName from 'require-package-name'
import importer from './importer'
import sass from 'node-sass'
import { map, uniq, compact } from '@dword-design/functions'

export default (content, filePath) => {
  const { stats } = sass.renderSync({ file: filePath, importer })

  return stats.includedFiles
    |> map(path => path[0] === '~'
      ? requirePackageName(path.substr(1))
      : getPackageName(path)
    )
    |> compact
    |> uniq
}

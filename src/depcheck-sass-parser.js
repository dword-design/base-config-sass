import getPackageName from 'get-package-name'
import importer from './importer'
import sass from 'node-sass'
import { map, uniq, unary, compact } from '@dword-design/functions'

export default (content, filePath) => {
  const { stats } = sass.renderSync({ file: filePath, importer })

  return stats.includedFiles |> map(unary(getPackageName)) |> compact |> uniq
}

import tildeImporter from 'node-sass-tilde-importer'
import jsImporter from './js-importer'

export default (url, prev) => {
  const jsResult = jsImporter(url, prev)
  return jsResult !== null ? jsResult : tildeImporter(url, prev)
}

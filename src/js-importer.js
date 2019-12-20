import jsontosass from 'jsontosass'
import resolveFrom from 'resolve-from'
import P from 'path'

export default (url, prev) => {
  if (url[0] === '~') {
    const path = resolveFrom.silent(P.dirname(prev), url.substr(1))
    if (path !== undefined && ['.js', '.json'].includes(P.extname(path))) {
      return { contents: jsontosass.convert(JSON.stringify(require(path))) }
    }
  }
  return null
}

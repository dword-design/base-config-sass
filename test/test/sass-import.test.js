import { spawn } from 'child-process-promise'
import withLocalTmpDir from 'with-local-tmp-dir'
import outputFiles from 'output-files'
import packageConfig from '../package.config'
import sortPackageJson from 'sort-package-json'

export default () => withLocalTmpDir(__dirname, async () => {
  await outputFiles({
    'node_modules/bar': {
      'index.scss': '',
      'package.json': JSON.stringify({ main: 'index.scss' }),
    },
    'package.json': JSON.stringify(sortPackageJson({
      ...packageConfig,
      dependencies: {
        'bar': '^1.0.0',
      },
      devDependencies: {
        '@dword-design/base-config-sass': '^1.0.0',
      },
    }), undefined, 2),
    'src/index.scss': '@import \'~bar\';',
  })
  await spawn('base', ['build'])
  await spawn('base', ['test'])
})
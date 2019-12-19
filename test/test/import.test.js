import { spawn } from 'child-process-promise'
import withLocalTmpDir from 'with-local-tmp-dir'
import outputFiles from 'output-files'
import { minimalPackageConfig, minimalProjectConfig } from '@dword-design/base-config-sass'
import { omit } from '@dword-design/functions'
import sortPackageJson from 'sort-package-json'
import { readFile } from 'fs-extra'

export const it = () => withLocalTmpDir(__dirname, async () => {
  await outputFiles({
    ...minimalProjectConfig |> omit('src/index.js'),
    'package.json': JSON.stringify(sortPackageJson({
      ...minimalPackageConfig,
      dependencies: {
        'foo': '^1.0.0',
      },
      devDependencies: {
        '@dword-design/base-config-sass': '^1.0.0',
      },
    }), undefined, 2),
    'src/index.scss': '@import \'foo\'',
  })
  await spawn('base', ['test'], { stdio: 'inherit' })
})

export const timeout = 10000

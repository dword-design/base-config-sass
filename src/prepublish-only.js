import { map } from '@dword-design/functions'
import fs from 'fs-extra'
import { globby } from 'globby'

export default async () => {
  console.log('Copying sass files …')
  await fs.remove('dist')
  await fs.copy('src', 'dist')
  await Promise.all(
    globby('**/*.spec.js', { absolute: true, cwd: 'dist' })
      |> await
      |> map(path => fs.remove(path)),
  )
  console.log('Sass files successfully copied.')
}

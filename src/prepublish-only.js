import { map } from '@dword-design/functions'
import { copy, remove } from 'fs-extra'
import globby from 'globby'

export default async () => {
  console.log('Copying sass files …')
  await remove('dist')
  await copy('src', 'dist')
  await Promise.all(
    globby('**/*.spec.js', { absolute: true, cwd: 'dist' })
      |> await
      |> map(path => remove(path))
  )
  console.log('Sass files successfully copied.')
}

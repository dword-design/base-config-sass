import { remove, copy } from 'fs-extra'

export default async () => {
  console.log('Copying sass files …')
  await remove('dist')
  await copy('src', 'dist')
  console.log('Sass files successfully copied.')
}

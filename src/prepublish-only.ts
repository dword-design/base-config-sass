import pathLib from 'node:path';

import type { Base } from '@dword-design/base';
import fs from 'fs-extra';
import { globby } from 'globby';

export default async function (this: Base) {
  console.log('Copying sass files …');
  await fs.remove(pathLib.join(this.cwd, 'dist'));
  await fs.copy(pathLib.join(this.cwd, 'src'), pathLib.join(this.cwd, 'dist'));

  const testPaths = await globby('**/*.spec.ts', {
    absolute: true,
    cwd: pathLib.join(this.cwd, 'dist'),
  });

  await Promise.all(testPaths.map(path => fs.remove(path)));
  console.log('Sass files successfully copied.');
}

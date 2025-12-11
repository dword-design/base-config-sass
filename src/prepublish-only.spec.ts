import pathLib from 'node:path';

import { expect, test } from '@playwright/test';
import endent from 'endent';
import { execaCommand } from 'execa';
import fs from 'fs-extra';
import { globby } from 'globby';
import outputFiles from 'output-files';

test('valid', async ({}, testInfo) => {
  const cwd = testInfo.outputPath();

  await outputFiles(cwd, {
    '.baserc': JSON.stringify('../../src'),
    'dist/foo.txt': 'foo',
    src: {
      'foo/test.scss': endent`
        $color: blue
        body
          color: $color
      `,
      'index.scss': endent`
        $color: red;
        body {
          background: $color;
        }
      `,
      'index.spec.ts': '',
      'test.txt': 'foo',
    },
  });

  await execaCommand('base prepare', { cwd });
  const output = await execaCommand('base prepublishOnly', { all: true, cwd });

  const distPaths = await globby('**', {
    cwd: pathLib.join(cwd, 'dist'),
    dot: true,
  });

  expect(Object.fromEntries(distPaths.map(path => [path, true]))).toEqual({
    'foo/test.scss': true,
    'index.scss': true,
    'test.txt': true,
  });

  expect(
    await fs.readFile(pathLib.resolve(cwd, 'dist', 'foo', 'test.scss'), 'utf8'),
  ).toEqual(endent`
    $color: blue
    body
      color: $color
  `);

  expect(await fs.readFile(pathLib.resolve(cwd, 'dist', 'index.scss'), 'utf8'))
    .toEqual(endent`
      $color: red;
      body {
        background: $color;
      }
    `);

  expect(output.all).toEqual(endent`
    Copying sass files …
    Sass files successfully copied.
  `);
});

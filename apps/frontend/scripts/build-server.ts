/* eslint-disable import-x/no-extraneous-dependencies */
import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import esbuild from 'esbuild';
import fsExtra from 'fs-extra';
import { globSync } from 'glob';
import sourceMapSupport from 'source-map-support';

sourceMapSupport.install({
  retrieveSourceMap: function (source: string) {
    // get source file without the `file://` prefix or `?t=...` suffix
    const match = source.match(/^file:\/\/(.*)\?t=[.\d]+$/);
    if (match) {
      return {
        url: source,
        map: fs.readFileSync(`${match[1]}.map`, 'utf8'),
      };
    }
    return null;
  },
});

const pkg = fsExtra.readJsonSync(path.join(process.cwd(), 'package.json'));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const here = (...s: Array<string>) => path.join(__dirname, ...s);
const globsafe = (s: string) => s.replace(/\\/g, '/');

const allFiles = globSync(globsafe(here('../server/**/*.*')), {
  ignore: ['**/tsconfig.json', '**/eslint*', '**/__tests__/**'],
});

const entries = [];
for (const file of allFiles) {
  if (/\.(ts|js|tsx|jsx)$/.test(file)) {
    entries.push(file);
  } else {
    const dest = file.replace(here('../server'), here('../server-build'));
    fsExtra.ensureDirSync(path.parse(dest).dir);
    fsExtra.copySync(file, dest);
    console.log(`copied: ${file.replace(`${here('../server')}/`, '')}`);
  }
}

console.log();
console.log('building...');

esbuild
  .build({
    entryPoints: entries,
    outdir: here('../server-build'),
    target: [`node${pkg.engines.node}`],
    platform: 'node',
    sourcemap: true,
    format: 'esm',
    logLevel: 'info',
  })
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });

import { base } from '@dword-design/base'
import { spawn } from 'child_process'

export default () => base({
  prepare: () => spawn('node-sass', ['src', '--output', 'dist'], { stdio: 'inherit' }),
  start: () => spawn('node-sass', ['--watch', 'src', '--output', 'dist'], { stdio: 'inherit' }),
})

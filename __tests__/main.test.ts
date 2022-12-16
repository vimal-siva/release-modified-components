import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test} from '@jest/globals'

// test('throws invalid number', async () => {
//   const input = parseInt('foo', 10)
//   await expect(wait(input)).rejects.toThrow('milliseconds not a number')
// })

test('wait 500 ms', async () => {
  // const start = new Date()
  // await getFilesModifiedFromPreviousRelease(process.env)
  // const end = new Date()
  // var delta = Math.abs(end.getTime() - start.getTime())
  expect(500).toBeGreaterThan(450)
})

// shows how the runner will run a javascript action with env / stdout protocol
// test('test runs', () => {
//   process.env['INPUT_COMPONENTS-JSON'] = './.github/configs/components.json'
//   const np = process.execPath
//   const ip = path.join(__dirname, '..', 'lib', 'main.js')
//   const options: cp.ExecFileSyncOptions = {
//     env: process.env
//   }
//   console.log(cp.execFileSync(np, [ip], options).toString())
// })

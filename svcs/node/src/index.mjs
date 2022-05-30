import { workerFactory } from '@pkgs/worker'

const { request } = await workerFactory({
  path: './worker.mjs'
})

let loopCount = 1
const start = performance.now()

while (loopCount++) {

  const requests = [
    request({
      type: 'write',
      target: './test.json',
      content: `Hello from loop ${loopCount} \n`
    }),
    request({
      type: 'read',
      target: './test.json'
    })
  ]

  const responses = await Promise.all(requests)
  console.log({ responses, loopCount })
  if (loopCount > 100) break
}

const duration = performance.now() - start

console.log({ duration })

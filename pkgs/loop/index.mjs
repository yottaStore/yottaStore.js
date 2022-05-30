import { parentPort } from 'node:worker_threads'
import { arenaAllocatorFactory } from '@pkgs/allocator'
import { io_uringFactory } from '@pkgs/io_uring'
import { dispatcherFactory } from '@pkgs/dispatcher'

// Setup memory allocator
const {
  allocator
} = await arenaAllocatorFactory({

})

// Setup io_uring
const {
  readRing,
  writeRing,
  notifyRing
} = await io_uringFactory({
  allocator
})

// Start listening for messages
const {
  getRequests,
  writeResponses,
  callBackMap,
  notifyDispatcher
} = await dispatcherFactory({
  parentPort
})

let shouldContinue = true
let loopCount = 0

await notifyDispatcher('Starting...')
while ( shouldContinue ) {
  loopCount++

  // Read batch of ready messages
  const responses = await readRing()
  shouldContinue = await writeResponses({ responses, callBackMap })

  // Submit batch or requests
  const requests = await getRequests({ responses, callBackMap })
  await writeRing(...requests)
  shouldContinue = await notifyRing(requests.length)
}

// Teardown
await notifyDispatcher('Closing...')
await notifyRing('Closing...')
console.log(`Performed ${loopCount} loops.`)


process.catch(() => {
  shouldContinue = false
})

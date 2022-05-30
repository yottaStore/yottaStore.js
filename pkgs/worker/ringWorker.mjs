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
  sendResponses,
  notifyDispatcher
} = await dispatcherFactory({

})

let shouldContinue = true
let loopCount = 0

await notifyDispatcher('Starting...')
while ( shouldContinue ) {
  loopCount++

  // Read batch of ready messages
  const responses = await readRing()
  shouldContinue = sendResponses({ responses })

  // Submit batch or requests
  const requests = getRequests()
  await writeRing(requests)
  shouldContinue = await notifyRing(requests.length)
}

// Teardown
await notifyDispatcher('Closing...')
await notifyRing('Closing...')
console.log(`Performed ${loopCount} loops.`)




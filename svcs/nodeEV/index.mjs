import { Worker } from 'node:worker_threads'
import { consumerFactory } from '@pkgs/consumer'

const ringWorker = new Worker('@pkgs/loop')

const { request } = await consumerFactory({
  ringWorker
})


while (true) {
  const response = await request({

  })

  console.log({ response })
}

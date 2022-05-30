import { Worker } from 'node:worker_threads'
import { EventEmitter } from 'node:events'


export const workerFactory = async ({ path }) => {

  const responseEmitter = new EventEmitter()

  const worker = new Worker(path)

  worker.onmessage = ({resp, uuid}) => {
    responseEmitter.emit(uuid, resp)
  }

  const request = ({ req }) => {
    const uuid = crypto.randomUUID() // Should be 64 bit
    worker.postMessage({
      req,
      uuid
    })
    return new Promise(res => {
      responseEmitter.once(uuid, res)
    })
  }

  return {
    request,
    worker
  }


}

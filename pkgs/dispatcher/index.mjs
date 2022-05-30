import { parentPort } from 'node:worker_threads'

export const dispatcherFactory = async ({ }) => {

  const requests = []

  parentPort.onmessage = (msg) => {
    requests.push(msg)
  }

  const getRequests = () => {
    return requests.splice(0, requests.length)
  }

  const notifyDispatcher = ({ msg }) => {
    parentPort.postMessage( msg )
  }

  const sendResponses = ({ responses }) => {
    for (const response of responses)
      parentPort.postMessage(response)

    return true
  }

  return {
    sendResponses,
    getRequests,
    notifyDispatcher
  }

}

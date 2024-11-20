import { sign } from "@kadena/spirekey-sdk"

// Listen for messages from the web app
window.addEventListener("message", (event) => {
  // Send the message to the background script
  chrome.runtime.sendMessage(event.data, async (response) => {
    // Send the background script's response back to the web app
    if (response.type == "TO_SIGN_RESPONSE") {
      console.log("handleSign")
      try {
        const { transactions, isReady } = await sign([response.signedData])
        //await isReady()
        console.log("Signed Transaction:", transactions[0])
        window.postMessage(
          {
            type: "SIGN_RESPONSE",
            errors: null,
            signedCmd: transactions[0]
          },
          event.origin
        )
      } catch (error) {
        console.error("Transaction signing failed:", error)
        throw error
      }
    } else {
      window.postMessage(
        {
          type: "FROM_EXTENSION",
          originalMessage: event.data,
          response: response
        },
        event.origin
      )
    }
  })
})

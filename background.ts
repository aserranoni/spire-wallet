console.log("HELLO")
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  //  console.log("Received message:", message)

  try {
    if (message.type === "ACCOUNT_DATA") {
      accountData = message.account
      console.log("Stored account data:", accountData)
    } else if (message.type === "CONNECT_REQUEST") {
      console.log("GOT CONNECT REQUEST")
      handleConnectRequest(sendResponse)
      return true
    } else if (message.type === "SIGN_REQUEST") {
      handleSignRequest(sendResponse)
      return true
    }
  } catch (error) {
    console.error("Error in background script:", error)
    sendResponse({ error: "Error processing request" })
  }

  return false // Closes the channel if no matching case
})

function handleConnectRequest(sendResponse) {
  try {
    console.log("Sending CONNECT_RESPONSE:", accountData)
    sendResponse({
      type: "CONNECT_RESPONSE",
      account: accountData
    })
  } catch (error) {
    console.error("Error in CONNECT_REQUEST handler:", error)
  }
}

function handleSignRequest(sendResponse) {
  try {
    setTimeout(() => {
      const signedData = "signedTransactionData"
      console.log("Sending SIGN_RESPONSE:", signedData)
      sendResponse({
        type: "SIGN_RESPONSE",
        payload: signedData
      })
    }, 1000)
  } catch (error) {
    console.error("Error in SIGN_REQUEST handler:", error)
  }
}

export {}

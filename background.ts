import { Storage } from "@plasmohq/storage"

const storage = new Storage()
let accountData: string | null = null

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    if (message.type === "ACCOUNT_DATA") {
      accountData = message.account
      console.log("Stored account data:", accountData)
      storage.set("accountData", accountData)
    } else if (message.type === "CONNECT_REQUEST") {
      console.log("Received CONNECT_REQUEST")
      handleConnectRequest(sendResponse)
      return true // Keep the channel open for async response
    } else if (message.type === "SIGN_REQUEST") {
      handleSignRequest(message, sendResponse)
      return true // Keep the channel open for async response
    }
  } catch (error) {
    console.error("Error in background script:", error)
    sendResponse({ error: "Error processing request" })
  }
  return false // Close the channel for unmatched cases
})

function handleConnectRequest(sendResponse: (response: any) => void) {
  try {
    storage.get("accountData").then((storedAccountData) => {
      sendResponse({
        type: "CONNECT_RESPONSE",
        account: storedAccountData
      })
    })
  } catch (error) {
    console.error("Error in CONNECT_REQUEST handler:", error)
    sendResponse({ error: "Error retrieving account data" })
  }
}

function handleSignRequest(
  message: any,
  sendResponse: (response: any) => void
) {
  try {
    setTimeout(() => {
      storage
        .set("signData", JSON.stringify(message.data))
        .then(() => {
          console.log("Data saved to storage:", message.data)
          sendResponse({
            type: "SIGN_RESPONSE",
            status: "success",
            savedData: message.data
          })
        })
        .catch((error) => {
          console.error("Error saving data to storage:", error)
          sendResponse({ error: "Error saving data to storage" })
        })
    }, 1000) // Simulate async delay if necessary
  } catch (error) {
    console.error("Error in SIGN_REQUEST handler:", error)
    sendResponse({ error: "Error handling sign request" })
  }
}

export {}

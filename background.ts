import signTransaction from "core/signTransaction"

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
async function handleSignRequest(message, sendResponse) {
  try {

    sendResponse({
      type: "TO_SIGN_RESPONSE",
      status: "success",
      signedData: message.data
    })
  } catch (error) {
    console.error("Error in SIGN_REQUEST handler:", error)
    sendResponse({ error: "Error handling sign request" })
  }
}

export {}

// Listen for messages from the web app
window.addEventListener("message", (event) => {
  // Send the message to the background script
  chrome.runtime.sendMessage(event.data, (response) => {
    // Send the background script's response back to the web app
    window.postMessage(
      {
        type: "FROM_EXTENSION",
        originalMessage: event.data,
        response: response
      },
      event.origin
    )
  })
})

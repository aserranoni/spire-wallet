import type { IUnsignedCommand } from "@kadena/types"
import React, { useEffect, useState } from "react"

import { Storage } from "@plasmohq/storage"

import { useWallet } from "../contexts/walletContext"
import sendKDA from "./createTransfer"

const ConnectButton: React.FC = () => {
  const {
    account,
    signData,
    connectWallet,
    disconnectWallet,
    signTransaction
  } = useWallet()

  const [storedSignData, setStoredSignData] = useState<string | null>(null)
  const [recipient, setRecipient] = useState<string>("")
  const [amount, setAmount] = useState<number | string>("")
  const [transferResult, setTransferResult] = useState<string | null>(null)
  const [signedData, setSignedData] = useState<string | null>(null)

  const storage = new Storage()

  // Fetch the signData from Plasmo storage on component mount
  useEffect(() => {
    const fetchSignData = async () => {
      try {
        const savedSignData = await storage.get<string>("signData")
        console.log("Raw savedSignData:", savedSignData)

        if (savedSignData) {
          const parsedData = JSON.parse(savedSignData) // Parse JSON string
          setStoredSignData(JSON.stringify(parsedData)) // Save the raw string or use parsed directly
        }
      } catch (error) {
        console.error("Error fetching or parsing signData:", error)
      }
    }
    fetchSignData()
  }, [])

  const handleSignTransaction = async () => {
    if (!storedSignData) {
      console.error("No stored sign data available to sign.")
      return
    }

    try {
      const cmd: IUnsignedCommand = JSON.parse(
        storedSignData
      ) as IUnsignedCommand
      console.log(cmd)
      const signed = await signTransaction(cmd) // Call the wallet's sign function
      setSignedData(signed) // Save the signed data in state
      console.log("Signed data:", signed)

      // Optionally notify the background script or app
      chrome.runtime.sendMessage(
        {
          type: "SIGNED_DATA",
          signedData: signed
        },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error(
              "Error sending SIGNED_DATA message:",
              chrome.runtime.lastError
            )
          } else {
            console.log("Signed data sent successfully:", response)
          }
        }
      )
    } catch (error) {
      console.error("Error signing stored signData:", error)
    }
  }

  const handleTransfer = async () => {
    if (!recipient || !amount || isNaN(Number(amount))) {
      setTransferResult("Please enter a valid recipient and amount.")
      return
    }

    try {
      const transferResponse = await sendKDA({
        accountFrom: account.account,
        pubkey: account.publicKey,
        accountTo: recipient,
        amount: Number(amount),
        sign: signTransaction
      })

      if (transferResponse.result.status === "success") {
        setTransferResult("Transfer successful!")
      } else {
        setTransferResult(`Transfer failed: ${transferResponse.result.error}`)
      }
    } catch (error) {
      setTransferResult(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      )
    }
  }

  const handleClearSignData = async () => {
    try {
      await storage.remove("signData") // Remove signData from storage
      setStoredSignData(null) // Update state
      setSignedData(null) // Clear signed data state as well
      console.log("Stored sign data cleared successfully.")
    } catch (error) {
      console.error("Error clearing stored sign data:", error)
    }
  }

  return (
    <div>
      {account ? (
        <div>
          <p>
            <strong>Account:</strong> {account.account || "N/A"}
          </p>
          <p>
            <strong>Balance:</strong> {account.balance || "N/A"} KDA
          </p>
          <p>
            <strong>Chain ID:</strong> {account.chainId || "N/A"}
          </p>
          <p>
            <strong>Public Key:</strong> {account.publicKey || "N/A"}
          </p>
          <p>
            <strong>Sign Data:</strong>{" "}
            {typeof signData === "object"
              ? JSON.stringify(signData, null, 2)
              : signData || "No sign data available"}
          </p>
          <p>
            <strong>Stored Sign Data:</strong>{" "}
            {typeof storedSignData === "object"
              ? JSON.stringify(storedSignData, null, 2)
              : storedSignData || "No sign data stored"}
          </p>
          <p>
            <strong>Signed Data:</strong> {signedData || "Data not signed yet"}
          </p>
          <button onClick={disconnectWallet}>Disconnect</button>
          <button
            onClick={handleSignTransaction}
            style={{ marginLeft: "10px" }}>
            Sign Transaction
          </button>
          <button onClick={handleClearSignData} style={{ marginLeft: "10px" }}>
            Clear Sign Data
          </button>

          <h3>Transfer KDA</h3>
          <div>
            <input
              type="text"
              placeholder="Recipient Account"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={handleTransfer}>Send</button>
          </div>
          {transferResult && <p>{transferResult}</p>}
        </div>
      ) : (
        <button onClick={connectWallet}>Connect</button>
      )}
    </div>
  )
}

export default ConnectButton

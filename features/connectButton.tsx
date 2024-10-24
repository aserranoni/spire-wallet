import React, { useState } from "react"

import { useWallet } from "../contexts/walletContext"
import sendKDA from "./createTransfer"

const ConnectButton: React.FC = () => {
  const { account, connectWallet, disconnectWallet, signTransaction } =
    useWallet()

  const [recipient, setRecipient] = useState<string>("")
  const [amount, setAmount] = useState<number | string>("")
  const [transferResult, setTransferResult] = useState<string | null>(null)

  // Handle transfer submission
  const handleTransfer = async () => {
    if (!recipient || !amount || isNaN(Number(amount))) {
      setTransferResult("Please enter a valid recipient and amount.")
      return
    }

    try {
      console.log("hi")
      const transferResponse = await sendKDA({
        accountFrom: account.account,
        pubkey: account.publicKey,
        accountTo: recipient,
        amount: Number(amount),
        sign: signTransaction // Pass the sign function from context
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

  return (
    <div style={{ padding: 20 }}>
      {account ? (
        <div>
          <p>
            <strong>Account:</strong> {account.account}
          </p>
          <p>
            <strong>Balance:</strong> {account.balance} KDA
          </p>
          <p>
            <strong>Chain ID:</strong> {account.chainId}
          </p>
          <p>
            <strong>Public Key:</strong> {account.publicKey}
          </p>
          <button onClick={disconnectWallet}>Disconnect</button>

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

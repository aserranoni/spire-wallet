import { Button } from "@/components/ui/button"
import React from "react"

export interface ConnectButtonProps {
  connectWallet: () => void
}

const ConnectButton: React.FC = ({ connectWallet }: ConnectButtonProps) => {
  return (
    <div className="mt-6 mb-6 ml-6 mr-6">
      <Button onClick={connectWallet} className="bg-orange-500 text-gray-900">
        Connect
      </Button>
    </div>
  )
}

export default ConnectButton

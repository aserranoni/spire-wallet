import React from "react"

import { Button } from "../components/ui/button.tsx"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Separator } from "../components/ui/separator"

export interface AccountInfoProps {
  account: {
    account: string
    balance: string | number
    chainId: string
    publicKey: string
  }
  disconnectWallet: () => void
}

const AccountInfo: React.FC<AccountInfoProps> = ({
  account,
  disconnectWallet
}) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Account Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Account:</p>
            <p className="text-lg font-semibold break-all">
              {account?.account || "N/A"}
            </p>
          </div>
          <Separator />
          <div>
            <p className="text-sm text-muted-foreground">Balance:</p>
            <p className="text-lg font-semibold">
              {account?.balance || "N/A"} KDA
            </p>
          </div>
          <Separator />
          <div>
            <p className="text-sm text-muted-foreground">Chain ID:</p>
            <p className="text-lg font-semibold">{account?.chainId || "N/A"}</p>
          </div>
          <Separator />
          <div>
            <p className="text-sm text-muted-foreground">Public Key:</p>
            <p className="text-lg font-mono font-semibold break-all">
              {account?.publicKey || "N/A"}
            </p>
          </div>
          <Button
            onClick={disconnectWallet}
            className="mx-auto bg-blue-500 text-white">
            Disconnect Wallet
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default AccountInfo

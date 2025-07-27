import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, ShoppingCart } from "lucide-react"
import Link from "next/link"

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ShoppingCart className="h-8 w-8 text-orange-600" />
            <h1 className="text-2xl font-bold">SupplyConnect</h1>
          </div>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
            <Mail className="h-8 w-8 text-orange-600" />
          </div>
          <CardTitle>Check Your Email</CardTitle>
          <CardDescription>
            We've sent a verification link to your email address. Please click the link to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Didn't receive the email? Check your spam folder or try again.</p>
            <Link href="/auth/login">
              <Button variant="outline" className="w-full bg-transparent">
                Back to Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

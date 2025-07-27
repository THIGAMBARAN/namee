import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Store, Users, MapPin, Star, TrendingUp } from "lucide-react"

export default function HomePage() {
  // Access environment variables directly in a Server Component
  // These values are determined at build time or server-side runtime.
  const mySecretApiKey = process.env.MY_SECRET_API_KEY
  const nextPublicAnalyticsKey = process.env.NEXT_PUBLIC_ANALYTICS_KEY

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-8 w-8 text-orange-600" />
            <h1 className="text-2xl font-bold text-gray-900">SupplyConnect</h1>
          </div>
          <div className="flex space-x-4">
            <Link href="/auth/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-orange-600 hover:bg-orange-700">Register</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Connect Street Food Vendors with
            <span className="text-orange-600"> Trusted Suppliers</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamline your supply chain with our platform that connects vendors with verified suppliers, offering
            competitive prices and reliable delivery across India.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/auth/register?type=vendor">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                <Store className="mr-2 h-5 w-5" />
                Register as Vendor
              </Button>
            </Link>
            <Link href="/auth/register?type=supplier">
              <Button size="lg" variant="outline">
                <Users className="mr-2 h-5 w-5" />
                Register as Supplier
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Why Choose SupplyConnect?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <MapPin className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle>Location-Based Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Find suppliers near your location to reduce delivery time and costs. Our smart matching system
                  connects you with the closest verified suppliers.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle>Price Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Compare prices from multiple suppliers in real-time. Make informed decisions and get the best deals
                  for your raw materials.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Star className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle>Verified Suppliers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  All suppliers are verified and rated by the community. Build trust and ensure quality with our rating
                  and review system.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-orange-600 text-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <h4 className="text-4xl font-bold mb-2">500+</h4>
              <p className="text-orange-100">Active Vendors</p>
            </div>
            <div>
              <h4 className="text-4xl font-bold mb-2">200+</h4>
              <p className="text-orange-100">Verified Suppliers</p>
            </div>
            <div>
              <h4 className="text-4xl font-bold mb-2">50+</h4>
              <p className="text-orange-100">Cities Covered</p>
            </div>
            <div>
              <h4 className="text-4xl font-bold mb-2">10k+</h4>
              <p className="text-orange-100">Orders Completed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ShoppingCart className="h-8 w-8 text-orange-600" />
            <h1 className="text-2xl font-bold">SupplyConnect</h1>
          </div>
          <p className="text-gray-400 mb-4">Connecting street food vendors with trusted suppliers across India</p>
          <p className="text-gray-500 text-sm">© 2024 SupplyConnect. All rights reserved.</p>
        </div>
      </footer>

      {/* Environment Variable Debugging Section */}
      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-md text-left text-sm mx-auto max-w-md">
        <h3 className="font-semibold mb-2">Environment Variable Check:</h3>
        <p>
          <span className="font-mono">MY_SECRET_API_KEY</span>:{" "}
          <span className="font-bold text-green-600 dark:text-green-400">
            {mySecretApiKey ? "Loaded (value present)" : "Not Loaded (value missing)"}
          </span>
        </p>
        <p>
          <span className="font-mono">NEXT_PUBLIC_ANALYTICS_KEY</span>:{" "}
          <span className="font-bold text-green-600 dark:text-green-400">
            {nextPublicAnalyticsKey ? "Loaded (value present)" : "Not Loaded (value missing)"}
          </span>
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          If a key shows "Not Loaded", please check your .env.local file or Vercel project settings.
        </p>
      </div>
    </div>
  )
}

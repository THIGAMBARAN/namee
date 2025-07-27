"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, Copy, Check, Database, Key, Settings, Play, AlertTriangle, CheckCircle } from "lucide-react"

export function SetupInstructions() {
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [copiedKey, setCopiedKey] = useState(false)
  const [copiedEnv, setCopiedEnv] = useState(false)

  const copyToClipboard = async (text: string, type: "url" | "key" | "env") => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === "url") setCopiedUrl(true)
      if (type === "key") setCopiedKey(true)
      if (type === "env") setCopiedEnv(true)

      setTimeout(() => {
        setCopiedUrl(false)
        setCopiedKey(false)
        setCopiedEnv(false)
      }, 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const envTemplate = `NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...your-actual-key`

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Supabase Setup Guide</h1>
        <p className="text-muted-foreground">Get your SupplyConnect platform running in 5 minutes</p>
      </div>

      <Tabs defaultValue="setup" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="setup">Setup Steps</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="troubleshoot">Troubleshooting</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-6">
          <div className="grid gap-6">
            {/* Step 1 */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Step 1</Badge>
                  <CardTitle className="text-lg">Create Supabase Project</CardTitle>
                </div>
                <CardDescription>Set up your backend database and authentication</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild className="flex-1">
                    <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Go to Supabase
                    </a>
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Play className="h-4 w-4 mr-2" />
                    Watch Setup Video
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Click "New Project" after signing in</p>
                  <p>• Choose a project name (e.g., "SupplyConnect")</p>
                  <p>• Set a secure database password</p>
                  <p>• Select your preferred region</p>
                </div>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Step 2</Badge>
                  <CardTitle className="text-lg">Get API Credentials</CardTitle>
                </div>
                <CardDescription>Copy your project URL and API key</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Key className="h-4 w-4" />
                  <AlertDescription>
                    Go to <strong>Settings → API</strong> in your Supabase dashboard
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project URL</label>
                    <div className="flex gap-2">
                      <code className="flex-1 p-2 bg-muted rounded text-sm">https://your-project-id.supabase.co</code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard("https://your-project-id.supabase.co", "url")}
                      >
                        {copiedUrl ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">anon/public Key</label>
                    <div className="flex gap-2">
                      <code className="flex-1 p-2 bg-muted rounded text-sm truncate">
                        eyJhbGciOiJIUzI1NiIs...your-actual-key
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard("eyJhbGciOiJIUzI1NiIs...your-actual-key", "key")}
                      >
                        {copiedKey ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Step 3</Badge>
                  <CardTitle className="text-lg">Configure Environment</CardTitle>
                </div>
                <CardDescription>Create your .env.local file</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Settings className="h-4 w-4" />
                  <AlertDescription>
                    Create a file named <code>.env.local</code> in your project root
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Environment Variables</label>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(envTemplate, "env")}>
                      {copiedEnv ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      Copy Template
                    </Button>
                  </div>
                  <pre className="p-4 bg-muted rounded text-sm overflow-x-auto">
                    <code>{envTemplate}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Step 4 */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Step 4</Badge>
                  <CardTitle className="text-lg">Set Up Database</CardTitle>
                </div>
                <CardDescription>Run the database setup script</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Database className="h-4 w-4" />
                  <AlertDescription>
                    Go to <strong>SQL Editor</strong> in your Supabase dashboard
                  </AlertDescription>
                </Alert>

                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    • Copy contents of <code>scripts/database-setup.sql</code>
                  </p>
                  <p>• Paste into SQL Editor and click "Run"</p>
                  <p>
                    • Optionally run <code>scripts/sample-data.sql</code> for test data
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Environment Configuration</CardTitle>
              <CardDescription>Detailed configuration instructions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Safe for frontend:</strong> anon/public key
                  </AlertDescription>
                </Alert>

                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Never use in frontend:</strong> service_role key
                  </AlertDescription>
                </Alert>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">File Structure</h3>
                <pre className="p-4 bg-muted rounded text-sm">
                  {`project-root/
├── .env.local          ← Create this file
├── .env.local.example  ← Template file
├── package.json
└── ...`}
                </pre>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Complete .env.local Example</h3>
                <pre className="p-4 bg-muted rounded text-sm">
                  {`# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNjU0ODAwMCwiZXhwIjoxOTUyMTI0MDAwfQ.example-key-here

# Optional: Add other environment variables as needed
# NEXT_PUBLIC_APP_URL=http://localhost:3000`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="troubleshoot" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Common Issues</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-red-600">❌ "Invalid API key" error</h4>
                    <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                      <li>• Double-check you copied the complete anon key (it's very long)</li>
                      <li>• Remove any extra spaces or line breaks</li>
                      <li>• Verify you're using the anon key, not the service_role key</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-red-600">❌ "Project not found" error</h4>
                    <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                      <li>• Confirm your project URL matches exactly</li>
                      <li>• Make sure your project is fully deployed (check dashboard)</li>
                      <li>• Wait a few minutes if you just created the project</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-red-600">❌ Environment variables not loading</h4>
                    <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                      <li>• Restart your development server after creating .env.local</li>
                      <li>• Ensure the file is in your project root (same level as package.json)</li>
                      <li>• Check that variable names start with NEXT_PUBLIC_</li>
                      <li>• Make sure there are no quotes around the values</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Getting Help</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  <Button variant="outline" asChild>
                    <a href="https://supabase.com/docs" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Supabase Documentation
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a
                      href="https://nextjs.org/docs/basic-features/environment-variables"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Next.js Environment Variables
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="https://discord.supabase.com" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Supabase Discord Community
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

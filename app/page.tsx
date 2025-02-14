import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/file-upload';
import { DataInsights } from '@/components/data-insights';
import { BarChart3, Brain, FileText, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Vizly</span>
          </div>
          <Button variant="outline">Sign In</Button>
        </div>
      </header>

      <main>
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Transform Your Data into
              <span className="text-primary"> Actionable Insights</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Upload your data and let our AI-powered analysis tool uncover valuable insights within seconds.
              Perfect for researchers, analysts, and business leaders.
            </p>
            <FileUpload />
          </div>
        </section>

        <section className="bg-muted/50 py-20 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <FileText className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Upload Your Data</h3>
                <p className="text-muted-foreground">
                  Support for CSV, Excel, JSON, and more. Secure and encrypted file storage.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <Brain className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
                <p className="text-muted-foreground">
                  Ask questions in plain language and get instant insights from your data.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <BarChart3 className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Visualize Results</h3>
                <p className="text-muted-foreground">
                  Interactive charts and graphs that bring your data to life.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="container mx-auto">
            <DataInsights />
          </div>
        </section>
      </main>

      <footer className="bg-muted/50 border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-primary" />
              <span className="font-semibold">Vizly</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Vizly. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
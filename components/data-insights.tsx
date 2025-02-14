'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { prisma } from '@/lib/db';
import { analyzeData } from '@/lib/openai';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

export function DataInsights() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/files');
      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }

      const files = await response.json();
      if (!files.length) {
        throw new Error('No files found');
      }

      const file = files[0]; // Get the latest file
      const data = JSON.parse(file.content);

      // Analyze data using OpenAI
      const analysis = await analyzeData(data, query);

      // Save analysis result
      const saveResponse = await fetch('/api/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileId: file.id,
          query,
          result: analysis,
        }),
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save analysis');
      }

      setResult(analysis);

      // Generate sample chart data (replace with actual data processing)
      const sampleData = Array.from({ length: 10 }, (_, i) => ({
        name: `Point ${i + 1}`,
        value: Math.random() * 100
      }));
      setChartData(sampleData);

    } catch (error) {
      console.error('Error analyzing data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Ask Questions About Your Data</h2>
        <p className="text-muted-foreground">
          Use natural language to query your data and get instant insights
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., What's the trend in sales over the last 6 months?"
            className="flex-1"
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>
            <Send className="h-4 w-4 mr-2" />
            {loading ? 'Analyzing...' : 'Ask'}
          </Button>
        </form>

        <div className="mt-6">
          <div className="text-sm text-muted-foreground">Suggested questions:</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {[
              'Show me the top 5 performing products',
              'What is the average revenue by region?',
              'Identify outliers in the dataset',
            ].map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                onClick={() => setQuery(suggestion)}
                disabled={loading}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>

        {result && (
          <div className="mt-8 space-y-6">
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Analysis Result</h3>
              <p className="text-muted-foreground">{result}</p>
            </Card>

            <Card className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Visualization</h3>
                <div className="space-x-2">
                  <Button
                    variant={chartType === 'line' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setChartType('line')}
                  >
                    Line
                  </Button>
                  <Button
                    variant={chartType === 'bar' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setChartType('bar')}
                  >
                    Bar
                  </Button>
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'line' ? (
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                      />
                    </LineChart>
                  ) : (
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill="hsl(var(--primary))"
                      />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
}
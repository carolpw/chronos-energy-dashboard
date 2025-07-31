import type { MetaFunction } from "@remix-run/cloudflare";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

export const meta: MetaFunction = () => {
  return [
    { title: "Chronos Energy Dashboard" },
    { name: "description", content: "Energy management dashboard with Chronos forecasting" },
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-100 mb-6">
          Energy Dashboard Test
        </h1>
        
        {/* Test our Card component */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-slate-100">Water Temperature</CardTitle>
              <CardDescription className="text-slate-400">Current system status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-100">68°C</div>
              <p className="text-sm text-green-400">System Online</p>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-slate-100">Energy Cost</CardTitle>
              <CardDescription className="text-slate-400">Today's consumption</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-100">€127,40</div>
              <p className="text-sm text-teal-400">-5.2% from yesterday</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
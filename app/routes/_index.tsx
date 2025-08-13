import React from "react"
import type { MetaFunction } from "@remix-run/cloudflare";
import {
  Activity,
  BarChart3,
  Brain,
  Building2,
  FileText,
  Home,
  Leaf,
  Settings,
  TrendingUp,
  Thermometer,
  Euro,
  Clock,
  Zap,
  CheckCircle,
  Calendar,
} from "lucide-react"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Area,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Separator } from "~/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
} from "~/components/ui/sidebar"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "~/components/ui/chart"
import { navItems, energyCostData, weeklyUsageData } from "~/lib/mock-data"

import { useEffect, useState } from "react";


// For times shown in X
import dayjs from "dayjs"; // If not already using, install with: npm install dayjs

const now = dayjs();
const xTicks = Array.from({ length: 24 }, (_, i) =>
  now.subtract(12, "hour").add(i, "hour").format("HH:mm")
);

// For Reference line
const currentHour = new Date();
const currentTimeStr = currentHour.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });


// Define the shape of the chart data point
type ChartPoint = {
  time: string;
  actual?: number;
  forecast?: number;
};



export const meta: MetaFunction = () => {
  return [
    { title: "EuroTech Office Complex - Energy Dashboard" },
    { name: "description", content: "AI-powered energy management with Amazon Chronos forecasting" },
  ];
};

function AppSidebar() {
  const iconMap: Record<string, any> = {
    Home,
    BarChart3,
    Brain,
    Settings,
    FileText,
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-800">
      <SidebarHeader className="border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-teal-400 flex-shrink-0" />
          <span className="font-semibold text-slate-100 truncate group-data-[collapsed=true]:hidden">
            EnergyOS
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const IconComponent = iconMap[item.icon]
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={item.isActive}>
                      <IconComponent className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="text-xs text-slate-400 group-data-[collapsed=true]:hidden">
          v2.1.4 • EU Compliant
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default function EnergyDashboard() {
  const [temperatureData, setTemperatureData] = useState<ChartPoint[]>([]);
  const [latestActualTemperature, setLatestActualTemperature] = useState<number | undefined>();

  useEffect(() => {
    async function fetchForecast() {
      const res = await fetch("https://5piprfmuyl.execute-api.eu-north-1.amazonaws.com/prod/forecast");
      const data: any = await res.json();

      const pastPoints: ChartPoint[] = data.timestamps.map((ts: string, i: number) => ({
        time: new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        actual: data.actual[i],
      }));

      const forecastTimestamps: string[] = [];
      const start = new Date(data.timestamps[data.timestamps.length - 1]);
      console.log("Forecast length (in points):", data.forecast[1]?.length);
      for (let i = 0; i < data.forecast[1].length; i++) {
        const t = new Date(start.getTime() + (i + 1) * 15 * 60000); // 15-minute intervals
        forecastTimestamps.push(t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      }

      const futurePoints: ChartPoint[] = forecastTimestamps.map((t, i) => ({
        time: t,
        forecast: data.forecast[1]?.[i] ?? null,
      }));


      const latestActual = [...pastPoints]
      .reverse()
      .find(point => point.actual !== undefined && point.actual !== null)?.actual;

    setTemperatureData([...pastPoints, ...futurePoints]);
    setLatestActualTemperature(latestActual);
  }
    fetchForecast();
  }, []);


  return (
    <div className="min-h-screen bg-slate-950">
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <div className="flex-1">
          {/* Header */}
          <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger className="text-slate-300 hover:text-slate-100" />
              <Separator orientation="vertical" className="h-6 bg-slate-700" />
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-teal-400" />
                <h1 className="text-lg font-semibold text-slate-100">EuroTech Office Complex - Brussels</h1>
              </div>
              <div className="ml-auto flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-slate-300">System Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-teal-400" />
                  <span className="text-sm text-slate-300">All Sensors Active</span>
                </div>
              </div>
            </div>
          </header>
          

          <div className="flex">
            {/* Main Content */}
            <main className="flex-1 p-6">
              {/* Key Metrics Cards */}
              <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-slate-800 bg-slate-900/50">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">Water Temperature</CardTitle>
                    <Thermometer className="h-4 w-4 text-teal-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-slate-100">
                      {latestActualTemperature !== undefined ? `${latestActualTemperature.toFixed(0)}°C` : '–'}
                    </div>
                      <Badge variant="secondary" className="bg-green-900/50 text-green-300">
                        Optimal
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-800 bg-slate-900/50">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">Today's Energy Cost</CardTitle>
                    <Euro className="h-4 w-4 text-teal-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold text-slate-100">€127,40</div>
                      <TrendingUp className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-green-400">-5,2%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-800 bg-slate-900/50">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">CO₂ Saved Today</CardTitle>
                    <Leaf className="h-4 w-4 text-green-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold text-slate-100">24,5 kg</div>
                      <Badge variant="secondary" className="bg-green-900/50 text-green-300">
                        +12%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-800 bg-slate-900/50">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">Next Heating Cycle</CardTitle>
                    <Clock className="h-4 w-4 text-teal-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-100">03:30</div>
                    <p className="text-xs text-slate-400">Off-peak rate</p>
                  </CardContent>
                </Card>
              </div>

              {/* Main Chart */}
              <Card className="mb-6 border-slate-800 bg-slate-900/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-slate-100">Water Temperature Forecast</CardTitle>
                      <CardDescription className="text-slate-400">
                        Past 12 hours (actual) + Next 6 hours (forecast)
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="bg-teal-900/50 text-teal-300">
                        Prediction Accuracy: 94,2%
                      </Badge>
                      <Badge variant="secondary" className="bg-blue-900/50 text-blue-300">
                        Powered by Amazon Chronos
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      actual: {
                        label: "Actual Temperature",
                        color: "hsl(var(--chart-1))",
                      },
                      forecast: {
                        label: "Current Forecast",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-[400px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={temperatureData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis
                          dataKey="time"
                          stroke="#64748b"
                          fontSize={12}
                          ticks={xTicks}
                          tickFormatter={(tick) => tick}
                        />

                        <YAxis
                          domain={[45, 75]}
                          stroke="#64748b"
                          fontSize={12}
                          label={{
                            value: "Temperature (°C)",
                            angle: -90,
                            position: "insideLeft",
                            style: { textAnchor: "middle", fill: "#64748b" },
                          }}
                        />
                        {/* <ChartTooltip
                          content={<ChartTooltipContent />}
                        /> */}
                        <ReferenceLine x={currentTimeStr} stroke="#64748b" strokeDasharray="5 5" />
                        

                        {/* Confidence interval area */}
                        <Area dataKey="confidence" stroke="none" fill="#64748b" fillOpacity={0.2} />

                        {/* Actual temperature line */}
                        <Line
                          type="monotone"
                          dataKey="actual"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                          connectNulls={false}
                        />
                        
                        {/* Forecast line */}
                        <Line
                          type="monotone"
                          dataKey="forecast"
                          stroke="#f97316"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={{ fill: "#f97316", strokeWidth: 2, r: 3 }}
                          connectNulls={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      <span className="text-slate-300">Actual Temperature</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full border-2 border-orange-500 border-dashed bg-transparent"></div>
                      <span className="text-slate-300">Current Forecast</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Secondary Charts */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card className="border-slate-800 bg-slate-900/50">
                  <CardHeader>
                    <CardTitle className="text-slate-100">Today's Energy Cost</CardTitle>
                    <CardDescription className="text-slate-400">Hourly electricity rates (€/kWh)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        rate: {
                          label: "Rate",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                      className="h-[200px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={energyCostData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                          <XAxis dataKey="hour" stroke="#64748b" fontSize={12} />
                          <YAxis
                            stroke="#64748b"
                            fontSize={12}
                            label={{
                              value: "€/kWh",
                              angle: -90,
                              position: "insideLeft",
                              style: { textAnchor: "middle", fill: "#64748b" },
                            }}
                          />
                          {/* <ChartTooltip content={<ChartTooltipContent />} /> */}
                          <Bar dataKey="rate" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                

                <Card className="border-slate-800 bg-slate-900/50">
                <CardHeader>
                  <CardTitle className="text-slate-100">Weekly Usage Pattern</CardTitle>
                  <CardDescription className="text-slate-400">Hot water consumption (kWh)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      usage: {
                        label: "Usage",
                        color: "hsl(var(--chart-3))",
                      },
                    }}
                    className="h-[200px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weeklyUsageData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                        <YAxis
                          stroke="#64748b"
                          fontSize={12}
                          label={{
                            value: "kWh",
                            angle: -90,
                            position: "insideLeft",
                            style: { textAnchor: "middle", fill: "#64748b" },
                          }}
                        />
                        {/* <ChartTooltip content={<ChartTooltipContent />} /> */}
                        <Line
                          type="monotone"
                          dataKey="usage"
                          stroke="#14b8a6"
                          strokeWidth={3}
                          dot={{ fill: "#14b8a6", strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
                </Card>
              </div>
            </main>

            {/* Right Sidebar */}
            <aside className="w-80 border-l border-slate-800 bg-slate-900/30 p-6">
              <div className="space-y-6">
                {/* System Status */}
                <Card className="border-slate-800 bg-slate-900/50">
                  <CardHeader>
                    <CardTitle className="text-slate-100">System Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Water Heater</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-green-400">Online</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Temperature Sensors</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-green-400">Active</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Predictive Model</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-green-400">Running</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Energy Optimization</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-green-400">Enabled</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Next Actions */}
                <Card className="border-slate-800 bg-slate-900/50">
                  <CardHeader>
                    <CardTitle className="text-slate-100">Next Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Clock className="h-4 w-4 text-teal-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-slate-200">03:30 - Start Heating</p>
                        <p className="text-xs text-slate-400">Off-peak rate optimization</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Zap className="h-4 w-4 text-yellow-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-slate-200">07:45 - Reduce Power</p>
                        <p className="text-xs text-slate-400">Peak rate avoidance</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="h-4 w-4 text-blue-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-slate-200">Weekly Maintenance</p>
                        <p className="text-xs text-slate-400">Scheduled for Sunday 02:00</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Energy Efficiency Score */}
                <Card className="border-slate-800 bg-slate-900/50">
                  <CardHeader>
                    <CardTitle className="text-slate-100">Energy Efficiency</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-900/50 border-2 border-green-400 mb-2">
                        <span className="text-2xl font-bold text-green-400">A+</span>
                      </div>
                      <p className="text-sm text-slate-300 mb-4">EU Energy Label Rating</p>
                      <div className="space-y-2 text-left">
                        <div className="flex justify-between">
                          <span className="text-xs text-slate-400">Efficiency Score</span>
                          <span className="text-xs text-slate-200">94,2%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-slate-400">Cost Savings</span>
                          <span className="text-xs text-green-400">€2.847/month</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-slate-400">CO₂ Reduction</span>
                          <span className="text-xs text-green-400">18,3%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Predictive Accuracy */}
                <Card className="border-slate-800 bg-slate-900/50">
                  <CardHeader>
                    <CardTitle className="text-slate-100">Model Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-slate-300">Prediction Accuracy</span>
                          <span className="text-sm text-slate-200">94,2%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div className="bg-teal-400 h-2 rounded-full" style={{ width: "94.2%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-slate-300">Model Confidence</span>
                          <span className="text-sm text-slate-200">91,8%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div className="bg-blue-400 h-2 rounded-full" style={{ width: "91.8%" }}></div>
                        </div>
                      </div>
                      <div className="pt-2 text-xs text-slate-400">Last updated: 2 minutes ago</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </SidebarProvider>
    </div>
  )
  
}

// Navigation items
export const navItems = [
    { title: "Dashboard", icon: "Home", isActive: true },
    { title: "Analytics", icon: "BarChart3", isActive: false },
    { title: "Predictions", icon: "Brain", isActive: false },
    { title: "Settings", icon: "Settings", isActive: false },
    { title: "Reports", icon: "FileText", isActive: false },
  ]
  
  // Sample data for temperature forecast
  export const temperatureData = [
    { time: "02:00", actual: 67.2, predicted: 67.5, forecast: null, confidence: null },
    { time: "04:00", actual: 65.8, predicted: 66.1, forecast: null, confidence: null },
    { time: "06:00", actual: 64.5, predicted: 64.8, forecast: null, confidence: null },
    { time: "08:00", actual: 66.2, predicted: 66.0, forecast: null, confidence: null },
    { time: "10:00", actual: 68.1, predicted: 68.3, forecast: null, confidence: null },
    { time: "12:00", actual: 69.5, predicted: 69.2, forecast: null, confidence: null },
    { time: "14:00", actual: 68.0, predicted: null, forecast: 67.8, confidence: [66.5, 69.1] },
    { time: "16:00", actual: null, predicted: null, forecast: 66.2, confidence: [64.8, 67.6] },
    { time: "18:00", actual: null, predicted: null, forecast: 65.1, confidence: [63.5, 66.7] },
    { time: "20:00", actual: null, predicted: null, forecast: 64.8, confidence: [63.0, 66.6] },
    { time: "22:00", actual: null, predicted: null, forecast: 66.5, confidence: [64.8, 68.2] },
    { time: "00:00", actual: null, predicted: null, forecast: 68.2, confidence: [66.3, 70.1] },
  ]
  
  // Energy cost data
  export const energyCostData = [
    { hour: "00:00", rate: 0.08, type: "off-peak" },
    { hour: "02:00", rate: 0.07, type: "off-peak" },
    { hour: "04:00", rate: 0.07, type: "off-peak" },
    { hour: "06:00", rate: 0.12, type: "standard" },
    { hour: "08:00", rate: 0.18, type: "peak" },
    { hour: "10:00", rate: 0.18, type: "peak" },
    { hour: "12:00", rate: 0.15, type: "standard" },
    { hour: "14:00", rate: 0.15, type: "standard" },
    { hour: "16:00", rate: 0.18, type: "peak" },
    { hour: "18:00", rate: 0.18, type: "peak" },
    { hour: "20:00", rate: 0.12, type: "standard" },
    { hour: "22:00", rate: 0.08, type: "off-peak" },
  ]
  
  // Weekly usage pattern
  export const weeklyUsageData = [
    { day: "Mon", usage: 245 },
    { day: "Tue", usage: 238 },
    { day: "Wed", usage: 252 },
    { day: "Thu", usage: 241 },
    { day: "Fri", usage: 235 },
    { day: "Sat", usage: 180 },
    { day: "Sun", usage: 165 },
  ]
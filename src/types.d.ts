interface PieChartOptions {
  holder: string
  data: number[]
  source: string
  total?: number
  rotate?: number
  colorScheme?: string[]
  innerRadius?: number
}

interface PieChartDataItem {
  value: number
  color: string
}

interface LineChartOptions {
  holder: string
  data: LineChartData
  keys?: string[]
  colorScheme?: string[]
  labels?: string[]
}

interface LineChartData {
  [key: string]: number[]
}

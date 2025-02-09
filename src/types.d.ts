interface PieChartOptions {
  holder: string
  data: PieChartDataItem[]
  source: string
  total?: number
  rotate?: number
  colorScheme?: string[]
  innerRadius?: number
}

interface PieChartDataItem {
  label: string
  values: {
    label: string
    title: string
    value: number
  }[]
}

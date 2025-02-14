// Mock
import FAVORITE_GAMES from '../mock/favorite-games.js'
import FAVORITE_GAMES_PIE from '../mock/favorite-games-pie.js'
// Utils
import PieChart from './create-pie-chart.js'
import LineChart from './create-line-chart.js'

const pieChart = new PieChart({
  holder: '#pie',
  data: FAVORITE_GAMES_PIE,
  source: 'hours',
  rotate: -90,
  innerRadius: 70,
})

const lineChart = new LineChart({
  holder: '#line',
  labels: ['2020', '2021', '2022', '2023', '2024'],
  data: FAVORITE_GAMES,
})

pieChart.init()
lineChart.init()

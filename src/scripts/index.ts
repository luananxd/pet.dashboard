// Mock
import FAVORITE_GAMES from '../mock/favorite-games.js'
// Utils
import PieChart from './create-pie-chart.js'

const pieChart = new PieChart({
  holder: '#pie',
  data: FAVORITE_GAMES,
  source: 'hours',
  rotate: -90,
  innerRadius: 70,
})

pieChart.init()

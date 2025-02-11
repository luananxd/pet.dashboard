import { DEFAULT_COLOR_SCHEME_LIGHT } from './constants.js'
import { getRankSymbol } from './utils.js'

export default class LineChart {
  holder: HTMLElement | undefined
  data: LineChartData
  colorScheme: string[]
  chartKeys: string[]
  labels: string[]
  stepsCount: number
  groupsCount: number
  padding: number
  fontSize: number
  svg: SVGElement
  measuring: DOMRect
  maxValue: number

  constructor(options: LineChartOptions) {
    this.stepsCount = 4
    this.padding = 40
    this.fontSize = 12
    this.chartKeys = options.keys
    this.labels = options.labels
    this.colorScheme = options.colorScheme ?? DEFAULT_COLOR_SCHEME_LIGHT
    this.groupsCount = this._getGroupsCount(options.data)
    this.holder = document.querySelector(options.holder)
    this.data = this._getNormalizedData(options.data)
    this.maxValue = this._getMaxValue()
  }

  _getNormalizedData(data: LineChartData) {
    if (!this.chartKeys || !this.chartKeys.length) return data

    const obj: LineChartData = {}
    const keys = Object.keys(data)

    keys.forEach(key => {
      if (this.chartKeys.includes(key)) {
        obj[key] = data[key]
      }
    })

    return obj
  }

  _getMaxValue() {
    let _v: number[] = []
    const values = Object.values(this.data)

    values.forEach(value => {
      _v = [..._v, ...value]
    })

    return Math.max(..._v)
  }

  _getGroupsCount(data: LineChartData) {
    const valuesLengths = Object.values(data).map(i => i.length)
    return Math.max(...valuesLengths)
  }

  _createNumberWithSymbol(value: number) {
    const rank = String(Math.ceil(value)).length - 1
    const symbol = getRankSymbol(Math.pow(10, rank))
    return Math.ceil(value / Math.pow(1000, Math.floor(rank / 3))) + symbol
  }

  _createSVG() {
    if (!this.holder) {
      new Error('Не удалось найти HTML-элемент')
    }

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')

    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    svg.setAttribute('width', String(this.holder.offsetWidth))
    svg.setAttribute('height', String(this.holder.offsetHeight))

    svg.append(defs)
    this.svg = svg
    this.holder.append(svg)
    this.measuring = svg.getBoundingClientRect()
  }

  _createCoordGrid() {
    if (!this.svg) {
      new Error('Не удалось найти SVG-элемент')
    }

    const zeroX = this.padding
    const zeroY = this.measuring.height - this.padding
    const endX = this.measuring.width - this.padding
    const endY = this.padding

    const axisX = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    const axisY = document.createElementNS('http://www.w3.org/2000/svg', 'path')

    axisX.setAttribute('d', `M${zeroX} ${zeroY} L${endX} ${zeroY}`)
    axisX.setAttribute('stroke', '#e6e6e6')
    axisX.setAttribute('stroke-width', '2')

    axisY.setAttribute('d', `M${zeroX} ${zeroY} L${zeroX} ${endY}`)
    axisY.setAttribute('stroke', '#e6e6e6')
    axisY.setAttribute('stroke-width', '2')

    this.svg.append(axisX)
    this.svg.append(axisY)

    this._createSteps()
  }

  _createVerticalDash(index: number) {
    const width = 10
    const stepInPixels =
      (this.measuring.height - this.padding * 2) / this.stepsCount
    const x = this.padding - width / 2
    const y = stepInPixels * index + this.padding
    const d = `M${x} ${y} L${x + width} ${y}`

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')

    path.setAttribute('d', d)
    path.setAttribute('stroke', '#e6e6e6')
    path.setAttribute('stroke-width', '2')

    return path
  }

  _createHorizontalDash(index: number) {
    const height = 10
    const groupInPixels =
      (this.measuring.width - this.padding * 2) / this.groupsCount
    const x = groupInPixels * (index + 1) - groupInPixels / 2 + this.padding
    const y = this.measuring.height - this.padding - height / 2
    const d = `M${x} ${y} L${x} ${y + height}`

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')

    path.setAttribute('d', d)
    path.setAttribute('stroke', '#e6e6e6')
    path.setAttribute('stroke-width', '2')

    return path
  }

  _createTextLabel(index: number) {
    const stepValue =
      (this.maxValue / this.stepsCount) * (this.stepsCount - index)
    const stepInPixels =
      (this.measuring.height - this.padding * 2) / this.stepsCount
    const textContent = this._createNumberWithSymbol(stepValue)
    const y = stepInPixels * index + this.padding + this.fontSize * 0.4

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    text.textContent = textContent

    text.setAttribute('font-size', `${this.fontSize}px`)
    text.setAttribute('fill', '#d6d6d6')
    text.setAttribute('x', '0')
    text.setAttribute('y', String(y))

    return text
  }

  _createGroupLabel(index: number) {
    if (!this.labels || !this.labels.length) return ''

    const groupInPixels =
      (this.measuring.width - this.padding * 2) / this.groupsCount
    const textContent = this.labels?.[index] ?? ''
    const x = groupInPixels * (index + 1) - groupInPixels / 2 + this.padding
    const y = this.measuring.height - this.padding / 2

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    text.textContent = textContent

    text.setAttribute('font-size', `${this.fontSize}px`)
    text.setAttribute('text-anchor', 'middle')
    text.setAttribute('fill', '#d6d6d6')
    text.setAttribute('x', String(x))
    text.setAttribute('y', String(y))

    return text
  }

  _createSteps() {
    for (let i = this.stepsCount - 1; i >= 0; i--) {
      const dash = this._createVerticalDash(i)
      const label = this._createTextLabel(i)
      this.svg.append(dash)
      this.svg.append(label)
    }

    for (let i = this.groupsCount - 1; i >= 0; i--) {
      const dash = this._createHorizontalDash(i)
      const label = this._createGroupLabel(i)
      this.svg.append(dash)
      this.svg.append(label)
    }
  }

  _createLine(data: number[], index: number) {
    const graphHeight = this.measuring.height - this.padding * 2
    const groupInPixels =
      (this.measuring.width - this.padding * 2) / this.groupsCount
    let d = ''

    data.forEach((item, _index) => {
      const itemValue = graphHeight * (item / this.maxValue) || 0
      const x = groupInPixels * (_index + 1) - groupInPixels / 2 + this.padding
      const y = graphHeight + this.padding - itemValue

      console.log(y)

      if (_index === 0) {
        d += `M${x} ${y} `
      } else {
        d += `L${x} ${y} `
      }
    })

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    const color = this.colorScheme[Math.min(index, this.colorScheme.length)]
    path.setAttribute('d', d)
    path.setAttribute('stroke', color)
    path.setAttribute('fill', 'transparent')
    path.setAttribute('stroke-width', '5')

    this.svg.append(path)
  }

  _render() {
    const keys = Object.keys(this.data)
    keys.forEach((key, index) => {
      this._createLine(this.data[key], index)
    })
  }

  init() {
    this._createSVG()
    this._createCoordGrid()
    this._render()
  }
}

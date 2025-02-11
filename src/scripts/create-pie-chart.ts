import { DEFAULT_COLOR_SCHEME_LIGHT } from './constants.js'
import { getCircleX, getCircleY } from './utils.js'

export default class PieChart {
  holder: HTMLElement | undefined
  data: { value: number; color: string }[]
  source: string
  total: number
  rotate: number
  radius: number
  innerRadius: number
  colorScheme: string[]
  svg: SVGElement
  measuring: DOMRect

  constructor(options: PieChartOptions) {
    this.holder = document.querySelector(options.holder)
    this.source = options.source
    this.colorScheme = options.colorScheme ?? DEFAULT_COLOR_SCHEME_LIGHT
    this.rotate = options.rotate ?? 0
    this.innerRadius = options.innerRadius ?? 0
    this.total = options.total ?? this._getTotal(options.data)
    this.data = this._createNormalizedData(options.data)
  }

  _getTotal(data: number[]) {
    return data.reduce((total, item) => {
      return (total += item)
    }, 0)
  }

  _createNormalizedData(data: number[]) {
    const total = this._getTotal(data)
    const _data = data.map((item, index) => {
      const colorIndex = Math.min(index, this.colorScheme.length - 1)
      return {
        value: item / total,
        color: this.colorScheme[colorIndex],
      }
    })
    return _data.sort((a, b) => a.value - b.value)
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

  _createBackground() {
    if (!this.svg) {
      new Error('Не удалось найти SVG-элемент')
    }

    const circle = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle',
    )
    const cx = String(this.measuring.width / 2)
    const cy = String(this.measuring.height / 2)
    const radius = String(this.radius)

    circle.setAttribute('cx', cx)
    circle.setAttribute('cy', cy)
    circle.setAttribute('r', radius)
    circle.setAttribute('fill', '#e6e6e6')
    circle.setAttribute('mask', 'url(#hole)')

    this.svg.append(circle)
  }

  _createMask() {
    const cx = String(this.measuring.width / 2)
    const cy = String(this.measuring.height / 2)
    const radius = String(this.radius)
    const innerRadius = String(this.innerRadius)
    const defs = this.svg.querySelector('defs')
    const mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask')
    const outer = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle',
    )
    const inner = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle',
    )

    mask.setAttribute('id', 'hole')

    outer.setAttribute('cx', cx)
    outer.setAttribute('cy', cy)
    outer.setAttribute('r', radius)
    outer.setAttribute('fill', 'white')

    inner.setAttribute('cx', cx)
    inner.setAttribute('cy', cy)
    inner.setAttribute('r', innerRadius)
    inner.setAttribute('fill', 'black')

    mask.append(outer)
    mask.append(inner)

    defs.append(mask)
  }

  _drawSegment(startAngle: number, endAngle: number, color: string) {
    const segment = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path',
    )

    const cx = this.measuring.width / 2
    const cy = this.measuring.height / 2
    const length = endAngle - startAngle
    const startX = getCircleX({
      centerX: cx,
      radius: this.radius,
      degrees: startAngle,
      rotate: this.rotate,
    })
    const startY = getCircleY({
      centerY: cy,
      radius: this.radius,
      degrees: startAngle,
      rotate: this.rotate,
    })
    const endX = getCircleX({
      centerX: cx,
      radius: this.radius,
      degrees: endAngle,
      rotate: this.rotate,
    })
    const endY = getCircleY({
      centerY: cy,
      radius: this.radius,
      degrees: endAngle,
      rotate: this.rotate,
    })

    const d =
      `M${cx} ${cy} ` +
      `L${startX} ${startY} ` +
      `A${this.radius} ${this.radius} 0 ${
        length > 180 ? 1 : 0
      } 1 ${endX} ${endY} ` +
      'Z'

    segment.setAttribute('d', d)
    segment.setAttribute('fill', color)
    segment.setAttribute('mask', 'url(#hole)')

    this.svg.append(segment)
  }

  _render() {
    let end = 360
    this.data.forEach(item => {
      const start = Math.max(end - 360 * item.value, 0.01)
      this._drawSegment(0.01, end, item.color)
      end = start
    })
  }

  init() {
    this._createSVG()
    this.radius = this.measuring.width / 2
    this._createMask()
    this._createBackground()
    this._render()
  }
}

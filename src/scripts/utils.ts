interface GetCircleXArguments {
  centerX: number
  radius: number
  degrees: number
  rotate: number
}

interface GetCircleYArguments {
  centerY: number
  radius: number
  degrees: number
  rotate: number
}

export const degreesToRadians = (degrees: number) => {
  return (degrees * Math.PI) / 180
}

export const radiansToDegrees = (radians: number) => {
  return (radians * 180) / Math.PI
}

export const getCircleX = (options: GetCircleXArguments) => {
  const radians = degreesToRadians(options.degrees + options.rotate)
  return options.centerX + options.radius * Math.cos(radians)
}

export const getCircleY = (options: GetCircleYArguments) => {
  const radians = degreesToRadians(options.degrees + options.rotate)
  return options.centerY + options.radius * Math.sin(radians)
}

export const getMaxCoord = (value: number) => {
  const rank = String(value).length - 2
  const multiplicate = Math.pow(10, rank)
  const _v = Math.round(value / multiplicate + 1) * multiplicate
  return _v
}

export const getRankSymbol = (rank: number) => {
  if (rank < 1_000) return ''
  if (rank >= 1_000 && rank < 1_000_000) return 'K'
  if (rank >= 1_000_000 && rank < 1_000_000_000) return 'M'
  if (rank >= 1_000_000_000 && rank < 1_000_000_000_000) return 'B'

  return ''
}

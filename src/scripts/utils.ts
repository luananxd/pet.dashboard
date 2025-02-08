interface GetCircleXArguments {
  centerX: number,
  radius: number,
  degrees: number,
  rotate: number,
}

interface GetCircleYArguments {
  centerY: number,
  radius: number,
  degrees: number,
  rotate: number,
}

export const degreesToRadians = (degrees: number) => {
  return degrees * Math.PI / 180
}

export const radiansToDegrees = (radians: number) => {
  return radians * 180 / Math.PI
}

export const getCircleX = (options: GetCircleXArguments) => {
  const radians = degreesToRadians(options.degrees + options.rotate)
  return options.centerX + options.radius * Math.cos(radians)
}

export const getCircleY = (options: GetCircleYArguments) => {
  const radians = degreesToRadians(options.degrees + options.rotate)
  return options.centerY + options.radius * Math.sin(radians)
}
export const delay = async (timer: number = 300) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, timer)
  })
}
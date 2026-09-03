// Для проектов Vue CLI, в которых ещё нет декларации импорта PNG.
declare module '*.png' {
  const url: string
  export default url
}

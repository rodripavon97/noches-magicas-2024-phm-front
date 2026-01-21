declare module './i18n' {
  const i18n: {
    init: () => void
    t: (key: string) => string
  }
  export default i18n
}

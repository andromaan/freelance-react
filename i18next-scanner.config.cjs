module.exports = {
  input: ['src/**/*.{ts,tsx}'],
  output: './',
  options: {
    func: { list: ['t', 'i18n.t'], extensions: ['.ts', '.tsx'] },
    lngs: ['uk', 'en'],           // обидві мови
    ns: ['translation'],
    defaultLng: 'uk',
    resource: {
      loadPath: 'public/locales/{{lng}}/{{ns}}.json',
      savePath: 'public/locales/{{lng}}/{{ns}}.json',
    },
    nsSeparator: ':',
    keySeparator: '.',
  },
};
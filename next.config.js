module.exports = {
  i18n: {
    locales: ['de'],
    defaultLocale: 'de',
  },
  redirects() {
    return [
      {
        source: '/learn',
        destination: 'https://youtu.be/GWXx1F906IQ',
        permanent: false,
        basePath: false,
      },
    ];
  },
};

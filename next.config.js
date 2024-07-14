module.exports = {
  i18n: {
    locales: ['de'],
    defaultLocale: 'de',
  },
  redirects() {
    return [
      {
        source: '/learn',
        destination: 'https://youtu.be/2arxBGrjBgI',
        permanent: false,
        basePath: false,
      },
    ];
  },
};

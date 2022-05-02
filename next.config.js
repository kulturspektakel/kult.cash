module.exports = {
  async redirects() {
    return [
      {
        source: '/$$$/:id/:hash',
        destination: '/:id/:hash',
        permanent: false,
      },
    ];
  },
};

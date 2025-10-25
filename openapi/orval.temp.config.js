module.exports = {
  api: {
    input: 'api.guildmage.eu.filtered.json',
    output: {
      // orval target: katalog, do którego będą zapisywane pliki.
      target: 'src\api\gen',
      client: 'fetch'
    }
  }
};

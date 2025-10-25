module.exports = {
    api: {
        input: {
            target: './openapi/api.guildmage.eu.filtered.json',
            // override: {
            //     transformer: './transformer/transform-params.js',
            // },
        },
        output: {
            client: 'fetch',
            mode: 'tags-split',
            target: './src/api/gen/endpoints',
            schemas: './src/api/gen/model',
            fileExtension: '.gen.ts',
//            prettier: true,
            baseUrl: "${config.api.url}",
            // override: {
            //     paramsSerializer: {
            //         path: './transformer/customParamsSerializer.js',
            //         name: 'customParamsSerializerFn',
            //     },
            // }
        }
    }
};

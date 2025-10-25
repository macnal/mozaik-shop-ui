module.exports = {
    api: {
        input: {
            target: './openapi/api.guildmage.eu.json',
            // override: {
            //     transformer: './transformer/transform-params.js',
            // },
        },
        output: {
            client: 'fetch',
            mode: 'tags-split',
            target: './gen/endpoints',
            schemas: './gen/model',
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

import { create } from 'atma-io-middleware-base'
import process, { map_getFileAt, map_parse } from './importer'

export = create({
    name: 'atma-io-middleware-import-inliner',
    textOnly: true,
    defaultOptions: {
        defaultExtension: 'js',
        withPathComments: true
    },
    process,
    utils: {
        map_getFileAt,
        map_parse
    }
});
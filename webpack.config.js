module.exports = {
    entry: './index.js',
    output: {
        path: __dirname + '/build',
        filename: 'dom-event-phrase.js',
        library: 'domEventPhrase',
        libraryTarget: 'var'
    }
};

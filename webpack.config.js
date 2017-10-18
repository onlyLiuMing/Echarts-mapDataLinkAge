module.exports = {
    devtool:'eval-source-map',
    entry:{
        bundle: __dirname + '/main.js'
    },
    output:{
        filename:'[name].js',
        path:__dirname + '/public'
    }
}
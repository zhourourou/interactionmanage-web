var path = require("path"),
    webpack = require("webpack");

var SRC_PATH = path.join(__dirname, 'src'),
    DIST_PATH = path.join(__dirname, '../static-web'),
    CHUNK_FILE_HASH_TAG = '_[chunkhash:5]';

var HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    WebpackChunkHash = require("webpack-chunk-hash"),
    InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');


var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var formatDate = function(date){
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    const hours = `0${date.getHours()}`.slice(-2);
    const minutes = `0${date.getMinutes()}`.slice(-2);
    const seconds = `0${date.getSeconds()}`.slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}


var isPreBuild = !!process.env.TESTING

var config = {
    entry: {
        apps: path.join(SRC_PATH, 'root.js'),
        vendors: [
            'vue',
            'vuex',
            'vue-router',
            'vuex-router-sync',
            'axios'
        ]
    },

    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '~': SRC_PATH,
        },

        extensions: [".less", ".css", ".js", ".vue", ".json"]
    },

    output: {
        path: DIST_PATH,
        publicPath: '/static-web/',
        filename: `js/[name]${CHUNK_FILE_HASH_TAG}.js`,
        chunkFilename: `js/[id].[name]${CHUNK_FILE_HASH_TAG}.js`
    },


    plugins: [

/*        new BundleAnalyzerPlugin({
            openAnalyzer: false,
            analyzerPort: 2008
        }),
*/

        new CleanWebpackPlugin("static-web", {
            root: path.join(__dirname, "../"),
            verbose: false
        }),

        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            '__DEV__': false
        }),

        new webpack.optimize.CommonsChunkPlugin({
            name: ["vendors", "manifest"],
            minChunks: Infinity
        }),

        new webpack.HashedModuleIdsPlugin(),
        // enable scope hoisting
        new webpack.optimize.ModuleConcatenationPlugin(),
        // new WebpackChunkHash(),
        new InlineManifestWebpackPlugin(),

        new ExtractTextPlugin(`css/commons${CHUNK_FILE_HASH_TAG}.css`),

        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),

        new webpack.optimize.UglifyJsPlugin({
            comments: false,
            compress:{
                warnings: false,
                drop_debugger: true,
                drop_console: true
            }
        }),

        new HtmlWebpackPlugin({
            inject: true,
            filename: '../index.html',
            template: path.join(SRC_PATH, 'index_prod.html'),
            interaction: isPreBuild ? '':'http://v.miguvideo.com',
            env: isPreBuild ? '预览环境' : '正式环境',
            version:formatDate(new Date())
        })
    ],

    module: {

        rules: [

            {
                test: /\.js$/,
                loader: "babel-loader",
                include: [
                    path.resolve(SRC_PATH),
                    path.resolve(__dirname, 'node_modules', 'earthjs'),
                ]
            },


            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    postcss: [
                        require('autoprefixer')({
                            browsers: ['last 3 versions']
                        })
                    ],

                    loaders: {
                        sass: ExtractTextPlugin.extract({
                            fallback: "vue-style-loader",
                            use: 'css-loader?minimize!resolve-url-loader!sass-loader?sourceMap',
                            publicPath: "../"
                        })
                    }

                }
            },

			{
				test: /\.css$/,
				use: [
					"style-loader",
                    "css-loader",
                    "resolve-url-loader"
				]
			},

			{
				test: /\.scss$/,
				use: [
					"style-loader",
                    "css-loader",
                    "resolve-url-loader",
					"sass-loader?sourceMap"
				]
			},


            {
                test: /\.(png|jpg|gif|webp|xlsx)$/,
                loader: "url-loader",
                options: {
                    limit: 8192,
                    name: `images/[name].[ext]`
                }
            },

            {
                test: /\.(eot|woff|woff2|ttf|svg)/,
                loader: "url-loader",
                options: {
                    limit: 100,
                    name: 'fonts/[name].[ext]'
                }
            }
        ]
    }
};

console.log("initializing webpack production build....");

module.exports = config;

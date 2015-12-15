global.__DEV__ = true;

const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const opn = require("opn");
const config = require("./webpack.config");

const host = "localhost";
const port = 3000;

config.entry.unshift(
	"webpack-dev-server/client?http://" + host + ":" + port,
	"webpack/hot/only-dev-server"
);

new WebpackDevServer(webpack(config), {
	contentBase: "./static",
	publicPath: config.output.publicPath,
	hot: true,
	historyApiFallback: true,
	stats: { colors: true }
}).listen(port, host, err => {
	if (err) {
		console.error(err);
	}

	opn("http://" + host + ":" + port);

	console.log("Listening at " + host + ":" + port);
});

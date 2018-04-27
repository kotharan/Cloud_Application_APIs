module.exports = function (req, res, next) {
     console.log("----------------------------------");
	console.log("== Request received");
	console.log("  - Method:", req.method);
	console.log("  - URL:", req.url);
     console.log("---------------------------------");
	next();
};

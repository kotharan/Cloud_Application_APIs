var express = require('express');
var app = express();
var PORT = process.env.PORT || 8000;
var logger = require('./logger.js');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
var lodging = require('./lodgings.json');
app.use(logger);
var review = require('./review.json');
var categories = require('./categories.json');
app.use(express.static('public'));

console.log("------------------------------------------------------------------------------------------------------------------------::");

app.listen(PORT, function()
{
	console.log("==Server is running on port",PORT);
});

// process.env.PORT=8000;
// console.log("PORT is::", process.env.PORT + "  Remove the exit to move forward");

//ROOT PAGE WITH HELLO WORLD
app.get('/', function (req, res, next)
	{
	res.status(200).send("Hello World.");
	});

// To get names of all businesses
app.get('/businesses', function(req,res,next){

	// var to_return = [];
	// lodging.forEach(function (lodging){
	//     to_return.push(lodging);
	// });
	//

	var getNames = lodging;
	res.status(200).json(getNames.map(x => x.bname));

	// 	console.log(" -- req.query:", req.query);
	// 	res.status(200).send(lodging);
	// 	var page = parseInt(req.params.page) || 1;
	// 	var numPerPage = 10;
	// 	var lastPage = Math.ceil(lodging.length / numPerPage);
	// 	page = page < 1 ? 1 : page;
	// 	page = page > lastPage ? lastPage : page;
	// 	var start = (page - 1) * numPerPage;
	// 	var end = start + numPerPage;
	// 	var pageLodgings = lodging.slice(start, end);
	// 	var links = {};
	// 	if (page < lastPage) {
	// 		links.nextPage = '/lodging?page=' + (page + 1);
	// 		links.lastPage = '/lodging?page=' + lastPage;
	// 	}
	// 	if (page > 1) {
	// 		links.prevPage = '/lodging?page=' + (page - 1);
	// 		links.firstPage = '/lodging?page=1';
	// 	}
	//
	// 	res.status(200).json({
	// 	pageNumber: page,
	// 	totalPages: lastPage,
	// 	pageSize: numPerPage,
	// 	totalCount: lodging.length,
	// 	lodgings: pageLodgings,
	// 	links: links
	// });


});

// To Add a business
app.post('/businesses', function (req, res) {

	if (req.body && req.body.bname && req.body.baddress && req.body.bcity && req.body.bstate && req.body.bzip && req.body.bphone ) {


		var id = lodging.length + 1;
			res.status(201).json({
				id: id,
			bname: req.body.bname,
			baddress:req.body.baddress,
			bcity:req.body.bcity,
			bstate:req.body.bstate,
			bzip:req.body.bzip,
			bphone:req.body.bphone,
			bweb:req.body.bweb,
			bmail:req.body.bmail,
			links: {
				lodging: '/businesses/' + id

			}
		});
		lodging.push(req.body);
		} else {
			console.log("-req.query.else: ",req.query);

			res.status(400).json({
				Error: "Adding these data in the JSON format is mandatory Business Name , Street Address ,City , State , Zip Code , Phone Number"
			});
			}

});

// To Display Specific business data
app.get('/businesses/:lodgingID', function (req, res, next) {
	function verifyLodgingID(lodgingID)
	{
		return lodgingID == 0 || lodgingID && lodgingID > 0 && lodgingID < lodging.length;
	}
		var lodgingID = parseInt(req.params.lodgingID);
	if (verifyLodgingID(lodgingID) && lodging[lodgingID]) {
		res.status(200).json(lodging[lodgingID]);
	} else {
		res.status(404).json({
			Error: "Not a valid page"
		});
	}

});

// To Modify Specific business Data
app.put('/businesses/:lodgingID', function (req, res, next) {
	var lodgingID = parseInt(req.params.lodgingID);
	function verifyLodgingID(lodgingID)
	{
		return lodgingID == 0 || lodgingID && lodgingID > 0 && lodgingID < lodging.length;
	}
	if (verifyLodgingID(lodgingID) && lodging[lodgingID]) {
		//res.status(200).json(lodging[lodgingID]);
		if (req.body && req.body.bname && req.body.baddress && req.body.bcity && req.body.bstate && req.body.bzip && req.body.bphone ) {

			lodging[lodgingID] = req.body;
			res.status(200).json({
			links: {
			lodging: '/businesses/' + lodgingID
			}
			});
			console.log("Data has been Updated.\
			");
			lodging.push(req.body);
			} else {
				console.log("-req.query.else: ",req.query);

				res.status(400).json({
					Error: "To update the data adding these details in the JSON format is mandatory Business Name , Street Address ,City , State , Zip Code , Phone Number"
				});
				}
	} else {
		res.status(404).json({
			Error: "Not a valid page"
		});
	}



});

// To delete the specified business page info
app.delete('/businesses/:lodgingID',function (req, res, next) {
	function verifyLodgingID(lodgingID)
	{
		return lodgingID == 0 || lodgingID && lodgingID > 0 && lodgingID < lodging.length;
	}
		var lodgingID = parseInt(req.params.lodgingID);
	if (verifyLodgingID(lodgingID) && lodging[lodgingID]) {
		res.status(200).json(lodging[lodgingID]);
	} else {
		res.status(404).json({
			Error: "Not a valid page"
		});
	}

		var lodgingID = parseInt(req.params.lodgingID);
		if (verifyLodgingID(lodgingID)) {
			lodging[lodgingID] = null;
			res.status(204).end();
		} else {
			next();
		}
	}
);

// To view all the business and their info as a client
app.get('/user',function(req,res,next)
	{	console.log("List of all Businesses with their info printed on the Web");
	var getNames = lodging.slice();
	res.status(200).json(getNames.map(x => " Business Name: " + x.bname + ", " + " Business Street Address: " +  x.baddress + ", " + " Business City: " + x.bcity + ", " + " Business State: " + x.bstate + ", " + " Business Zip Code: "
	+ x.bzip + ", " + " Business Phone: " + x.bphone ));

	});

// To get specific detail about a business with reviews and pictures
app.get('/user/:lodgingID/review',function(req,res,next)
	{
		var lodgingID = parseInt(req.params.lodgingID);
	function verifyLodgingID(lodgingID)
	{
		return lodgingID == 0 || lodgingID && lodgingID > 0 && lodgingID < lodging.length;
	}


		if (verifyLodgingID(lodgingID) && lodging[lodgingID]) {
	// 		var index = review[lodgingID].reviews.length;
	// 		var x = review[lodgingID];
	// 		var z = review[lodgingID].reviews[0];
	// 		var y = review[lodgingID].photo[0];
	// 		res.status(200).send(" Business Name: " + x.bname + " , " + " Business Street Address : " +  x.baddress + " , " + " Business City : " + x.bcity + " , " + " Business State : " + x.bstate + " , " + " Business Zip Code : " + x.bzip +
	// 		" , " + " Business Phone : " + x.bphone + " , "  + " Sample Image: " + y.bphoto  )
	//
	// 		function loop()
	// 		{
	// 		var i = 0;
	// 		for (i = 0 ; i < index ; i++){
	//
	// 		res.json( " Stars : " + review[lodgingID].reviews[i].bstar + " stars" + " , " + " How Expensive : " + review[lodgingID].reviews[i].bdollar + " dollar signs , " + "Customer's Review : " + review[lodgingID].reviews[i].breview ) ;
	// }}
		res.status(200).json(review[lodgingID]);

		} else {
			res.status(404).json({
				Error: "Not a valid page"
			});
		}

		});

//  Adding a review from the user Need to work on it
app.post('/user/:lodgingID/addreview',function(req,res,next)
	{

		var bstars = [];
		var lodgingID = parseInt(req.params.lodgingID);
		var index = review[lodgingID].reviews.length;
		if (req.body) {
			if(req.body.bstar >= 0 && req.body.bstar <= 5 && req.body.bdollar > 0 && req.body.bdollar < 5){

			console.log("Feedback has been added , Thank you");
			review[lodgingID].reviews[index] = req.body;

			//bstars.push(req.body.bstar);
			var id = review[lodgingID].id - 1 ;
				res.status(201).json({
				bname: review[lodgingID].bname,
				bstar:  "Your Feedback as stars: " + req.body.bstar + " stars",
				bdollar: " Your Expense Feedback : " + req.body.bdollar + " dollar signs",
				breview: req.body.breview,
				links: {
					lodging: '/user/' + id + '/review'

				}
			});
		}
			else
			{
				res.status(400).json({
					Error: " Data is mandatory and Star range is from 0 to 5 and Expensive Dollar is from 1 to 4"});
			}
			}

		 else {
				console.log("-req.query.else: ",req.query);

				res.status(400).json({
					Error: "Adding these data in the JSON format is mandatory, No of Stars and How Expensive"});
				}
	});

// To Update a star and dollar review
app.put('/user/:lodgingID/review',function(req,res,next)
	{
		var lodgingID = parseInt(req.params.lodgingID);
		function verifyLodgingID(lodgingID)
		{
			return lodgingID == 0 || lodgingID && lodgingID > 0 && lodgingID < lodging.length;
		}
		if (verifyLodgingID(lodgingID) && lodging[lodgingID]) {
			//res.status(200).json(lodging[lodgingID]);
			if (req.body && req.body.bstar && req.body.bdollar ) {
				if(req.body.bstar >= 0 && req.body.bstar <= 5 && req.body.bdollar > 0 && req.body.bdollar < 5){

				review[lodgingID] = req.body;
				res.status(200).json({
				bname: review[lodgingID].bname,
				bstar: "Your Updated Feedback: " + req.body.bstar + " stars",
				bdollar: "Your Updated Feedback : " + req.body.bdollar + " dollar signs",
				breview: req.body.review,
				links: {
				lodging: '/user/' + lodgingID + 'review'
				}
				});
				console.log("Feedback has been Updated.");
				review.push(req.body);
				}
			else
			{
				res.status(400).json({
				Error: "Star range is from 0 to 5 and Expensive Dollar is from 1 to 4"
			});
			}
		} else {
					console.log("-req.query.else: ",req.query);

					res.status(400).json({
						Error: "To update you need to add no of stars and no of dollar signs "
					});
					}
		} else {
			res.status(404).json({
				Error: "Not a valid page"
			});
		}


	});

// To delete a user feedback
app.delete('/user/:lodgingID/review',function(req,res,next)
	{
		function verifyLodgingID(lodgingID)
		{
			return lodgingID == 0 || lodgingID && lodgingID > 0 && lodgingID < lodging.length;
		}
			var lodgingID = parseInt(req.params.lodgingID);
		if (verifyLodgingID(lodgingID) && lodging[lodgingID]) {
			res.status(200).json(review[lodgingID]);
		} else {
			res.status(404).json({
				Error: "Not a valid page"
			});
		}
		console.log("Stars and Dollar Sign Feedback have been set to null");
			var lodgingID = parseInt(req.params.lodgingID);
			if (verifyLodgingID(lodgingID)) {
				var i = review[lodgingID].reviews.length - 1;
				review[lodgingID].reviews[i].bstar = null;
				review[lodgingID].reviews[i].bdollar = null;
				res.status(204).end();
			} else {
				next();
			}
		}
	);

// Just to see an image of a business [Shows Business name and the image name ]
app.get('/user/:lodgingID/:pic',function(req,res,next)
	{
		var lodgingID = parseInt(req.params.lodgingID);
		var pic = parseInt(req.params.pic)
		function verifyLodgingID(lodgingID)
		{
			return lodgingID == 0 || lodgingID && lodgingID > 0 && lodgingID < lodging.length;
		}
		function imageID(pic)
		{
			return pic == 0 || pic && pic > 0 && pic < review[lodgingID].photo.length; // photo length is alwasys zero (index)
		}


			if (verifyLodgingID(lodgingID) && lodging[lodgingID] && imageID(pic) ) {

		//	var y = review[lodgingID].photo;
			res.status(200).send(review[lodgingID].photo)

		} else {
			res.status(404).json({
				Error: "Not a valid page"
			});
		}

	});

// To upload an image
app.post('/user/:lodgingID/:pic',function(req,res,next)
	{
		var lodgingID = parseInt(req.params.lodgingID);
		var index = review[lodgingID].photo.length;
		function verifyLodgingID(lodgingID)
		{
			return lodgingID == 0 || lodgingID && lodgingID > 0 && lodgingID < lodging.length;
		}
	//	var y = review[lodgingID].photo[0].bphoto;
		if (verifyLodgingID(lodgingID) && lodging[lodgingID] ){
		if (req.body && req.body.bphoto ) {

			console.log("Photo has been uploaded , Thank you");
			review[lodgingID].photo[index] = req.body;
		//	var id = review[lodgingID].photo.length - 1 ;
				res.status(201).json({


				bphoto:  req.body.bphoto,
				caption: req.body.caption,

				links: {
					lodging: '/user/' + req.params.lodgingID + "/" + req.params.lodgingID

				}
			});
		//	review[lodgingID].photo.push(req.body);

			}

		 else {
				console.log("-req.query.else: ",req.query);

				res.status(400).json({
					Error: "Adding these data in the JSON format is mandatory, Photo and caption if needed "});
				}
			}
	}
);

// To delete a photo
app.delete('/user/:lodgingID/:pic',function(req,res,next)
	{
		var lodgingID = parseInt(req.params.lodgingID);
		var pic = parseInt(req.params.pic);
		function verifyLodgingID(lodgingID)
		{
			return lodgingID == 0 || lodgingID && lodgingID > 0 && lodgingID < lodging.length;
		}

			function imageID(pic)
			{
				return pic == 0 || pic && pic > 0 && pic < review[lodgingID].photo.length; // photo length is alwasys zero (index)
			}
			if (verifyLodgingID(lodgingID) && lodging[lodgingID] && imageID(pic)) {

				var y = review[lodgingID].photo[0];

			res.status(200).json(review[lodgingID]);
		} else {
			res.status(404).json({
				Error: "Not a valid page"
			});
		}
		console.log(" Photo upload have been set to null");
			if (verifyLodgingID(lodgingID)) {
				review[lodgingID].photo[pic].bphoto = null;
				review[lodgingID].photo[pic].caption = null;
				res.status(204).end();
			} else {
				next();
			}

	});

// Get the business names of a specific owner
app.get('/mybusinesses/:oid',function(req,res,next)
		{
				var arr = [];
				var i = 0;
				var oid = parseInt(req.params.oid);
				var lodgingID = parseInt(req.params.lodgingID);
			//if (verifyLodgingID(lodgingID) && lodging[lodgingID]) {

					for(i = 0 ; i < lodging.length  ; i++)
				{

					if(lodging[i].owner == oid)
					{

						var x = review[lodgingID];
						arr.push(lodging[i].bname)
					}
				}
				res.status(200).json(" Business Names: " + arr );
			// } else {
			// 	res.status(404).json({
			// 		Error: "Not a valid page"
			// 	});
			// }
		})

// Get category of a business
app.get('/businesses/:lodgingID/category',function(req,res,next)
	{
		var lodgingID = parseInt(req.params.lodgingID);
		function verifyLodgingID(lodgingID)
		{
			return lodgingID == 0 || lodgingID && lodgingID > 0 && lodgingID < lodging.length;
		}
		if (verifyLodgingID(lodgingID) && lodging[lodgingID]) {
			console.log("Category of the business is being displayed ");
		res.status(200).json("Category of your place: " + categories[lodgingID].category + " " + " Subcategories:  " + categories[lodgingID].subcategories.map(c => c.type));
		}
	else {
		res.status(404).json({
			Error: "Not a valid page"
		});
	}
});

//To view owner specific reviews
app.get('/myreviews/:oid',function(req,res,next)
	{
		var arr = [];
		oid = parseInt(req.params.oid);
		var i = 0;
	for (i = 0 ; i < review.length ; i++)
	{

		if(review[i].owner == oid )
		{
		arr.push(review[i].bname,review[i].reviews);
	}
	}
	res.status(200).json(arr);

	});

// To view owner specific uploaded photos
app.get('/myphotos/:oid',function(req,res,next)
	{

		var arr = [];
		oid = parseInt(req.params.oid);

		var i = 0;
	for (i = 0 ; i < review.length ; i++)
	{

		if(review[i].owner == oid )
		{
		arr.push(review[i].bname,review[i].photo);
	}
	}
	res.status(200).json(arr);


	});

// To add categories and subcategories
app.post('/business/addcategory',function(req,res,next)
	{

		var bstars = [];
		//var lodgingID = parseInt(req.params.lodgingID);
		var index = categories.length;
		if (req.body) {
			if(req.body && req.body.category && req.body.type0 && req.body.type1 && req.body.type2 && req.body.type3){

			console.log("Category has been added , Thank you");
			categories[index] = req.body;

			//bstars.push(req.body.bstar);
			//var id = review[lodgingID].id - 1 ;
				res.status(201).json({
					cid:categories.length,
				category: req.body.category,
				type0:   req.body.type0 ,
				type1:   req.body.type1,
				type2: req.body.type2,
				type3: req.body.type3,
				links: {
					lodging: '/subcategories/' + (index + 1)

				}
			});
		}
			else
			{
				res.status(400).json({
					Error: " Category and type is mandatory "});
			}
			}

		 else {
				console.log("-req.query.else: ",req.query);

				res.status(400).json({
					Error: "Adding these data in the JSON format is mandatory,Categories and subcategories"});
				}
	});

// To view all the business categories
app.get('/business/categories',function(req,res,next)
	{
		var arr = [];
		var i = 0;
		for(i=0 ; i < categories.length ; i++)
		{
			arr.push(categories[i].category);
		}
		res.status(200).json(arr);

	});

// To delete a specific category and subcategories  as an admin
app.delete('/business/categories/:cid',function(req,res,next)
	{
		var cid = parseInt(req.params.cid);
		//var lodgingID = parseInt(req.params.lodgingID);
		//var pic = parseInt(req.params.pic);
		// function verifyLodgingID(lodgingID)
		// {
		// 	return lodgingID == 0 || lodgingID && lodgingID > 0 && lodgingID < lodging.length;
		// }
		//
		// 	function imageID(pic)
		// 	{
		// 		return pic == 0 || pic && pic > 0 && pic < review[lodgingID].photo.length; // photo length is alwasys zero (index)
		// 	}
		//
		// if (verifyLodgingID(lodgingID) && lodging[lodgingID] && imageID(pic)) {

	//			var y = review[lodgingID].photo[0];

			res.status(200).json("Category of your place: " + categories[cid].category + " " + " Subcategories:  " + categories[cid].subcategories.map(c => c.type));
		// }
		// else {
		// 	res.status(404).json({
		// 		Error: "Not a valid page"
		// 	});
		// }
		console.log(" Category have been set to null ");
		console.log(" To see the deleted category use this command :  curl http://localhost:8000/business/categories");
			// if (verifyLodgingID(lodgingID)) {
				categories[cid].category = null;
				categories[cid].subcategories[0].type = null;
				categories[cid].subcategories[1].type = null;
				categories[cid].subcategories[2].type = null;
				categories[cid].subcategories[3].type = null;

			//	review[lodgingID].photo[pic].caption = null;
				res.status(204).end();
			// } else {
			// 	next();
			// }
	});

// To modify categories and subcategories
app.put('/business/:cid/categories', function (req, res, next) {
	var cid = parseInt(req.params.cid);
	function verifycid(cid)
	{
		return cid == 0 || cid && cid > 0 && cid < categories.length;
	}
	//	if (verifycid(cid)) {
		//res.status(200).json(lodging[cid]);
		if (req.body && req.body.category && req.body.type && req.body.type1 && req.body.type2 && req.body.type3 ) {

			categories[cid].category = req.body.category;
			categories[cid].subcategories[0].type = req.body.type;
			categories[cid].subcategories[1].type = req.body.type1;
			categories[cid].subcategories[2].type = req.body.type2;
			categories[cid].subcategories[3].type = req.body.type3;
			res.status(200).json({
			links: {
			categories: '/business/' + cid + '/categories'
			}
			});
			console.log("Data has been Updated.\
			");
			categories.push(req.body);
			} else {
				console.log("-req.query.else: ",req.query);

				res.status(400).json({
					Error: "To update the data you should add categories and subcategories"
				});
				}
	// } else {
	// 	res.status(404).json({
	// 		Error: "Not a valid page"
	// 	});
	// }



});

// List all subcategories associated with a given category.
app.get('/subcategories/:cid',function(req,res,next)
	{
	var cid = parseInt(req.params.cid) - 1;
	if ( cid < categories.length && cid >= 0)
	{
	res.status(200).json("For Category :" + categories[cid].category + " and Subcategories are : " + categories[cid].subcategories.map(c => c.type) );
	}
	else {
		res.status(200).json("That is not a category. ");
	}
	});

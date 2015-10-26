Parse.initialize("LCURhPt8t0EgJg7IccyFwyFYQGd9q2dUCXAby2XR", "TXwEjUjRjdp0ObwlCpgcaAjGAByapWkcSqFadK77");

var Review = Parse.Object.extend('Review');

var currentUser = Parse.User.current();

// if there is a current user then the signup should turn to logout
if (currentUser != null) {
	$("#signup").text("Logout");
	$("#account-form").attr("action", "");
}

// Log user out if there is a current user
$("#signup").on("click", function() {
	if (currentUser != null) {
		$("#signup").text("Sign Up or Sign In");
		Parse.User.logOut();
	}
});

$("#user-rating").raty();

$("#review-form").submit(function() {
	// require user to sign in to review
	if (currentUser != null) {
		var reviewItem = new Review();

		var titleInput = $("#review-title");
		var contentInput = $("#review-content");

		// prevent no title in review
		if (titleInput.val().trim() == "" || contentInput.val().trim == "") {
			alert("You must include a title and review content!");
			return false;
		} 

		// prevent no content in review
		if ($("#user-rating").raty("score") == null) {
			alert("Please enter a 1-5 rating for this product");
			return false;
		}

		var d = new Date();

		// set values
		reviewItem.set("title", titleInput.val());
		reviewItem.set("content", contentInput.val());
		reviewItem.set("rating", parseInt($("#user-rating").raty("score")));
		reviewItem.set("votes", 0);
		reviewItem.set("points", 0);
		reviewItem.set("date", d.toDateString());
		reviewItem.set("user", Parse.User.current());

		reviewItem.save(null, {
			success: function() {
				// reset inputs
				titleInput.val("");
				contentInput.val("");
				$("#user-rating").raty({score: 0});
				getData();
			}
		});
	} else {
		alert("You must sign in to review this product!");
	}
	
	return false;
});

var getData = function() {
	var query = new Parse.Query(Review);

	query.ascending("createdAt");
	query.exists("title");
	query.include("user");

	query.find({
		success: function (data) {
			buildList(data.reverse());
		}
	});
}

var buildList = function(data) {	
	$("ol").empty();
	var rating = 0;
	data.forEach(function(item) {
		rating += item.get("rating");
		addItem(item);
	});
	// set avg rating stars
	$("#avg-rating").raty({score: rating/(data.length), readOnly: true});
}

var addItem = function(item) {
	var title = item.get("title");
	var content = item.get("content");
	var votes = item.get("votes");
	var points = item.get("points");
	var rating = item.get("rating");
	var date = item.get("date");
	var user = item.get("user");
	
	// brick of elements
	var li = $("<li></li>");
	var div = $("<div class='review-div'></div>");
	var upVote = $("<button class='voting'><span class='glyphicon glyphicon-thumbs-up'></span></button>");
	var downVote = $("<button class='voting'><span class='glyphicon glyphicon-thumbs-down'></span></button>");
	var ratyDiv = $("<div id='rated-score' class='raty'></div>")
	var h2Title = $("<h2></h2>");
	var pDate = $("<p class='pReview'></p>");
	var h3Content = $("<h3></h3>");
	var pPoints = $("<p class='pReview'></p>");
	var deleteButton = $("<button id='delete'><span class='glyphicon glyphicon-remove'></span></button>")

	deleteButton.on("click", function() {
		item.destroy({
			success: function() {
				getData();
			}
		})
	});

	upVote.on("click", function() {
		if (currentUser == null) {
			alert("Must sign in to vote!");
		} else if (currentUser.id == user.id) {
			alert("Cheater! You cannot up vote your own review!");
		} else {
			// currentUser.addUnique("reviews", item.id);
			// currentUser.save();
			item.set("points", points += 1);
			item.set("votes", votes += 1);
			item.save();
			getData();	
		}
	});

	downVote.on("click", function() {
		if (currentUser == null) {
			alert("Must sign in to vote!");
		} else if (currentUser.id == user.id) {
			alert("Why would you even want to down vote your own review??");
		} else {
			// currentUser.addUnique("reviews", item.id);
			// currentUser.save();
			item.set("votes", votes += 1);
			item.save();
			getData();
		}
	});

	h2Title.text(title);
	pDate.text("Created on " + date + " by " + user.getUsername( ));
	h3Content.text(content);

	if (votes == 0) {
		pPoints.text("This review has not been voted on yet. Be the first!");
	} else {
		pPoints.text(points + " out of " + votes + " found this review helpful.");
	}

	if (currentUser != null && currentUser.id == user.id) {
		pPoints.append(deleteButton);
	}

	h2Title.append(downVote);
	h2Title.append(upVote);
	div.append(h2Title);
	div.append(ratyDiv);
	div.append(pDate);
	div.append(h3Content);
	div.append(pPoints);
	li.append(div);

	$("ol").append(li);

	ratyDiv.raty({score: rating, readOnly: true});
	
}

getData();
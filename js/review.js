Parse.initialize("LCURhPt8t0EgJg7IccyFwyFYQGd9q2dUCXAby2XR", "TXwEjUjRjdp0ObwlCpgcaAjGAByapWkcSqFadK77");

var Review = Parse.Object.extend('Review');

$("#user-rating").raty();

$("form").submit(function() {
	console.log("clicked");
	var reviewItem = new Review();

	var titleInput = $("#review-title");
	var contentInput = $("#review-content");

	if (titleInput.val().trim() == "" || contentInput.val().trim == "") {
		alert("You must include a title and review content!");
		return false;
	} 

	if ($("#user-rating").raty("score") == null) {
		alert("Please enter a 1-5 rating for this product");
		return false;
	}

	var d = new Date();

	reviewItem.set("title", titleInput.val());
	reviewItem.set("content", contentInput.val());
	reviewItem.set("rating", parseInt($("#user-rating").raty("score")));
	reviewItem.set("votes", 0);
	reviewItem.set("points", 0);
	reviewItem.set("date", d.toDateString());

	reviewItem.save(null, {
		success: function() {
			console.log("saved!");
			titleInput.val("");
			contentInput.val("");
			$("#user-rating").raty({score: 0});
			getData();
		}
	});
	
	return false;
});

var getData = function() {
	var query = new Parse.Query(Review);

	query.ascending("createdAt");
	query.exists("title");

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
	$("#avg-rating").raty({score: rating/(data.length), readOnly: true});
}

var addItem = function(item) {
	var title = item.get("title");
	var content = item.get("content");
	var votes = item.get("votes");
	var points = item.get("points");
	var rating = item.get("rating");
	var date = item.get("date");
	
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
		item.set("points", points += 1);
		item.set("votes", votes += 1);
		item.save();
		getData();
	});

	downVote.on("click", function() {
		item.set("votes", votes += 1);
		item.save();
		getData();
	});

	h2Title.text(title);
	pDate.text("Created on " + date);
	h3Content.text(content);

	if (votes == 0) {
		pPoints.text("This review has not been voted on yet. Be the first!");
	} else {
		pPoints.text(points + " out of " + votes + " found this review helpful.");
	}

	pPoints.append(deleteButton);

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
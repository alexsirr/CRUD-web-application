Parse.initialize("LCURhPt8t0EgJg7IccyFwyFYQGd9q2dUCXAby2XR", "TXwEjUjRjdp0ObwlCpgcaAjGAByapWkcSqFadK77");

var Review = Parse.Object.extend('Review');

$("form").submit(function() {
	console.log("clicked");
	var reviewItem = new Review();

	var titleInput = $("#review-title");
	var contentInput = $("#review-content");

	if (titleInput.val().trim() == "" || contentInput.val().trim == "") {
		alert("You must include a title and review content!");
	} else {
		reviewItem.set("title", titleInput.val());
		reviewItem.set("content", contentInput.val());
		reviewItem.set("rating", 0);
		reviewItem.set("votes", 0);
		reviewItem.set("points", 0);

		reviewItem.save(null, {
			success: function() {
				console.log("saved!");
				titleInput.val("");
				contentInput.val("");
				getData();
			}
		});
		
	}
	
	return false;
});

var getData = function() {
	var query = new Parse.Query(Review);

	query.exists("title");

	query.find({
		success: function (data) {
			buildList(data);
		}
	});
}

var buildList = function(data) {	
	$("ol").empty();
	data.forEach(function(item) {
		addItem(item);
	});

}

var addItem = function(item) {
	console.log("adding item");
	var title = item.get("title");
	var content = item.get("content");
	var votes = item.get("votes");
	var points = item.get("points");
	
	var li = $("<li></li>");
	var div = $("<div class='review-div'></div>");
	var upVote = $("<button class='voting'><span class='glyphicon glyphicon-thumbs-up'></span></button>");
	var downVote = $("<button class='voting'><span class='glyphicon glyphicon-thumbs-down'></span></button>");
	var h2Title = $("<h2></h2>");
	var h3Content = $("<h3></h3>");
	var pPoints = $("<p></p>");

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
	h3Content.text(content);

	if (votes == 0) {
		pPoints.text("This review has not been voted on yet. Be the first!");
	} else {
		pPoints.text(points + " out of " + votes + " found this review helpful.");
	}

	h2Title.append(downVote);
	h2Title.append(upVote);
	div.append(h2Title);
	div.append(h3Content);
	div.append(pPoints);
	li.append(div);

	$("ol").append(li);
	
}

getData();
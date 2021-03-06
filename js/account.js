Parse.initialize("LCURhPt8t0EgJg7IccyFwyFYQGd9q2dUCXAby2XR", "TXwEjUjRjdp0ObwlCpgcaAjGAByapWkcSqFadK77");

Parse.User.logOut();

// user signup form
$("#signup-form").submit(function() {
	if ($("#signup-name").val() == "" && $("#signup-pass").val() == "") {
		alert("Cannot signup an empty account!");
	} else {
		var user = new Parse.User();
		user.set("username", $("#signup-name").val());
		user.set("password", $("#signup-pass").val());
		user.set("reviews", [])

		user.signUp(null, {
		  success: function(user) {
		    Parse.User.logIn($("#signup-name").val(), $("#signup-pass").val(), {
			  success: function(user) {
			    document.location.href = "index.html";
			  },
			  error: function(error) {
			    alert("Error: " + error.message);
			    clearInput();
			  }
			});
		  },
		  error: function(user, error) {
		    alert("Error: " + error.message);
		   	clearInput();
		  }
		});

		
	}
	return false;
});

// user sign in form
$("#signin-form").submit(function() {
	Parse.User.logIn($("#signin-name").val(), $("#signin-pass").val(), {
		success: function(user) {
			document.location.href = "index.html";
		},
		error: function(error) {
			alert("Error: " + error.message);
			clearInput();	
		}	
	});

	return false;
});

// clears all input fields
var clearInput = function() {
	$("#signup-name").val("");
	$("#signup-pass").val("");
	$("#signin-name").val("");
	$("#signin-pass").val("");
}
var database = firebase.database();
var bookRef = database.ref('book').orderByChild( "name");
var orderRef = database.ref('order');
var input = document.getElementById("book-input");
var numChild;
var dataArr = new Array();
var idArr = new Array();


//Add an order to database
function bookOrder(bookId){
	var borrowDate = document.getElementById("borrow-date").value;
	var uid = firebase.auth().currentUser.uid;

	orderRef.child(uid).once('value').then(function(snapshot){
		orderRef.child(uid).child(snapshot.numChildren()).update ({
			'bookId': [bookId],
			'borrowDate': [borrowDate],
			'returnDate': 'pending',
		});
		console.log("Done order?");
	});

}

//Fix modal for each book
function openOrderModal(bookId){

	var orderModalFooter = document.getElementById('order-modal-footer');
	var modalBookName = document.getElementById('modal-book-name');
	var modalBookInformation = document.getElementById('modal-book-information');
	//Set up body

	modalBookName.textContent = dataArr[bookId].name;
	modalBookInformation.textContent = dataArr[bookId].information;

	//Set up footer
	orderModalFooter.textContent = null;
	orderModalFooter.insertAdjacentHTML('beforeend',
		'<button type="submit" class="btn btn-default"' +
		' id="accept-order-' + idArr[bookId] + '"' +
		' data-dismiss = "modal"' +
		' onclick = "bookOrder(' + idArr[bookId] + ')"' +
		'>Accept</button>'
	);
}

function bookFilter(){
	//Filter book with a search bar
	var filter = input.value.toUpperCase();
	var found = false;

	var content = document.getElementById("content-filter");
	var errorMess = document.getElementById("content-error");

	content.textContent = null;

	//Create panel for each book found
	for (var i = 0; i < numChild; ++i){
		if (dataArr[i].name.toUpperCase().indexOf(filter) > -1){
			found = true;

			content.insertAdjacentHTML('beforeend', 
			'<div id = "book-id-1" class = "card col-xs-6 col-sm-4 col-md-3 col-lg-2">' +  
				'<div class="panel panel-default text-center">' +
			        '<div class="panel-heading">' +
			          	'<h3>' + dataArr[i].name + '</h3>' +
			        '</div>' +
			        '<div class="panel-body">' +
			          	'<img src = "https://via.placeholder.com/120x150">' +
			          	'<p>' + dataArr[i].information + '</p>' +
			        '</div>' +
			        '<div class="panel-footer">' +
			          	'<button class="btn btn-lg order-btn"' +
			          	' data-toggle = "modal" data-target = "#book-order-modal"' + 
			          	' id = "order-id-' + i + '"' +
			          	' onclick = "openOrderModal(' + i + ')"' +
			          	'>Order</button>' +
			        '</div>' +
			    '</div>' +
			'</div>');
		}
		
	}

	//Show error message if no books contain the key words
	if (!found){
		errorMess.textContent = "No results found.";
	}
	else {
		errorMess.textContent = null;
	}

}

function showBookInit(){
	//Take a snapshot of the database
	bookRef.once('value').then(function(snapshot) {
	  	
	  	numChild = snapshot.numChildren();
		snapshot.forEach(function (childSnapshot){
			idArr.push(childSnapshot.key);
			console.log(childSnapshot.key);
			dataArr.push(childSnapshot.val());
			console.log(childSnapshot.val());
		});
		document.getElementById("book-search-btn").textContent = "Search";
		bookFilter();

		//Check if user is logged in or not
		//to use the order function

		var orderBtns = document.getElementsByClassName("order-btn");
	    if (firebase.auth().currentUser) {
	    	for (var i = 0; i < orderBtns.length; i++){
	    		orderBtns[i].disabled = false;
	    		orderBtns[i].setAttribute("class", "btn btn-lg btn-success order-btn");
	    		orderBtns[i].setAttribute("title", null	);
	    	}
		}
		else {
			for (var i = 0; i < orderBtns.length; i++){
	    		orderBtns[i].disabled = true;
	    		orderBtns[i].setAttribute("class", "btn btn-lg order-btn");
	    		orderBtns[i].setAttribute("title", "You must log in to order");
	    	}
		}
	});

}



showBookInit();
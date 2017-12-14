$(document).ready(function() {
	$('#searchMessage').keydown(function(event){
		// only works when pressing 'Enter' key down
		if (event.which === 13 || event.keyCode === 13) {
			$('#container').removeClass("initialLoc");
			$.ajax({
				url: 'https://en.wikipedia.org/w/api.php',
				data: { 
					"action": "query",
					"format": "json",
					"origin": "*",
					"prop": "extracts",
					"indexpageids": "1",
					"generator": "search",
					"exsentences": "1",
					"exlimit": "10",
					"exintro": 1,
					"gsrsearch": $('#searchMessage').val(),
					"gsrnamespace": "0"},
				dataType: "json",
				success: results,
			});
			$('#searchMessage').val("");
		}
	});

	function results(data) {
		// check if the search provided any results
		if (data.query == null) {
			$('#searchResults').html('<p class="searchBox">We could not find any results from your search. Please try again.</p>').slideDown(1000);
			return;
		}
		// sort the page indexes from smallest to greatest
		// smallest id indicates closer search result
		var sortIndexArr = data.query.pageids.sort(function(a, b){
			return(a-b);
		});

		var htmlMessage = "";
		// loop through each page index
		// display the title of the wiki page
		// display the first sentence of the wiki page
		sortIndexArr.forEach(function(index){
			var url = "https://en.wikipedia.org/?curid=" + index;
			htmlMessage += '<a class="searchBox" href=' + url + ' target="_blank">';
			htmlMessage += '<h3><strong>' + data.query.pages[index].title + '</strong></h3>';
			htmlMessage += data.query.pages[index].extract + '</a>';
		});
		$('#searchResults').html(htmlMessage).slideUp(0, function(){
			$('#searchResults').html(htmlMessage).slideDown(2000);	
		});
	}
});
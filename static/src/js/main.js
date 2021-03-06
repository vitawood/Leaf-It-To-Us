$( "#popular" ).on( "click", filter );
$( "#type" ).on( "click", filter );
$( "#origin" ).on( "click", filter );
$( "#atoz" ).on( "click", filter );
$( "#temperatures" ).on( "click", filter );
$( "#top" ).on( "click", filter );
$("#recent-reviews").on("click", filter);
$("#add-favourite").on("click", saveTea);
$("#display-mugshot").mugshot();

function saveTea() {
	var $favButton = $(this);
	var tea_id = $(this).attr("data-teaid"); 
	$.get('/leafittous/save/', {tea_id: tea_id}, function(data){ 
		console.log(data);
			$favButton.html("Tea Favourited!"); 
			$favButton.prop('disabled', true);
	});
}

function filter(evt) {
	evt.preventDefault();
	if(evt.currentTarget.id == null || evt.currentTarget.id == '') return;
	var endpoint
	if(evt.currentTarget.id != null) {
		endpoint = evt.currentTarget.id
		console.log("endpoint " + endpoint)
	}
	var teaids = findTeaIds();
	url = '/leafittous/teas/'+endpoint+"/";

	$.ajax({
	  url: url,
	  type: 'POST',
	  data: JSON.stringify(teaids),
	  success: function(data){
	  	var receivedJson = JSON.parse(data);
	 	refresh_listview(receivedJson);
	  },
   		contentType: "application/json; charset=utf-8",
    	dataType: "json"
	});
}

function findTeaIds(selector) {
	var array = [];
	var found = {"tea_id": array};
	$(".filterable").find("[data-teaid]").each(function(i, item){ 
		array[i] = $(this).attr("data-teaid");
	});
	console.log(found);
	return found;
} 

function refresh_listview(json, container) {
	console.log(json);
	// if returned json is empty
	var $container = $(".filterable");
		if(jQuery.isEmptyObject(json) ) {
			$container.prepend('<div id="clear"><h4>No matches</h4><button class="btn btn-default" onClick="clearResults()" type="button">Clear results</button></div>');
		}	
	
	$container.find(".filter-item").hide();

	$.each(json, function(i, item) {
		$container.find('[data-teaid="'+item.pk+'"]').appendTo( $container ).show();
	});

	$container.hide();
	$container.fadeIn();
	$(document).trigger('_filter_refresh');
}

function clearResults() {
	var $container = $(".filterable");
	$container.find("#clear").hide();
	$container.find(".filter-item").show();
}

function updateScores() {
	$( ".score" ).each( function( index, element ){
		t = $(this).data("rating");
		if(t == 0) return $(this).html("No ratings yet");
	    for (var e = t, r = 0; r <= e; r++) {
	    	$(this).find('span:nth-child(' + r + ')').addClass("checked");
	    }
	});
}

$(document).on('_filter_refresh', function() { 
	updateScores();
});

$("#catalog-filter li a").on("click", function() {
	var $filterOption = $(this).text();
	console.log("hi"+$filterOption);
	$("#filter-menu .filter-option").text($filterOption);
	$(".active").removeClass("active");
	$(this).addClass("active");
});


$(".filterable, .review-section, .recent-posted-review").trigger('_filter_refresh', function() {
	updateScores();
});

$('#sub_review_btn').on("click", function(e){
    e.preventDefault();
    var slug_str = '&slug=' + tea_name_slug;    
    var review_to_send = $('form').serialize();
    review_to_send += slug_str;
    console.log(review_to_send);
    $.post('/leafittous/teas/reviews/', review_to_send).done(function(data){
    	data = JSON.parse(data);
    	console.log(data);
        $('#form-messages').empty();

        if(data.success === true) {
        	$('.new-review-text').hide();
        	$('#form-messages').html("review submitted");
        }
	    $.each(data.errors, function(i, item){ 
			$("#form-messages").append("<li>"+ i + " " + item[0]+"</li>");
		});

    });
});
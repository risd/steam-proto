
			 $(document).ready(function() {
			    $(".innovation-title, .happening-title" ).lettering();
			    // $(".happening-title").lettering();
			    // $(".creativity-title").lettering();


			    $(window).scroll(function(){
			    	if($(window).scrollTop()>750){
			    		$(".innovation-title").addClass("revealed");
			    		

			    	}

			    	if($(window).scrollTop()>4550){
			    		// $(".creativity-title").css("opacity","0.2");
			    		$(".creativity-title").addClass("clean");


			    	}

			    	if($(window).scrollTop()>100){
			    		// $(".creativity-title").css("opacity","0.2");
			    		$(".main-nav-container").addClass("mobile-hidden");
			    	}

			    	if($(window).scrollTop()<100){
			    		// $(".creativity-title").css("opacity","0.2");
			    		$(".main-nav-container").removeClass("mobile-hidden");
			    	}

			    });

			  	 $(".mobile-logo").click(function(){
			    	$(".main-nav-container").toggleClass("mobile-hidden");
			    	$(".blanket").toggleClass("blanketed")
			    });

			  });



	   	
    
	


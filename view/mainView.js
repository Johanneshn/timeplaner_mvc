function MainView (parent, model, generalController) {
		
		//Buttons
		this.addActivityButton	=	$( "#add-activity-button" );
		this.addDayButton		=	$( "#add-day-button" );
		this.modalSaveButton 	=	$( "#modal-save-button" );
		this.modalEditButton 	=	$( "#modal-edit-button" );
		this.modalCloseButton   =	$( "#modal-close-button" );
		this.modalCancelButton 	=	$( "#modal-cancel-button" );
				
		//Div
		parkedActivities 	=	$( "#parked-activities" );
		this.daysContainer 		=	$( "#days-container" );
			
		//Variable for daynumber
		var dayNumber = 0;
		
		//Variable for canvas ID
		canvasIdNumber = 0;
		//activity ID
		activityId = 0;
		
		//variables for editactivity
		var theIndex,
			divParent,
			dayId;

		//Drag n drop
		var dragData = 
			{
				oldPosition:null,
				newPosition:null,
				oldDay:null,
				newDay:null
			};
		
		$( document ).ready( function( e )
		{
			
			$( "#activity-modal" ).modal(
			{
				backdrop: true,
				show: false,
				keyboard: false
				
			});
				
			$( "#add-activity-button" ).click( function()
			{	
				$( "#modal-edit-button" ).hide();
				$('#activity-modal').modal('show');
			} );
				
			$( ".activity-stack" ).sortable(
			{
				connectWith: '.activity-stack',

				start: function( event, ui )
				{						
					dragData.oldPosition = ui.item.index();
				},
					
				stop: function( event, ui ) 
				{
					dragData.newPosition = ui.item.index();
						
					// Get the old day
					var source = $( event.target );
					if( source.attr( "id" ) == "parked-activities" )
						dragData.oldDay = null; 
						
					else
						dragData.oldDay = source.parents( ".day" ).index();
							
					// Get the new day
					if( ui.item.parents( ".activity-stack" ).attr( "id" ) == "parked-activities" )
						dragData.newDay = null;
					
					else
						dragData.newDay = ui.item.parents( ".day" ).index();
					
					model.moveActivity(dragData.oldDay,dragData.oldPosition,dragData.newDay,dragData.newPosition);
				}
			});
		} );
		
		//Modal stuff goes here 
		this.activityNameModal = $( "#activity-name" );
		this.activityLengthModal = $( "#activity-length" );
		this.activityTypeModal = $( "#activity-type" );
		this.activityDescModal = $( "#activity-description" );

		//Convert activity type to ID for addactivity
		this.activityTypeId = function() {
		
			type = this.activityTypeModal.val();
			var typeID;
			if (type == "Presentation") {
				typeID = 0;	
			}
			else if (type == "Group Work" ) {
				typeID = 1;	
			}
			else if (type == "Discussion") {
				typeID = 2;
			}
			else if (type == "Break") {
				typeID = 3;
			}		
			return typeID;		
		}
		
		//Get function for passing variables to the controller (edit activity)
		this.getDayId = function () {
			return dayId;
		}	
		this.getIndex = function () {
			return theIndex;
		}	
		this.getDivParent = function () {
			return divParent;
		}
		
		//Updates the html for a activity when the Activity is edited
		this.editActivityHtml = function(div, index, day) {
							
			activitytype = model.days[day]._activities[index].getType().toLowerCase();

			if (activitytype == "group work") {
			activitytype = "group-work";	}		
			activity = div.children(index);	
			$(activity.children("div.title")[index]).html(model.days[day]._activities[index].getName());
			$(activity[index]).attr("class", "activity " + activitytype + " row-fluid");
			model.notifyObservers();
		
		}
		
		//Populate the Activity Stack
		this.addActivitiesToList  = function() {
			
			allparkedActivities = model.getParkedActivities();
			parkedActivities.html("");
			
			for (activity in allparkedActivities) { 
				var domDivMain,
				domDivTime,
				domDivTitle,
				
				type = allparkedActivities[activity].getType().toLowerCase();
					
				if (type == "group work") {
					type = "group-work";	
				}
				
				domDivMain = $( "<div>" );
				domDivMain.addClass( "activity " +  type + " row-fluid" );	
			
				domDivMain.attr("id", "activity-" + activityId);
				domDivMain.bind("dblclick", function() {
	
					theIndex = $(this).index();
					divParent = $(this).parent()
					updateActivityInDay($(this), theIndex, divParent);
					
				;});
				
				domDivTime = $( "<div>" );
				domDivTime.addClass( "time span3" );
				domDivTime.html( allparkedActivities[activity]._length + " min" );
	
				domDivTitle = $( "<div>" );
				domDivTitle.addClass( "title span9" );
				domDivTitle.attr("title", "Description : " + allparkedActivities[activity]._description);
				domDivTitle.tooltip({hide: { duration: 10 } });
				domDivTitle.html( allparkedActivities[activity]._name );
			
				//Appending Divs
				domDivMain.append( domDivTime );
				domDivMain.append( domDivTitle );
			
				activityId++;
				//Appending all the Divs to parked activites
				parkedActivities.append( domDivMain );		
			}
		}
		
		//Updates the activities in a day with the correct timestamp.
		//The first activity in a day gets the day start time, second gets the daystart+first activityduration etc
		this.setTimeForActivites = function() {
	
			days = model.getDays();
			
			for (day in days) {
				var currentTime,
				time,
				activities = model.getDay(day).getActivities();
				startTime = model.getDay(day)._start;
				dayActivityContainer = $( "#day"+day );
				activityDivs = $(dayActivityContainer).children();
				
				//Loop over the activites for each day
				for (activity in activities) {
						
						if (activity == 0) {
							currentTime = parseInt(startTime);		
						} 
						else {
						currentTime += activities[(activity - 1)].getLength();			
						};
	
						time = ("0" + Math.floor(currentTime/60)).slice(-2) + ":" + ("0" + (currentTime % 60)).slice(-2);
						//Change from duration to time for activities
						$(activityDivs[activity]).children("div.time").html(time);
				}			
			} 
		}
			
		//Function for adding a day to HTMl
		this.addDayToView = function() {
			
			domDivDay = $( "<div>" ); 
			domDivRow = $( "<div>" );
			domDivHeader = $( "<div>" );
			domDivHeaderInfo = $( "<div>" );
			domDivSummary = $( "<div>" );
			domDivActivity = $( "<div>" );
			domCanvas = $( "<canvas>" );
			timePickDiv = $('<div>');
		
			//Variable for canvas id
			canvasID = "canvas";
			
			//Creating the Divs	(adding classes)		
			domDivDay.addClass( "day" );
			domDivRow.addClass( "row-fluid full-height" );
			domDivHeader.addClass( "row-fluid" );
			domDivHeaderInfo.addClass( "span8" );
			domDivSummary.addClass( "span4 summary-box" );
			domDivActivity.addClass( "row-fluid activity-stack" );
			domDivActivity.attr('id', 'day'+ dayNumber);
				
			timePickDiv.attr('class','input-append bootstrap-timepicker');
			timePickDiv.append('<input id="startTime'+ dayNumber +'" type="text" class="input-small" value="08:00">');
			timePickDiv.append('<span class="add-on"><i class="icon-time"></i></span>');
			
			//Adding time info to the Header for the day				
			domDivHeaderInfo.append('<p>Start time: <span class="start-time"></span></p>');
			domDivHeaderInfo.append(timePickDiv);
			domDivHeaderInfo.append('<p>End time: <span class="end-time" id=end-time'+ dayNumber + '>' + model.days[dayNumber].getEnd() + '</span></p>');
			domDivHeaderInfo.append('<p>Total length: <span class="length" id=length' + dayNumber + '>' + model.days[dayNumber].getTotalLength() + '</span> min</p>');
			
			// --- CANVAS ----
			//Adding +1 to canvas ID
			canvasID = canvasID + canvasIdNumber.toString();
			
			//Adding ID to canvas
			domCanvas.attr("id", canvasID);
			canvasIdNumber ++;
			
			//Adding canvas ID to Summary Box
			domDivSummary.append( domCanvas );
			
			//Appending divs to each other
			domDivHeader.append( domDivHeaderInfo );
			domDivHeader.append( domDivSummary );
			domDivRow.append( domDivHeader );
			domDivRow.append( domDivActivity.sortable() );
			domDivDay.append( domDivRow );
			
			this.daysContainer.append( domDivDay );
			
			$( ".activity-stack" ).sortable(
			{
				connectWith: '.activity-stack',
					
				start: function( event, ui )
				{						
					dragData.oldPosition = ui.item.index();
		
				},
					
				stop: function( event, ui ) 
				{
										
					dragData.newPosition = ui.item.index();

					// Get the old day
					var source = $( event.target );
					if( source.attr( "id" ) == "parked-activities" )
						dragData.oldDay = null; 
						
					else
						dragData.oldDay = source.parents( ".day" ).index();
							
					// Get the new day
					if( ui.item.parents( ".activity-stack" ).attr( "id" ) == "parked-activities" )
						dragData.newDay = null;
					
					else
						dragData.newDay = ui.item.parents( ".day" ).index();
						
				model.moveActivity(dragData.oldDay,dragData.oldPosition,dragData.newDay,dragData.newPosition);
				}
			});
				
			//-- Implement Canvas ---
			var sampleBox = new Processing( $("#canvas" +dayNumber).get(0), summaryBox );
			sampleBox.update( 0, 0 ,0, 0 );
				
			//Init timepicker
			$('#startTime'+dayNumber).timepicker({
				minuteStep: 1,
				showMeridian: false
			});
		
			//Changes in the time
			$('#startTime'+dayNumber).change(function() { 				
				//Substring
				var hours = parseInt(this.value.substring(0,2),10);
				var minutes = parseInt(this.value.substring(3,5),10);
				
				//Update start
				model.days[$(this).attr('id').substring(9,10)].setStart(hours,minutes);				
				//Temp notifyobservers. Changes to the variable in the model wont trigger observers..
				model.notifyObservers();			
			});
		
			increaseDayNumber();		
		}
		
		//Add +1 to daynumber
		function increaseDayNumber() {	
			dayNumber++;
		}
			
		//Function for updating the time field, for each day.
		function updateTimeFields() {
			for (var i = 0; i <dayNumber; i++) {		
				//Update fields
				
				$( "#end-time" + i ).text(model.days[i].getEnd());
				$( "#length" + i ).text( model.days[i].getTotalLength());
				$( "#length" + i ).text( model.days[i].getTotalLength());
				
				presentationTotal = parseInt(model.days[i].getLengthByType(0)),
				groupWorkTotal =  	parseInt(model.days[i].getLengthByType(1));
				discussionTotal	=	parseInt(model.days[i].getLengthByType(2));
				breakTotal	=		parseInt(model.days[i].getLengthByType(3));
				totalSum = 		presentationTotal + groupWorkTotal + discussionTotal + breakTotal;			
				var sampleBox = new Processing( $("#canvas"+i).get(0), summaryBox );		
				sampleBox.update( (presentationTotal/totalSum)*100,  (discussionTotal/totalSum)*100 , (groupWorkTotal/totalSum)*100, (breakTotal/totalSum)*100 );			
			}
		}
		
		//Function for setting the right data in the modal fields, used for editing Activites in the day container
		function updateActivityInDay(element, index, list) {
	

			if (list.attr( "id" ) == "parked-activities" ){
				//Skipp to edit parked, for now
			}
			else {
			
				$( "#modal-save-button" ).hide();
				$( "#modal-edit-button" ).show();
			
				dayId = list.attr( "id" ).substring(3,4);
				dayActivites = model.days[dayId].getActivities();
				$( "#activity-name" ).val(dayActivites[index]._name);
				$( "#activity-length" ).val(dayActivites[index]._length);
				$( "#activity-description" ).val(dayActivites[index]._description);
		
				$('#activity-modal').modal('show');
				

			}		
		}

		
	/*****************************************  
	      Observer implementation    
	*****************************************/
	
	//Register an observer to the model
	model.addObserver(this);
	
	//This function gets called when there is a change at the model
	this.update = function(arg)
	{

	updateTimeFields()
	this.addActivitiesToList();
	this.setTimeForActivites();
	}



}
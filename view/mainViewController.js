
//main view controller

function MainViewController (view, model, generalController) {
		

		//Adding activity to stack button
		view.modalSaveButton.click( function(){
			model.addParkedActivity(new Activity(view.activityNameModal.val(), parseInt(view.activityLengthModal.val()), 
										view.activityTypeId(), view.activityDescModal.val(), view.activityID));
			$('#activity-modal').modal('hide');
		});
		
		//Add day button
		view.addDayButton.click( function(){
			model.addDay();
			view.addDayToView();	
		});
		
		//Edit button for activites
		view.modalEditButton.click (function(){
			
			$('#activity-modal').modal('hide');
			$( "#modal-save-button" ).show();
			$( "#modal-edit-button" ).hide();
			
			model.days[view.getDayId()]._activities[view.getIndex()].setName(view.activityNameModal.val());
			model.days[view.getDayId()]._activities[view.getIndex()].setLength(parseInt(view.activityLengthModal.val()));
			model.days[view.getDayId()]._activities[view.getIndex()].setTypeId(view.activityTypeId());
			view.editActivityHtml(view.getDivParent(), view.getIndex(), view.getDayId());
			model.days[view.getDayId()]._activities[view.getIndex()].setDescription(view.activityDescModal.val());
			

		});
		
		view.modalCloseButton.click (function(){
			$( "#modal-save-button" ).show();
			$( "#modal-edit-button" ).hide();
		});
		
		view.modalCancelButton.click (function(){
			$( "#modal-save-button" ).show();
			$( "#modal-edit-button" ).hide();
		});

		

				
			
}
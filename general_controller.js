function GeneralController (model) {


	//Declearing the view and the controller
	var mainView = new MainView($( "#main-view" ),model,this);
	var mainViewController = new MainViewController(mainView, model, this);
		
}

// JavaScript Document

// The possible activity types
var ActivityType = ["Presentation","Group Work","Discussion","Break"]

// This is an activity constractor
// When you want to create a new activity you just call
// var act = new Activity("some activity",20,1,"Some description);
function Activity(name,length,typeid,description){
	this._name = name;
	this._length = length;
	this._typeid = typeid;
	this._description = description;
	
	// sets the name of the avtivity
	this.setName = function(name) {
		this._name = name;
		model.notifyObservers();
	}
	
	// sets the length of the avtivity
	this.setLength = function(length) {
		this._length = length;
		model.notifyObservers();
	}
	
	// sets the typeid of the avtivity
	this.setTypeId = function(typeid) {
		this._typeid = typeid;
		model.notifyObservers();
	}
	
	// sets the description of the avtivity
	this.setDescription = function(description) {
		this._description = description;
		model.notifyObservers();
	}
	
	// This method returns the string representation of the
	// activity type.
	this.getType = function () {
		return ActivityType[this._typeid];
	};
	
	// This method returns the description of the activity.
	this.getDescription = function () {
		return this._description;
		
	}
	
	// Returns the length of the activity.
	this.getLength = function () {
		return this._length;
		
	}
		// Returns the length of the activity.
	this.getName = function () {
		return this._name;
	
	}
}

// This is a day consturctor. You can use it to create days, 
// but there is also a specific function in the Model that adds
// days to the model, so you don't need call this yourself.
function Day(startH,startM) {
	this._start = startH * 60 + startM;
	this._activities = [];

	// sets the start time to new value
	this.setStart = function(startH,startM) {
		this._start = startH * 60 + startM;
		model.notifyObservers();
	}

	// returns the total length of the acitivities in 
	// a day in minutes
	this.getTotalLength = function () {
		var totalLength = 0;
		$.each(this._activities,function(index,activity){
			totalLength += parseInt(activity._length);
		});
		return totalLength;
	};
	
	// returns the string representation Hours:Minutes of 
	// the end time of the day
	this.getEnd = function() {
		var end = this._start + this.getTotalLength();
		return ("0" + Math.floor(end/60) % 24).slice(-2) + ":" + ("0" + (end % 60)).slice(-2);
	};
	
	// returns the string representation Hours:Minutes of 
	// the start time of the day
	this.getStart = function() {
		return ("0" + Math.floor(this._start/60)).slice(-2) + ":" + ("0" + (this._start % 60)).slice(-2);
	};
	
	// returns the length (in minutes) of activities of certain type
	this.getLengthByType = function (typeid) {
		var length = 0;
		$.each(this._activities,function(index,activity){
			if(activity._typeid == typeid){
				length += activity._length;
			}
		});
		return length;
	};
	
	// adds an activity to specific position
	// if the position is not provided then it will add it to the 
	// end of the list
	this._addActivity = function(activity,position){
		if(position != null){
			this._activities.splice(position,0,activity);
		} else {
			this._activities.push(activity);
		}
	};
	
	// removes an activity from specific position
	// this method will be called when needed from the model
	// don't call it directly
	this._removeActivity = function(position) {
		return this._activities.splice(position,1)[0];
	};
	
	// moves activity inside one day
	// this method will be called when needed from the model
	// don't call it directly
	this._moveActivity = function(oldposition,newposition) {
		var activity = this._removeActivity(oldposition);
		this._addActivity(activity, newposition);
	};
	
	this.getActivities = function () {
		return this._activities;
		
	};
}


// this is our main module that contians days and praked activites
function Model(){
	this.days = [];
	this.parkedActivities = [];
	
	// adds a new day. if startH and startM (start hours and minutes)
	// are not provided it will set the default start of the day to 08:00
	this.addDay = function (startH,startM) {
		var day;
		if(startH){
			day = new Day(startH,startM);
		} else {
			day = new Day(8,0);
		}
		this.days.push(day);
		this.notifyObservers();
		return day;
	};
	
	// add an activity to model
	this.addActivity = function (activity,day,position) {
		if(day != null) {
			this.days[day]._addActivity(activity,position);
		} else {
			this.parkedActivities.push(activity);
		}
		this.notifyObservers();
	}
	
	// add an activity to parked activities
	this.addParkedActivity = function(activity){
		this.parkedActivities.push(activity);
		this.notifyObservers();
	};
	
	// remove an activity on provided position from parked activites 
	this.removeParkedActivity = function(position) {
		return this.parkedActivities.splice(position,1)[0];
		this.notifyObservers();
	};
	
	// moves activity between the days, or day and parked activities.
	// to park activity you need to set the new day to null
	// to move a parked activity to let's say day 0 you set oldday to null
	// and new day to 0
	/*
	 
	 *	------------------------------------------------------
	 */
	this.moveActivity = function(oldday, oldposition, newday, newposition) {
		if(oldday !== null && oldday == newday) {
			this.days[oldday]._moveActivity(oldposition,newposition);
		} else if(oldday == null) {
			var activity = this.removeParkedActivity(oldposition);
			if (newday == null) {
				this.addParkedActivityPos(activity, newposition);
				
			} else {
				this.days[newday]._addActivity(activity,newposition);
				
			}
		} else if(newday == null) {
			var activity = this.days[oldday]._removeActivity(oldposition);
			this.addParkedActivityPos(activity, newposition);
			
		} else {
			var activity = this.days[oldday]._removeActivity(oldposition);
			this.days[newday]._addActivity(activity,newposition);
			
		};
		this.notifyObservers();
	};
	
	//	Get Parked Activities
	this.getParkedActivities = function () {
		return this.parkedActivities;
		
	};
	//	Get Days
	this.getDays = function () {
		return this.days;
		
	};
	//	Get Day (position)
	this.getDay = function (pos) {
		return this.days[pos];
		
	}
	//	Add PArked Activity Pos
	this.addParkedActivityPos = function(activity, position){
		if(position != null){
			this.parkedActivities.splice(position,0,activity);
			
		} else {
			this.parkedActivities.push(activity);
			
		};
	};
	
	//*** OBSERVABLE PATTERN ***
	this._listeners = [];
	
	this.notifyObservers = function (args) {
			for (var i = 0; i < this._listeners.length; i++){
				this._listeners[i].update(args);
			}
	};
	
	this.addObserver = function (listener) {
			this._listeners.push(listener);
	};
	//*** END OBSERVABLE PATTERN ***
}

var model = new Model();
var actvity = new Activity();

Images = new Mongo.Collection('images');

Images.allow({
	insert: function(userId, doc){
		if(Meteor.user()){
			if(userId != doc.createdBy){
				return false
			}
			else{
				return true;
			}
		}
		else{
			return false;
		}
	},
	remove: function(userId, doc){
		return true;
	}
});
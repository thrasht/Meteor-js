import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
//import { Images } from '../imports/api/images.js';
import { Session } from 'meteor/session'
import './main.html';


Session.set("imageLimit", 8);

lastScrollTop = 0;


// $(window).scroll(function(event){
// 	console.log($(window).scrollTop());
// 	console.log($(window).height());
// 	console.log($(document).height());
// });
$(window).scroll(function(event){
	if($(window).scrollTop() + $(window).height() > $(document).height() - 100){	
		var scrollTop = $(this).scrollTop();

		if(scrollTop > lastScrollTop){
			Session.set("imageLimit", Session.get("imageLimit") + 4);
		}

		lastScrollTop = scrollTop;
	}
});

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});



//Template.images.helpers({images: img_data});
Template.images.helpers({
	images:function(){
		if (Session.get("userFilter"))
		{
			return Images.find({createdBy:Session.get("userFilter")}, {sort:{createdOn: -1}, limit:Session.get("imageLimit")});
		}
		else
		{
			return Images.find({}, {sort:{createdOn: -1}, limit:Session.get("imageLimit")});
		}
	},
	filtering_images:function(){
		if (Session.get("userFilter")){
			return true;
		}
		else{
			return false;
		}
	},
	getFilterUser:function(){
		if (Session.get("userFilter")){
			var user = Meteor.users.findOne({_id:Session.get("userFilter")});

			return user.username;
		}
		else{
			return "anon";
		}
	},
	getUser:function(user_id){
		var user = Meteor.users.findOne({_id:user_id});

		if(user){
			return user.username;
		}
		else
			return "annonymous";
	}
});

Template.body.helpers({username:function(){
	if(Meteor.user())
		return Meteor.user().emails[0].address;
	else
		return "puto";
	}
});

console.log("images: " + Images.find().count());

Template.images.events({
	'click .js-image': function(event){
		$(event.target).css("width", "50px");
	},
	'click .js-del-img': function(event){
		var image_id = this._id;

		console.log(image_id);
		$("#" + image_id).hide('slow', function(){
			Images.remove({"_id":image_id});
		});
	},
	'click .js-unset-image-filter': function(event){
		Session.set("userFilter", undefined);
	},
	'click .js-set-image-filter': function(event){
		Session.set("userFilter", this.createdBy);
	}
});

Template.image_add_form.events({
	'submit .js-add-image': function(event){

		var img_src, img_alt;

		img_src = event.target.img_src.value;
		img_alt = event.target.img_alt.value;
		console.log("src: " + img_src + " alt: " + img_alt);
		
		if(Meteor.user())
		{
			Images.insert({
				img_src: img_src,
				img_alt: img_alt,
				createdOn:new Date(),
				createdBy: Meteor.user()._id
			});
		}

		$('#image_add_form').modal('hide');

		return false;
	},
	'click .js-show-image-form': function(event){
		$('#image_add_form').modal('show');
	}

});

/*
Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});*/

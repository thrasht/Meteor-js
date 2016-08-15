import { Meteor } from 'meteor/meteor';
//import { Images } from '../imports/api/images.js';

console.log(Images.find().count());

Meteor.startup(() => {
  // code to run on server at startup
  if(Images.find().count() == 0)
  {
  	for(var i = 1; i < 23; i++)
  	{
  		Images.insert(
  		{
  			img_src: "img_" + i + ".jpg",
			img_alt: "image " + i
		}
  		);

  	}

  }
  console.log(Images.find().count());
  
});

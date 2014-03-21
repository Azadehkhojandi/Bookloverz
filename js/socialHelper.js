

var socialHelper = (function() {

 function getProfileDetail(socialChannel,response) {
      
     

    var person={};
    if (socialChannel=="Google")
    {

      
      if (response.image && response.image.url) {
        person.image=response.image.url;
      }
      if (response.displayName) {
        person.displayName=response.displayName;
      }
            
      if (response.cover && response.cover.coverPhoto && response.cover.coverPhoto.url) {
            person.coverImage=response.cover.coverPhoto.url;
      }

      if (response.emails) {
            person.emails=response.emails;      
      }
    }

    if (socialChannel=="Facebook")
    {

            
       if (response.id) {
        person.image="http://graph.facebook.com/" + response.id + "/picture?type=square";
        }
        if (response.name) {
          person.displayName=response.name;
        }
            
      // if (response.cover && response.cover.coverPhoto && response.cover.coverPhoto.url) {
      //       person.coverImage=response.cover.coverPhoto.url;
      // }

      if (response.email) {
            person.emails= new Array( response.email);      
      }

    }
      return person;



    };


  return {

    GetFriends:function(socialChannel,response)
    {
        var friends=new Array();
   var rawFriendsList=null;
   if (socialChannel=="Google")
    {
      if(response!=null && response.items)
      {
        rawFriendsList=response.items;
      }
    }
  if (socialChannel=="Facebook")
    { 
    if(response!=null && response.data)
      {
        rawFriendsList=response.data;
      }   
    }  

    if(rawFriendsList!=null)
    {
    $.each(rawFriendsList, function( index, item ) {
          var p=getProfileDetail(socialChannel,item);
          if(p!={})
          {
            friends.push(p);
          }
        });
    }
   return  friends;
    },
    GetProfileDetail: function(socialChannel,response) {
      
     return getProfileDetail(socialChannel,response);

    },



  };
})();

var facebookHelper = (function() {


 return {

  // Here we run a very simple test of the Graph API after login is successful. 
  // This testAPI() function is only called in those cases. 
  Profile: function (callback) {

    FB.api('/me', function(response) {
      var x={success:true,socialChannel:"Facebook",response:response};
      console.log(response);
      callback(x);
    });
  },
  Friends :function (callback)
  {
    FB.api('/me/friends', { fields: 'name,id' }, function(response) {
    var x={success:true,socialChannel:"Facebook",response:response};
      console.log(response);
      callback(x);
    });
  },
  Share:  function (shareObj, callback) {

            FB.ui(
                    {
                        method: 'feed',
                        name: shareObj.name,
                        link: shareObj.link,
                        picture: shareObj.picture,
                        caption: shareObj.caption,
                        description: shareObj.description
                    },
                    function (response) {
                        if (response && response.post_id) {
                            console.log('Post was published.');
                            callback();
                        } else {
                            console.log('Post was not published.');
                            callback();
                        }
                    }
                );
        },
  Disconnect:function ( callback) {
    FB.logout(function(response) {
        // user is now logged out
        var r={success:true, response:response};
        callback(r);
    });
  },
  Login:function ( callback) {
  
            FB.login(function (response) {
                if (response.authResponse) {

                    // connected
                    var accessToken = response.authResponse.accessToken;
                    var userid = response.authResponse.userID;
                    
                    var r={success:true, response:response};
                    callback(r);


                } else {
                    var r={success:false, response:response};
                    callback(r);

                    // cancelled
                }
            }, { scope: 'email' });
        }
  };
})();



var googleHelper = (function() {

  var BASE_API_PATH = 'plus/v1/';
  var userid;

  var auth;

  return {
    UserId:function()
    {
      console.log("userid" + userid);
      return userid;
    }
    ,
    Profile: function(callback){
      var request = gapi.client.plus.people.get( {'userId' : 'me'} );
      request.execute( function(profile) {
        console.log(profile);
        console.log(profile.id);
        userid=profile.id;
        var r={success:true,socialChannel:"Google",response:profile};
        callback(r );
      });
  },
    Friends: function(callback) {
      var request = gapi.client.plus.people.list({
        'userId': 'me',
        'collection': 'visible'
      });
      request.execute(function(people) {
        console.log(people);
         var r={success:true,socialChannel:"Google",response:people};
        callback(r );
      });
    },
    Init:function(authResult,Initcallback)
    {
      auth=authResult;
      gapi.client.load('plus','v1', function(){
        if (authResult['access_token']) {
          Initcallback({success:true});
        } else if (authResult['error']) {
          console.log('There was an error: ' + authResult['error']);
          Initcallback({success:false,error:authResult['error']});
        }
        //ErrorCallback('error');
        console.log('authResult', authResult);
        Initcallback({success:true});
      });
    },

    /**
     * Calls the OAuth2 endpoint to disconnect the app for the user.
     */
    Disconnect: function(callback) {
      
      if(gapi.auth.getToken()!=null)
      {
      // Revoke the access token.
      $.ajax({
        type: 'GET',
        url: 'https://accounts.google.com/o/oauth2/revoke?token=' +
            gapi.auth.getToken().access_token,
        async: false,
        contentType: 'application/json',
        dataType: 'jsonp',
        success: function(result) {
          var r= {success:true,result:result};
          callback(r);
          console.log('revoke response: ' + result);
         
        },
        error: function(e) {
          var r={success:false,result:e}
          callback(r);
          console.log(e);
        }
      });
      }
      else
      {
        var r={success:false,result:"token is empty"}
          callback(r);
      }
    },



  };
})();

/**
 * jQuery initialization
 */
$(document).ready(function() {
  $('#disconnect').click( function()
  {
   
   var socialChannel=$(this).data("socialChannel");
   if(socialChannel=="Google")
    { 
      googleHelper.Disconnect(UIDisconnect);
    }
    if(socialChannel=="Facebook")
    { 
      facebookHelper.Disconnect(UIDisconnect);
    }
  });
});

function UIDisconnect(result)
{
  if(result.success)
  {
    $('#friends').hide();
    $('#profile').hide();
    $('#gConnect').show();
    $('#fbConnect').show();
    $('#logout').hide();
  }
}

function UISetFriends(result)
{

	$('#friends').empty().show();

    if (result.success)
    {
      
      console.log(result.response) ;     
      var friends= socialHelper.GetFriends(result.socialChannel,result.response);
   
      $('#friends').append('Number of people visible to this app: ' + friends.length  + '<br/>');
      $.each(friends, function( index, item ) {     

          $('#friends').append('<p>' + item.displayName + '<img src="' + item.image + '">'+'</p>');
          
        });

	}
}




function UISetProfile(result)
{
  $('#profile').empty().show();
  if (result.success)
  {

   var person= socialHelper.GetProfileDetail(result.socialChannel,result.response);
   if(person!={})
   {
     $('#logout').show();
    $('#gConnect').hide();
    $('#fbConnect').hide();
    $('#profile').append(
      "<p>"+
      '<img src="' + person.image + '">'
        +
        person.displayName
      +
      "</p>"
      );
   }

    // if (result.response.error) {
    //       $('#profile').append(profile.error);
    //       return;
    //     }
        
       


  }
}
function onFBSignInCallback(response) {
  console.log("fbcallbk");
  console.log(response);
  facebookHelper.Profile(UISetProfile);
  facebookHelper.Friends(UISetFriends);
  $("#disconnect").data("socialChannel","Facebook");
  
}




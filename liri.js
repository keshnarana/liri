require("dotenv").config();
var request = require("request");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var fs = require("fs");
var spotify = new Spotify(keys.spotify);
var input = process.argv;
var command = input[2];
var final_input = "";
for (i = 3; i < input.length; i++) {
	final_input = final_input + " " + input[i];
}

final_input = final_input.trim().replace(" ", "+");
logs(final_input)
if(command == "concert-this"){
   
	if(final_input === ""){
      logs("provide more information");
      }

       var queryUrl = "https://rest.bandsintown.com/artists/"+final_input+"/events?app_id="+process.env.B_key;


       request(queryUrl, function(error, response, body) {

             if (!error && response.statusCode === 200) {

                  var JS = JSON.parse(body);
                  for (i = 0; i < JS.length; i++)
                    {

                             logs("\n--------------------"+JS[i].lineup +"-------------------------------\n");

        
                             logs("Date: " + moment(JS[i].datetime).format("MM/DD/YYYY"));
                             logs("Name: " + JS[i].venue.name);
                             logs("City: " + JS[i].venue.city);
                             if (JS[i].venue.region !== "")
                             {
                                     logs("Location: " + JS[i].venue.region);
                             }
                             logs( JS[i].venue.country);
                             logs("\n---------------------------------------------------\n");

                    }
                                                        }
                                                         })
}


else if(command == "spotify-this-song"){
    if(final_input === ""){
      final_input= "The sign";
    }
    
        spotify.search({ type: "track", query: final_input})
        .then(function(response){
            var output = response.tracks.items;
            for(i=0;i<output.length;i++){
                var artists = output[i].artists;
                for(j=0;j<artists.length;j++){
                   logs("Artist: " + artists[j].name);
                }
               logs("Song name: " + output[i].name);
               logs("Spotify link: " + output[i].external_urls.spotify);
               logs("Album: " + output[i].album.name);
               logs(" ");
            }
        })
        .catch(function(err){
           logs(err);
        })
    }


else if(command == "movie-this"){
    if(final_input === ""){
        final_input= "Mr. Nobody";
     
    }
  
        var omdbURL = "http://www.omdbapi.com/?t=" + final_input + "&y=&plot=short&apikey="+ process.env.M_Key;
        request(omdbURL, function(error, response, body){
      
           if (!error && response.statusCode === 200) {
            logs("Title: " + JSON.parse(body).Title);
            logs("The movie was made in: " + JSON.parse(body).Year);
            logs("IMDB Rating: " + JSON.parse(body).imdbRating);
             var ratings = JSON.parse(body).Ratings;
             for(i=0;i<ratings.length;i++){
                 if(ratings[i].Source == "Rotten Tomatoes"){
                    logs("Rotten Tomatoes Rating: " + ratings[i].Value);
                 }
             }
            logs("Produced in: " + JSON.parse(body).Country);
            logs("Languages: " + JSON.parse(body).Language);
            logs("Plot: " + JSON.parse(body).Plot);
            logs("Actors: " + JSON.parse(body).Actors);
         }
        
        })
    }


else if(command == "do-what-it-says"){
    fs.readFile("random.txt", "utf8", function(error, data){
        
        if(error){
            returnlogs(error);
        }

        var dataArr = data.split(",");

        if(dataArr[0] == "concert-this"){
            var bisURL = "https://rest.bandsintown.com/artists/" + dataArr[1] + "/events?app_id="+process.env.B_key;
            request(bisURL, function(error, response, body){
                if (!error && response.statusCode === 200) {
                    var output = JSON.parse(body);
                    for(i=0; i<output.length; i++){
                       logs("Venue: " + output[i].venue.name);
                       logs("Location: " + output[i].venue.city + ", " + output[i].venue.region);
                       logs("Date: " + moment(output[i].datetime).format("MM/DD/YYYY"));
                       logs(" ");
                    }
                }
            })
        }
        
        else if(dataArr[0] == "spotify-this-song"){
            if(dataArr[1] === undefined){
              
               dataArr[1]=  "The Sign";
       
            }
           
                spotify.search({ type: "track", query: dataArr[1]})
                .then(function(response){
                    var output = response.tracks.items;
                    for(i=0;i<output.length;i++){
         
                        var artists = output[i].artists;
                        for(j=0;j<artists.length;j++){
                           logs("Artist: " + artists[j].name);
                        }
                       logs("Song name: " + output[i].name);
                       logs("Spotify link: " + output[i].external_urls.spotify);
                       logs("Album: " + output[i].album.name);
                       logs(" ");
                    }
                })
                .catch(function(err){
                   logs(err);
                })
            }
        
        
        else if(command == "movie-this"){
            if(dataArr[0] === undefined){
                dataArr[0]="Mr. Nobody";
                   }
         
                var omdbURL = "http://www.omdbapi.com/?t=" + dataArr[1] + "&y=&plot=short&apikey="+process.env.M_Key;
                request(omdbURL, function(error, response, body){
        
                    if (!error && response.statusCode === 200) {
                       logs("Title: " + JSON.parse(body).Title);
                       logs("The movie was made in: " + JSON.parse(body).Year);
                       logs("IMDB Rating: " + JSON.parse(body).imdbRating);
                        var ratings = JSON.parse(body).Ratings;
                        for(i=0;i<ratings.length;i++){
                            if(ratings[i].Source == "Rotten Tomatoes"){
                               logs("Rotten Tomatoes Rating: " + ratings[i].Value);
                            }
                        }
                       logs("Produced in: " + JSON.parse(body).Country);
                       logs("Languages: " + JSON.parse(body).Language);
                       logs("Plot: " + JSON.parse(body).Plot);
                       logs("Actors: " + JSON.parse(body).Actors);
                    }
                
                })
            }
        
    })
}
else{
   logs("Please input a correct command.");
}

function logs(logs) {

	console.log(logs);

	fs.appendFile('log.txt', logs + '\n', function(err) {
		
		if (err) return logs('Error logging data to file: ' + err);	
	});
}
require("dotenv").config();
var request = require("request");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var fs = require("fs");
var spotify = new Spotify(keys.spotify);
var command = process.argv[2];
var input = process.argv[3];

if(command == "concert-this"){
    var bisURL = "https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp";
    request(bisURL, function(error, response, body){
        if (!error && response.statusCode === 200) {
            var output = JSON.parse(body);
            for(i=0; i<output.length; i++){
                console.log("Venue: " + output[i].venue.name);
                console.log("Location: " + output[i].venue.city + ", " + output[i].venue.region);
                console.log("Date: " + moment(output[i].datetime).format("MM/DD/YYYY"));
                console.log(" ");
            }
        }
    })
}

else if(command == "spotify-this-song"){
    if(input === undefined){
        console.log("Artist: Ace of Base");
        console.log("Song name: The Sign");
        console.log("Spotify link: https://open.spotify.com/track/3DYVWvPh3kGwPasp7yjahc?autoplay=true&v=T");
        console.log("Album: Happy Nation");
    }
    else{
        spotify.search({ type: "track", query: input})
        .then(function(response){
            var output = response.tracks.items;
            for(i=0;i<output.length;i++){
                var artists = output[i].artists;
                for(j=0;j<artists.length;j++){
                    console.log("Artist: " + artists[j].name);
                }
                console.log("Song name: " + output[i].name);
                console.log("Spotify link: " + output[i].external_urls.spotify);
                console.log("Album: " + output[i].album.name);
                console.log(" ");
            }
        })
        .catch(function(err){
            console.log(err);
        })
    }
}

else if(command == "movie-this"){
    if(input === undefined){
        console.log("Title: Mr. Nobody");
        console.log("The movie was made in: 2009");
        console.log("IMDB Rating: 7.9");
        console.log("Rotten Tomatoes Rating: 67%");
        console.log("Produced in: Belgium");
        console.log("Languages: English");
        console.log("Plot: A boy stands on a station platform as a train is about to leave. Should he go with his mother or stay with his father? Infinite possibilities arise from this decision. As long as he doesn't choose, anything is possible.");
        console.log("Actors: Jared Leto, Sarah Polley, Diane Kruger, Linh Dan Pham, Rhys Ifans, Natasha Little");
    }
    else{
        var omdbURL = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy";
        request(omdbURL, function(error, response, body){

            if (!error && response.statusCode === 200) {
                console.log("Title: " + JSON.parse(body).Title);
                console.log("The movie was made in: " + JSON.parse(body).Year);
                console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                var ratings = JSON.parse(body).Ratings;
                for(i=0;i<ratings.length;i++){
                    if(ratings[i].Source == "Rotten Tomatoes"){
                        console.log("Rotten Tomatoes Rating: " + ratings[i].Value);
                    }
                }
                console.log("Produced in: " + JSON.parse(body).Country);
                console.log("Languages: " + JSON.parse(body).Language);
                console.log("Plot: " + JSON.parse(body).Plot);
                console.log("Actors: " + JSON.parse(body).Actors);
            }
        
        })
    }
}

else if(command == "do-what-it-says"){
    fs.readFile("random.txt", "utf8", function(error, data){
        
        if(error){
            return console.log(error);
        }

        var dataArr = data.split(",");

        if(dataArr[0] == "concert-this"){
            var bisURL = "https://rest.bandsintown.com/artists/" + dataArr[1] + "/events?app_id=codingbootcamp";
            request(bisURL, function(error, response, body){
                if (!error && response.statusCode === 200) {
                    var output = JSON.parse(body);
                    for(i=0; i<output.length; i++){
                        console.log("Venue: " + output[i].venue.name);
                        console.log("Location: " + output[i].venue.city + ", " + output[i].venue.region);
                        console.log("Date: " + moment(output[i].datetime).format("MM/DD/YYYY"));
                        console.log(" ");
                    }
                }
            })
        }
        
        else if(dataArr[0] == "spotify-this-song"){
            if(dataArr[1] === undefined){
                console.log("Artist: Ace of Base");
                console.log("Song name: The Sign");
                console.log("Spotify link: https://open.spotify.com/track/3DYVWvPh3kGwPasp7yjahc?autoplay=true&v=T");
                console.log("Album: Happy Nation");
            }
            else{
                spotify.search({ type: "track", query: dataArr[1]})
                .then(function(response){
                    var output = response.tracks.items;
                    for(i=0;i<output.length;i++){
         
                        var artists = output[i].artists;
                        for(j=0;j<artists.length;j++){
                            console.log("Artist: " + artists[j].name);
                        }
                        console.log("Song name: " + output[i].name);
                        console.log("Spotify link: " + output[i].external_urls.spotify);
                        console.log("Album: " + output[i].album.name);
                        console.log(" ");
                    }
                })
                .catch(function(err){
                    console.log(err);
                })
            }
        }
        
        else if(command == "movie-this"){
            if(dataArr[0] === undefined){
                console.log("Title: Mr. Nobody");
                console.log("The movie was made in: 2009");
                console.log("IMDB Rating: 7.9");
                console.log("Rotten Tomatoes Rating: 67%");
                console.log("Produced in: Belgium");
                console.log("Languages: English");
                console.log("Plot: A boy stands on a station platform as a train is about to leave. Should he go with his mother or stay with his father? Infinite possibilities arise from this decision. As long as he doesn't choose, anything is possible.");
                console.log("Actors: Jared Leto, Sarah Polley, Diane Kruger, Linh Dan Pham, Rhys Ifans, Natasha Little");
            }
            else{
                var omdbURL = "http://www.omdbapi.com/?t=" + dataArr[1] + "&y=&plot=short&apikey=trilogy";
                request(omdbURL, function(error, response, body){
        
                    if (!error && response.statusCode === 200) {
                        console.log("Title: " + JSON.parse(body).Title);
                        console.log("The movie was made in: " + JSON.parse(body).Year);
                        console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                        var ratings = JSON.parse(body).Ratings;
                        for(i=0;i<ratings.length;i++){
                            if(ratings[i].Source == "Rotten Tomatoes"){
                                console.log("Rotten Tomatoes Rating: " + ratings[i].Value);
                            }
                        }
                        console.log("Produced in: " + JSON.parse(body).Country);
                        console.log("Languages: " + JSON.parse(body).Language);
                        console.log("Plot: " + JSON.parse(body).Plot);
                        console.log("Actors: " + JSON.parse(body).Actors);
                    }
                
                })
            }
        }
    })
}
else{
    console.log("Please input a correct command.");
}
require("dotenv").config();
var fs = require("fs"); //reads and writes files
var request = require("request");
var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require('node-spotify-api');
var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);
var songArray;
var movieName = '';


var userInput = process.argv[2];
var movieSong = '';
// switch statement.
liri();
function liri() {
  switch (userInput) {
    case 'my-tweets':
      twitter();
      break;
    case 'spotify-this-song':
      song();
      break;
    case 'movie-this':
      movie();
      break;
    case 'do-what-it-says':
      random();

  }
}
// functions
function twitter() {
  var params = {screen_name: 'BeesleyChris1', count: 20};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      for (var i = 0; i < tweets.length; i++) {
        var time = tweets[i].created_at;
        var timeArray = time.split(' ').slice(0, 3).join('-');
        console.log(tweets[i].text + ' ' + timeArray);
      }
    }
  });
}

function song() {
  if (movieSong !== '') {
    songArray = movieSong;
  } else if (!process.argv[3]) {
    songArray = 'Hey Jude';
  } else {
    songArray = [];
    movieSong = process.argv;
    for (var i = 3; i < movieSong.length; i++) {
      songArray.push(movieSong[i]);
    }
    songArray = songArray.join(' ');
  }
  spotify.search({ type: 'track', query: songArray }, function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  } else {
    console.log('The Song is ' + songArray.toUpperCase() + ' by ' + data.tracks.items[0].artists[0].name + '. The album is: ' + data.tracks.items[0].album.name + '. Here is a link: ' + data.tracks.items[0].artists[0].external_urls.spotify);

  }

  });
}

function movie() {
  if (movieSong != '') {
    movieSong = movieSong.trim().replace(' ', '+');
    movieName = movieSong;


  } else if (!process.argv[3]) {
    movieName = 'Mr+Nobody';
  } else {
    movieSong = process.argv;
    for (var i = 3; i < movieSong.length; i++) {
      if (i > 3 && i < movieSong.length) {
        movieName = movieName + '+' + movieSong[i];
      } else {
        movieName += movieSong[i];
      }
    }
  }
  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

  // console.log(queryUrl);
  request(queryUrl, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      // console.log(JSON.parse(body));
      console.log('Title of the movie: ' + JSON.parse(body).Title);
      console.log(JSON.parse(body).Title + ' came out in ' + JSON.parse(body).Year);
      console.log('The IMDB rating is: ' + JSON.parse(body).imdbRating);
      console.log('The Rotten Tomatoes Rating is: ' + JSON.parse(body).Ratings[1].Value);
      console.log('It was produced in ' + JSON.parse(body).Country);
      console.log('The language was ' + JSON.parse(body).Language);
      console.log('The plot is: ' + JSON.parse(body).Plot);
      console.log('It stared: ' + JSON.parse(body).Actors);
    } else {
      console.log(error);
      console.log(response.statusCode);
    }
  });
}

function random() {
  fs.readFile('random.txt', 'utf8', function(error, data) {
    if (error) {
      console.log(error);
    } else {
      var dataArr = data.split(',');
      userInput = dataArr[0];
      movieSong = dataArr[1];
      movieSong = movieSong.replace('"', ' ');
      movieSong = movieSong.replace('"', ' ');
      liri();
    }
  });
}

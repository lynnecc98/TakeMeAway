var DEBUG = true;
var flickrAPIKey = '52f881a0fa41b673ed54a22c7e3b1762';
var flickrURL = 'https://api.flickr.com/services/rest/?method=';
var lastfmAPIKey = '75ac8cb01596a28498cfc5567f68a8c8';

var lat;
var lon;
var size;

window.onload=function(){
   initMap();
}

Array.prototype.pick = function() {
    return this[Math.floor(Math.random()*this.length)];
}

function generate() {
    // IMAGE FOR DISPLAY
    console.log("Fetching images for subject " );
    $.ajax({
        url: flickrURL + 'flickr.photos.search'
        + '&text=road&sort=relevance&content_type=1&has_geo=1&extras=url_h&format=json&nojsoncallback=1&api_key=' + flickrAPIKey,
        success: function(data) {
            var photo = data.photos.photo.pick();
            var imgUrl = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + ".jpg";
            $.ajax({
                url: flickrURL + 'flickr.photos.geo.getLocation'
                + '&photo_id=' + photo.id + '&extra=geo&format=json&nojsoncallback=1&api_key=' + flickrAPIKey,
                success: function(data) {
                    var dataInJson = JSON.stringify(data);
                    var parsed = JSON.parse(dataInJson);
                    var pht = JSON.stringify(parsed.photo);
                    var parsedPhoto = JSON.parse(pht);
                    var loca = JSON.stringify(parsedPhoto.location);
                    var parsedLoca = JSON.parse(loca);
                    if (data.stat == 'ok') {
                        lat = parseFloat(Number(parsedLoca.latitude).toFixed(2).toString());
                        lon = parseFloat(Number(parsedLoca.longitude).toFixed(2).toString());

                        // alert("generate [ " + typeof lat + "/" + lat + ", " + typeof lon + "/" +  lon + " ]");

                        $.ajax({
                            url: 'http://api.geonames.org/countryCodeJSON?lat='+lat+'&lng='+lon+'&username=lynnecc98',
                            success: function(data){
                                var dataInJson = JSON.stringify(data);
                                var parsed = JSON.parse(dataInJson);
                                console.log(parsed.countryName);
                                document.getElementById("welcome").innerHTML = "Hey! Welcome to " + parsed.countryName;

                                if(lat && lon){
                                    loadMap(); 
                                }
                            },
                            error: function(requestObject, error, errorThrown){
                                alert("error");
                            }
                        });
                    }
                },
                error: function(requestObject, error, errorThrown) {
                    alert(error);
                }
            });
            console.log("slkdj" + lon + lat);

            $('#imagebox').html('');
            $('#imagebox').append('<img id="image" src="' + imgUrl + '"/>');

        },
        async: true,
        dataType:"json"
    });
}
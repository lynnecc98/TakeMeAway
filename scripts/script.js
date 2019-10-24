var DEBUG = true;
var flickrAPIKey = '52f881a0fa41b673ed54a22c7e3b1762';
var flickrURL = 'https://api.flickr.com/services/rest/?method=';
var lastfmAPIKey = '75ac8cb01596a28498cfc5567f68a8c8';

var lat;
var lon;
var size;

var currentCountryName;

var img_source = "";
var isInitialized = false;
var isLoading = false;


window.onload = function () {
    initMap();
}

Array.prototype.pick = function () {
    return this[Math.floor(Math.random() * this.length)];
}
function fade(element) {
    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1) {
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 50);
}

function unfade(element) {
    var op = 0.1;  // initial opacity
    element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1) {
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 10);
}


function onimageclicked() {
    $(this).animate({ transform: degree }, {
        step: function (now, fx) {
            $(this).css({
                '-webkit-transform': 'rotate(' + now + 'deg)',
                '-moz-transform': 'rotate(' + now + 'deg)',
                'transform': 'rotate(' + now + 'deg)'
            });
        }
    });
}

function getImgUrl() {
    console.log("get image url");

    $.ajax({

        url: flickrURL + 'flickr.photos.search'
            + '&text=road&sort=relevance&content_type=1&has_geo=1&extras=url_h&format=json&nojsoncallback=1&api_key=' + flickrAPIKey,
        success: function (data) {
            var photo = data.photos.photo.pick();
            var imgUrl = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + ".jpg";

            img_source = imgUrl;

            console.log(img_source);


            $.ajax({
                url: flickrURL + 'flickr.photos.geo.getLocation'
                    + '&photo_id=' + photo.id + '&extra=geo&format=json&nojsoncallback=1&api_key=' + flickrAPIKey,
                success: function (data) {
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
                            url: 'http://api.geonames.org/countryCodeJSON?lat=' + lat + '&lng=' + lon + '&username=lynnecc98',
                            success: function (data) {
                                var dataInJson = JSON.stringify(data);
                                var parsed = JSON.parse(dataInJson);
                                console.log(parsed.countryName);
                                

                                currentCountryName = parsed.countryName
                                //document.getElementById("country").textContent = parsed.countryName;

                                if (!isInitialized) {
                                    var fadeTarget = document.getElementById('myImage');
                                    fadeTarget.src = img_source;
                                    if (lat && lon) {
                                        console.log("on map load from first");
                                        loadMap();

                                        if(currentCountryName.match(' ')){
                                            console.log("space");
                                            var temp = new Array();
                                            temp = currentCountryName.split(' ');
                                            console.log(temp[0]);
                                            console.log(temp[1]);
                                            var country = document.getElementById("country");
                                            country.innerHTML = temp[0] + "<br />";
                                            country.innerHTML += temp[1];
                                         }
                                         else{
                                            document.getElementById("country").textContent = currentCountryName;
                                         }
                                    }
                                    isInitialized = true;
                                    console.log("initializing");
                                    getImgUrl();

                                }

                            },
                            error: function (requestObject, error, errorThrown) {
                                alert("error");
                            }
                        });
                    }

                },
                error: function (requestObject, error, errorThrown) {
                    alert(error);
                }
            });



            // var fadeTarget = document.getElementById('myImage');

            // fadeTarget.src = img_source;
            // console.log(fadeTarget.src);
            // unfade(fadeTarget);

            //$('#imagebox').append('<img id="image" src="' + imgUrl + '"/>');

        },

        dataType: "json"
    });


}


function generate() {

    if (isLoading) {
        return;
    }

    isLoading = true;

    var fadeTarget = document.getElementById('myImage');

    if (isInitialized) {
        console.log(isInitialized, "loading map");
        loadMap();
        if(currentCountryName.match(' ')){
            console.log("space");
            var temp = new Array();
            temp = currentCountryName.split(' ');
            console.log(temp[0]);
            console.log(temp[1]);
            var country = document.getElementById("country");
            country.innerHTML = temp[0] + "<br />";
            country.innerHTML += temp[1];
         }
         else{
            document.getElementById("country").textContent = currentCountryName;
         }
        

        //fade(fadeTarget);
    } else {
        console.log(isInitialized);
        getImgUrl();

    }

    console.log("here")
    if (isInitialized) {
        var fadeTarget_temp = document.getElementById('myImage');

        $("#myImage").fadeOut(1200, function () {
            fadeTarget_temp.src = img_source
            $("#myImage").fadeIn(1200);
        });
        getImgUrl();
    }

    isLoading = false;



    //unfade(fadeTarget);


    // $.ajax({
    //     url: "demo_test.txt",
    //     success: function (result) {
    //         fadeTarget.src = img_source;
    //         console.log(fadeTarget.src);
    //         unfade(fadeTarget)
    //     },
    //     async: true,
    // });


    // IMAGE FOR DISPLAY



}


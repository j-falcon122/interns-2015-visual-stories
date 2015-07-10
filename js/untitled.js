$.ajax({
    dataType: 'jsonp',
    jsonp: 'callback',
    jsonpCallback: 'getData',
    type: 'GET',
    url: 'http://cms-publishapi.prd.nytimes.com/v1/publish/scoop/2015/07/01/sports/the-most-dangerous-game.html?callback=?',
    crossDomain: true,
    success: function(response) {
        console.log(response);
    },
    xhrFields: {
        withCredentials: true
    },
    username: 'human',
    password: 'R3plicant'
});

function getData (data) {
	console.log(data);
}

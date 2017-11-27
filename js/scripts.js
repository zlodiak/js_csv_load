document.addEventListener("DOMContentLoaded", ready);

var file;
var addrArr = [];

function ready() {
	var cSVDownloader = new CSVDownloader();
	cSVDownloader.init();
	
	setTimeout(function() {
		var cSVConverter = new CSVConverter(file);
		addrArr = cSVConverter.convertRawMapDataToArray();	

		var destroyedBuildings = new DestroyedBuildings('map', addrArr);
		destroyedBuildings.createMap();
	}, 1000);
};

function CSVDownloader() {
  this.mapURL = '2.csv';

  this.init = function() {
  	this.downloadFile(this.mapURL);
  };

  this.downloadFile = function(url) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url);
		xhr.onload = function() {
		    if (xhr.status === 200) {
		      file = xhr.responseText;
		    }
		    else {
		      alert('Request failed.  Returned status of ' + xhr.status);
		    }
		};
		xhr.send();  	
  };
}


function CSVConverter(data) {
	this.rawMapData = data;

	this.convertRawMapDataToArray = function() {
    var divider = /\r\n|\n/;
    var temporaryArray = [];
    var finalArray = [];

    temporaryArray = this.rawMapData.split(divider);

    temporaryArray.forEach(function(addressCell) {
      var temporaryAddressCell = addressCell.split('	');

      temporaryAddressCell.shift();
      temporaryAddressCell = temporaryAddressCell.join('');

      finalArray.push(temporaryAddressCell);
    })

    var newFinalArray = finalArray.slice(10, 20);

    /*console.log(finalArray);
    console.log(newFinalArray);*/

    return newFinalArray;
	};
}

function DestroyedBuildings(id, addrArr) {
  this.mapContainerID = id;
  this.addrArr = addrArr;

  this.createMap = function() {
    ymaps.ready(function() {
    	console.log(this);
			this.map = new ymaps.Map(this.mapContainerID, {
			  center:[55.76, 37.64], 
			  zoom:10
			});   	
			this.map.controls.add('zoomControl', { left: 5, top: 5 })
			this.updateMapInfo();
    }.bind(this));
  };

  this.updateMapInfo = function() {
    this.addrArr.forEach(function(buildingAddress) {
      var tempAddress = ymaps.geoQuery(ymaps.geocode(buildingAddress));
      this.map.geoObjects.add(tempAddress.clusterize());
    }.bind(this))
  } 
}
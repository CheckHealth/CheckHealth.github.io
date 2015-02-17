//////////////////////////////////////////////////////////////
//     Community Service Centers location Marker object
//////////////////////////////////////////////////////////////

var CommServiceCentersMarker = function(data) {
    this.site_name = data[0];
    this.hoursOfOperation = data[1];
    this.address = data[3];
    this.city = data[4];
    this.state = data[5];
    this.zipcode = data[6];
    this.phone = data[2];  // This may need to be an Array depending on how many phone numbers it has, or if this field is null
    this.latitude = data[7];
    this.longitude = data[8];
    var latlng = L.latLng(this.latitude, this.longitude);

    var popupstr = "<p><b>Name:</b> " + this.site_name +
                   "</br><b>Phone:</b> " + this.phone +
                   "</br><b>Address:</b> " + this.address + "," + this.city + "," + this.state + " " + this.zipcode +
                   "</br><b>Hours:</b> " + this.hoursOfOperation;

    var icon = L.AwesomeMarkers.icon({
        icon: "check-square",
        spin:false,
        markerColor: "white",
        iconColor: "black"
    });

    this.setIconNew(icon);
    this.setLatLng(latlng);
    this.setPopupString(popupstr);
    this.init();
};
//////////////////////////////////////////////////////////////
//     Community Service Centers location Marker object
//////////////////////////////////////////////////////////////

var CommServiceCentersMarker = function(data) {
    this.site_name = data[0];
    this.hoursOfOperation = data[1];
    this.address = data[2];
    this.city = data[3];
    this.state = data[4];
    this.zipcode = data[5];
    this.phone = data[20];  // This may need to be an Array depending on how many phone numbers it has, or if this field is null
    this.latitude = data[27][1];
    this.longitude = data[27][2];
    var latlng = L.latLng(this.latitude, this.longitude);

    var popupstr = "<p><b>Name:</b> " + this.site_name +
                   "</br><b>Phone:</b> " + this.phone +
                   "</br><b>Address:</b> " + this.address + "," + this.city + "," + this.state + " " + this.zipcode +
                   "</br><b>Hours:</b> " + this.hoursOfOperation;

    var icon = L.AwesomeMarkers.icon({
        icon: "heart",
        spin:false,
        markerColor: "white",
        iconColor: "red"
    });

    this.setIconNew(icon);
    this.setLatLng(latlng);
    this.setPopupString(popupstr);
    this.init();
};
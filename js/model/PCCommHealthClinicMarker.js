/**
 * Created by krbalmryde on 2/17/15.
 */

var PCCommHealthClinicMarker = function(data) {
    this.site_name = data[0];
    this.phone = data[2];  // This may need to be an Array depending on how many phone numbers it has, or if this field is null
    this.address = data[4][0];
    this.city = data[4][0];
    this.state = data[4][0];
    this.zipcode = data[4][0];
    this.services = data[3];
    this.latitude = data[4][1];
    this.longitude = data[4][2];
    var latlng = L.latLng(this.latitude, this.longitude);

    var popupstr = "<p><b>Name:</b> " + this.site_name +
        "</br><b>Phone:</b> " + this.phone +
        "</br><b>Address:</b> " + this.address + "," + this.city + "," + this.state + " " + this.zipcode +
        "</br><b>Service Availability:</b> " +
        "<blockquote>" + this.services + "</blockquote>";

    var icon = L.AwesomeMarkers.icon({
        icon: "heartbeat",
        spin:false,
        markerColor: "white",
        iconColor: "yellow"
    });

    this.setIconNew(icon);
    this.setLatLng(latlng);
    this.setPopupString(popupstr);
    this.init();
};
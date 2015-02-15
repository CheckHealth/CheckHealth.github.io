/**
 * Created by ditu on 14/02/15.
 */


var STIClinicsMarker = function(data){
    this.site_name = data[8];
    this.hoursOfOperation = data[9];
    this.address = data[10];
    this.city = data[11];
    this.state = data[12];
    this.zipcode = data[13];
    this.phone = data[14];
    this.fax = data[15];
    this.latitude = data[16][1];
    this.longitude = data[16][2];
    var latlng = L.latLng(this.latitude, this.longitude);

    var popupstr = "<p><b>Name:</b> " + this.site_name +
                    "</br><b>Phone:</b> " + this.phone +
                    "</br><b>Fax:</b> " + this.fax +
                    "</br><b>Address:</b> " + this.address + "," + this.city + "," + this.state + " " + this.zipcode +
                    "</br><b>Hours:</b> " + this.hoursOfOperation;



    var icon = L.AwesomeMarkers.icon({
        icon: "medkit",
        spin:false,
        markerColor: "white",
        iconColor: "green"
    });
    console.log(icon);
    this.setIconNew(icon);
    this.setLatLng(latlng);
    this.setPopupString(popupstr);
    this.init();
};

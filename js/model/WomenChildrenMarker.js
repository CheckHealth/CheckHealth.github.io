//////////////////////////////////////////////////////////////
//     Women and Children Clinic location Marker object
//////////////////////////////////////////////////////////////

var WomenChildrenMarker = function(data) {
    console.log("in WomenChildrenMarker", data);
    this.site_name = data[8];
    this.hoursOfOperation = data[10];
    this.address = data[11];
    this.city = data[12];
    this.state = data[13];
    this.zipcode = data[14];
    this.public_health_nursing = data[15] ? "Yes" : "No";
    this.family_case_management = data[16] ? "Yes" : "No";
    this.healthy_start_program = data[17] ? "Yes" : "No";
    this.healthy_families_program = data[18] ? "Yes" : "No";
    this.wic = data[19] ? "Yes" : "No";
    this.phone = data[20];  // This may need to be an Array depending on how many phone numbers it has, or if this field is null
    this.latitude = data[27][1];
    this.longitude = data[27][2];
    var latlng = L.latLng(this.latitude, this.longitude);

    var popupstr = "<p><b>Name:</b> " + this.site_name +
                   "</br><b>Phone:</b> " + this.phone +
                   "</br><b>Address:</b> " + this.address + "," + this.city + "," + this.state + " " + this.zipcode +
                   "</br><b>Hours:</b> " + this.hoursOfOperation +
                   "</br><b>Service Availability:</b> " +
                   "<blockquote><b>Public Health Nursing:</b> " + this.public_health_nursing +
                   "</br><b>Family Case Management:</b> " + this.family_case_management +
                   "</br><b>Healthy Start Program:</b> " + this.healthy_start_program +
                   "</br><b>Healthy Families Program:</b> " + this.healthy_families_program +
                   "</br><b>WIC service:</b> " + this.wic + "</blockquote>";

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
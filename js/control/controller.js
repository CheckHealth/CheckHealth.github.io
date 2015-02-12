/**
 * Created by krbalmryde on 2/11/15.
 */

function Controller() {
    var self = this;

    // Set up map controller
    this.map = new MapController();
    this.mapCenter = new L.LatLng(41.864755, -87.631474);

    // Set up marker Arrays
    this.WomenChildrenClinics = {};

    window.map = this.map;
}

Controller.prototype.init = function() {
    this.map.init(this.mapCenter, 11);
};


Controller.prototype.getBoundingDataFromFile= function(){
    d3.json("assets/Data/chi.json", function(error, json) {
        if (error) return console.error(error);
        var chi = topojson.feature(json, json.objects.chicago_health2);
        L.geoJson(chi).addTo(this.map)
    }.bind(this))
};

Controller.prototype.getCommunityHealthCenters= function() {};

Controller.prototype.getLibraries= function() {};

Controller.prototype.getMentalHealthClinics= function() {};

Controller.prototype.getChiPCCommunityHealthCenters= function() {};

Controller.prototype.getNeighborhoodHealthClinics= function() {};

Controller.prototype.getWomenAndChildrenHealthClinics= function() {
    d3.json("assets/Data/WomenChildrenClean.json", function(data){
        console.log(data, typeof(data), data.data[0]);
        dataSet = data.data;
        console.log(dataSet, dataSet.length);
        for(var i=0; i < dataSet.length; i++){
            dataArray = dataSet[i];
            this.WomenChildrenClinics[i] = new WomenChildrenMarker(dataArray);
            this.WomenChildrenClinics[i].viewNewIcon();
            this.WomenChildrenClinics[i].addTo(this.map);
            console.log("markers",this.WomenChildrenClinics[i]);
        }
    }.bind(this))
};

Controller.prototype.getSTIHealthClinics= function() {};
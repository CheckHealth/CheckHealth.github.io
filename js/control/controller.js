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

Controller.prototype.testD3TopoJson= function(){
    var svg = d3.select(this.map.map.getPanes().overlayPane).append("svg"),
        g = svg.append("g").attr("class", "leaflet-zoom-hide");

    d3.json("assets/Data/chiZipCodesTopo.json", function(error, json) {
        if (error) return console.error(error);
        var transform = d3.geo.transform({point: projectPoint}),
            path = d3.geo.path().projection(transform);

        var chi = topojson.feature(json, json.objects.zipCodes);
        var feature = g.selectAll("path")
            .data(chi.features)
            .enter().append("path");

        self.map.map.on("viewreset", reset);
        reset();

        // Reposition the SVG to cover the features.
        function reset() {
            var bounds = path.bounds(chi),
                topLeft = bounds[0],
                bottomRight = bounds[1];

            svg .attr("width", bottomRight[0] - topLeft[0])
                .attr("height", bottomRight[1] - topLeft[1])
                .style("left", topLeft[0] + "px")
                .style("top", topLeft[1] + "px");

            g   .attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

            feature.attr("d", path);
        }

        // Use Leaflet to implement a D3 geometric transformation.
        function projectPoint(x, y) {
            var point = self.map.map.latLngToLayerPoint(new L.LatLng(y, x));
            this.stream.point(point.x, point.y);
        }

    }.bind(this))

};

Controller.prototype.testD3GeoJson= function(){
    var svg = d3.select(this.map.map.getPanes().overlayPane).append("svg"),
        g = svg.append("g").attr("class", "leaflet-zoom-hide");

    d3.json("assets/Data/chiZipCodesGeo.json", function(collection) {
        var transform = d3.geo.transform({point: projectPoint}),
            path = d3.geo.path().projection(transform);

        var feature = g.selectAll("path")
            .data(collection.features)
            .enter().append("path");

        self.map.map.on("viewreset", reset);
        reset();

        // Reposition the SVG to cover the features.
        function reset() {
            var bounds = path.bounds(collection),
                topLeft = bounds[0],
                bottomRight = bounds[1];

            svg .attr("width", bottomRight[0] - topLeft[0])
                .attr("height", bottomRight[1] - topLeft[1])
                .style("left", topLeft[0] + "px")
                .style("top", topLeft[1] + "px");

            g   .attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

            feature.attr("d", path);
        }

        // Use Leaflet to implement a D3 geometric transformation.
        function projectPoint(x, y) {
            var point = self.map.map.latLngToLayerPoint(new L.LatLng(y, x));
            this.stream.point(point.x, point.y);
        }
    });

};


Controller.prototype.getBoundingDataFromFile= function(){
    d3.json("assets/Data/chi.json", function(error, json) {
        if (error) return console.error(error);
        var chi = topojson.feature(json, json.objects.chicago_health2);
        console.log(chi);
        L.geoJson(chi).addTo(this.map)
    }.bind(this))
};

Controller.prototype.getGeoBoundingDataFromFile= function(){
    d3.json("assets/Data/chiZipCodesGeo.json", function(error, json) {
        if (error) return console.error(error);
        var chi = json.features;
        console.log(chi);
        L.geoJson(chi).addTo(this.map)
    }.bind(this))
};

Controller.prototype.getTopoBoundingDataFromFile= function(){
    d3.json("assets/Data/chiZipCodesTopo.json", function(error, json) {
        if (error) return console.error(error);
        window.chi = json;
        //var chi = json.features;
        var chi = topojson.feature(json, json.objects.zipCodes);
        console.log(chi);
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
        dataSet = data.data;
        console.log(dataSet, dataSet.length);
        for(var i=0; i < dataSet.length; i++){
            dataArray = dataSet[i];
            this.WomenChildrenClinics[i] = new WomenChildrenMarker(dataArray);
            this.WomenChildrenClinics[i].viewNewIcon();
            this.WomenChildrenClinics[i].addTo(this.map);
        }
    }.bind(this))
};

Controller.prototype.getSTIHealthClinics= function() {};
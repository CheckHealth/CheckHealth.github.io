/**
 * Created by krbalmryde on 2/11/15.
 */

function Controller() {
    var self = this;

    // Set up map controller
    this.map = new MapController();
    this.mapCenter = new L.LatLng(41.864755, -87.631474);

    // Set up marker Container objects
    this.WomenChildrenClinics = {};
    this.CommunityHealthCenters = {};
    this.STIClinics = {};
    this.NeighborhoodHealthClinics = {};
    this.PCCommHealthClinics = {};

    this.STIClinicsBool = 0;
    this.CommunityHealthCentersBool = 0;
    this.WomenChildrenClinicsBool = 0;
    this.NeighborhoodHealthClinicsBool = 0;
    this.PCCommHealthClinicsBool = 0;

    this.color = d3.scale.threshold()
        .domain([1, 10, 50, 100, 500, 1000, 2000, 5000])
        // .domain([1, 50, 200, 500, 1000, 2000, 3000, 5000])
        //.range(["#fff7ec", "#fee8c8", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#b30000", "#7f0000"]);
        //.range(['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58']);
        //.range(['#f7fcfd', '#e0ecf4', '#bfd3e6', '#9ebcda', '#8c96c6', '#8c6bb1', '#88419d', '#810f7c', '#4d004b']);
        .range(['rgb(255,255,204)','rgb(255,237,160)','rgb(254,217,118)','rgb(254,178,76)','rgb(253,141,60)','rgb(252,78,42)','rgb(227,26,28)','rgb(189,0,38)','rgb(128,0,38)']);
        // .range(['rgb(255,255,204)', 'rgb(255,237,160)','rgb(254,217,118)','rgb(254,178,76)','rgb(253,141,60)','rgb(252,78,42)','rgb(227,26,28)','rgb(189,0,38)','rgb(128,0,38)']);

    window.color = this.color;
    window.map = this.map;
}


Controller.prototype.init = function() {
    this.map.init(this.mapCenter, 11);

};


Controller.prototype.addLegend= function() {
    var self = this;
    var info = L.control(),
        legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = self.color.domain();

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + self.color(grades[i]) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info population'); // create a div with a class "info"
        this.update();
        return this._div;
    };

// method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        //var div = d3.select("info leaflet-control");
        this._div.innerHTML = '<h4>Zip Code Density</h4>' +  (props ?
        '<b>' + props.id + '</b><br />' + props.properties.density + ' people / mi<sup>2</sup>'
            : 'Hover over a zone');
    };

    //buttons.addTo(self.map.map);
    info.addTo(self.map.map);
    legend.addTo(self.map.map);


};

Controller.prototype.testD3TopoJson= function(){
    console.log("This thing here!!", this.map.map.getPanes().overlayPane)
    var svg = d3.select(this.map.map.getPanes().overlayPane).append("svg").attr("id", "zipSVG"),
        g = svg.append("g").attr("class", "leaflet-zoom-hide").attr("class", "zipcodes"),
        self = this;

    d3.json("/assets/Data/Clean/Location/chicago_ZC_Counts_topo.json", function(error, json) {
        if (error) return console.error(error);
        var transform = d3.geo.transform({point: projectPoint}),
            path = d3.geo.path().projection(transform);

        var chi = topojson.feature(json, json.objects.chicago_ZC_Geo);

        var feature = g.selectAll("path")
            .data(chi.features)
            .enter().append("path")
            .attr("class", function(d) { return "zip."+d.id})
            .style("fill", function(d) { return self.color(d.properties.density) })
            .on("mouseover", function(d) {
                var div = d3.select("div.info.population.leaflet-control");
                div.html('<h4>Zip Code Density</h4>' +
                    (d ?'<b>Zip: </b>' +
                    d.id +'<br/><b>Pop:</b> ' +
                    d.properties.density : 'Hover over a zone')
                );
            });

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


        //d3.selectAll('.zip').on("hover", function(d){
        //    console.log("in zip",d)
        //});

    }.bind(this));

};


//Controller.prototype.testD3GeoJson= function(){
//    var svg = d3.select(this.map.map.getPanes().overlayPane).append("svg"),
//        g = svg.append("g").attr("class", "leaflet-zoom-hide");
//
//    d3.json("assets/Data/Clean/chicago_ZC_Geo.json", function(collection) {
//        var transform = d3.geo.transform({point: projectPoint}),
//            path = d3.geo.path().projection(transform);
//
//        var feature = g.selectAll("path")
//            .data(collection.features)
//            .enter().append("path");
//
//        self.map.map.on("viewreset", reset);
//        reset();
//
//        // Reposition the SVG to cover the features.
//        function reset() {
//            var bounds = path.bounds(collection),
//                topLeft = bounds[0],
//                bottomRight = bounds[1];
//
//            svg .attr("width", bottomRight[0] - topLeft[0])
//                .attr("height", bottomRight[1] - topLeft[1])
//                .style("left", topLeft[0] + "px")
//                .style("top", topLeft[1] + "px");
//
//            g   .attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
//
//            feature.attr("d", path);
//        }
//
//        // Use Leaflet to implement a D3 geometric transformation.
//        function projectPoint(x, y) {
//            var point = self.map.map.latLngToLayerPoint(new L.LatLng(y, x));
//            this.stream.point(point.x, point.y);
//        }
//    });
//
//};

//Controller.prototype.getBoundingDataFromFile= function(){
//    d3.json("assets/Data/Clean/chi.json", function(error, json) {
//        if (error) return console.error(error);
//        var chi = topojson.feature(json, json.objects.chicago_health2);
//        console.log(chi);
//        L.geoJson(chi).addTo(this.map)
//    }.bind(this))
//};
//
//Controller.prototype.getGeoBoundingDataFromFile= function(){
//    d3.json("assets/Data/Clean/Location/chicago_ZC_Geo.json", function(error, json) {
//        if (error) return console.error(error);
//        var chi = json.features;
//        console.log(chi);
//        L.geoJson(chi).addTo(this.map)
//    }.bind(this))
//};
//
//Controller.prototype.getTopoBoundingDataFromFile= function(){
//    d3.json("assets/Data/Clean/Location/chicago_ZC_Topo.json", function(error, json) {
//        if (error) return console.error(error);
//        window.chi = json;
//        //var chi = json.features;
//        var chi = topojson.feature(json, json.objects.zipCodes);
//        console.log(chi);
//        L.geoJson(chi).addTo(this.map)
//    }.bind(this))
//};




Controller.prototype.getCommunityHealthCenters= function() {
    d3.json("assets/Data/Clean/Services/CommServiceCentersClean.json", function(data){
        console.log("working on data Community health centers...");
        dataSet = data.data;
        console.log(dataSet, dataSet.length);
        console.log("data printed..");
        for(var i = 0; i < dataSet.length; i++){
            dataArray = dataSet[i];
            this.CommunityHealthCenters[i] = new CommServiceCentersMarker(dataArray);
            this.CommunityHealthCenters[i].viewNewIcon();
            this.CommunityHealthCenters[i].addTo(this.map);
        }
    }.bind(this));
};

Controller.prototype.getLibraries= function() {};

Controller.prototype.getMentalHealthClinics= function() {};

Controller.prototype.getPCCommunityHealthCenters= function() {
    d3.json("assets/Data/Clean/Services/PCCommHealthClinicClean.json", function(data){
        console.log("In PCCommHealth", data);
        dataSet = data.data;
        console.log(dataSet, dataSet.length);
        for(var i=0; i < dataSet.length; i++){
            dataArray = dataSet[i];
            console.log(i, dataArray);
            this.PCCommHealthClinics[i] = new PCCommHealthClinicMarker(dataArray);
            this.PCCommHealthClinics[i].viewNewIcon();
            this.PCCommHealthClinics[i].addTo(this.map);
        }
    }.bind(this))
};

Controller.prototype.getNeighborhoodHealthClinics= function() {
    d3.json("assets/Data/Clean/Services/NeighborhoodHealthClinicsClean.json", function(data){
        dataSet = data.data;
        console.log(dataSet, dataSet.length);
        for(var i=0; i < dataSet.length; i++){
            dataArray = dataSet[i];
            console.log(i, dataArray);
            this.NeighborhoodHealthClinics[i] = new NeighborhoodHealthClinicMarker(dataArray);
            this.NeighborhoodHealthClinics[i].viewNewIcon();
            this.NeighborhoodHealthClinics[i].addTo(this.map);
        }
    }.bind(this))
};

Controller.prototype.getWomenAndChildrenHealthClinics= function() {
    d3.json("assets/Data/Clean/Services/WomenChildrenClean.json", function(data){
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

Controller.prototype.getSTIHealthClinics= function() {
    d3.json("assets/Data/Clean/Services/STIClinicsClean.json", function (data) {
        dataSet = data.data;
        console.log("STIHealClinics", dataSet);
        for(var i = 0; i < dataSet.length; i++){
            dataArray = dataSet[i];
            this.STIClinics[i] = new STIClinicsMarker(dataArray);
            this.STIClinics[i].viewNewIcon();
            this.STIClinics[i].addTo(this.map);
        }
    }.bind(this));
};

Controller.prototype.removeMarkers = function(MarkersArray) {
    for (var i in MarkersArray) {
        this.map.removeLayer(MarkersArray[i]);
    }
};

Controller.prototype.ableDisable = function(button) {
    console.log("called ableDisable!");
    console.log("disable/able : ", button.id);
    console.log("button text ", button.textContent);

    switch(button.id){
        case 'STIClinics':
            if(this.STIClinicsBool == 0){
                this.STIClinicsBool = 1;
                button.textContent = "STI Clinics OFF";
                this.removeMarkers(this.STIClinics);
            }else{
                this.STIClinicsBool = 0;
                button.textContent = "STI Clinics ON";
                this.getSTIHealthClinics();
            }
            break;
        case 'CommunityHealthCenters':
            if(this.CommunityHealthCentersBool == 0){
                this.CommunityHealthCentersBool = 1;
                button.textContent = "Community Health C. OFF";
                this.removeMarkers(this.CommunityHealthCenters);
            }else{
                this.CommunityHealthCentersBool = 0;
                button.textContent = "Community Health C. ON";
                this.getCommunityHealthCenters();
            }
            break;
        case 'WomenChildrenClinics':
            if(this.WomenChildrenClinicsBool == 0){
                this.WomenChildrenClinicsBool = 1;
                button.textContent = "Women Children Clinics OFF";
                this.removeMarkers(this.WomenChildrenClinics);
            }
            else{
                this.WomenChildrenClinicsBool = 0;
                button.textContent = "Women Children Clinics ON";
                this.getWomenAndChildrenHealthClinics();
            }
            break;
        case 'NeighborhoodHealthClinics':
            if(this.NeighborhoodHealthClinicsBool == 0){
                this.NeighborhoodHealthClinicsBool = 1;
                button.textContent = "Neighborhood Health C. OFF";
                this.removeMarkers(this.NeighborhoodHealthClinics);
            }
            else{
                this.NeighborhoodHealthClinicsBool = 0;
                button.textContent = "Neighborhood Health C. ON";
                this.getNeighborhoodHealthClinics();
            }
            break;
        case 'PCCommHealthClinics':
            if(this.PCCommHealthClinicsBool== 0){
                this.PCCommHealthClinicsBool = 1;
                button.textContent = "Primarity Care Comm. Clinics OFF";
                this.removeMarkers(this.PCCommHealthClinics);
            }
            else{
                this.PCCommHealthClinicsBool = 0;
                button.textContent = "Primarity Care Comm. Clinics ON";
                this.getPCCommunityHealthCenters();
            }
            break;
        default: console.log("error ableDisable");
            break;
    }
};
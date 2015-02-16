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
    this.CommunityHealthCenters = {};
    this.STIClinics = {};

    window.map = this.map;
}


Controller.prototype.init = function() {
    this.map.init(this.mapCenter, 11);
};


Controller.prototype.testD3TopoJson= function(){
    var svg = d3.select(this.map.map.getPanes().overlayPane).append("svg").attr("id", "zipSVG"),
        g = svg.append("g").attr("class", "leaflet-zoom-hide").attr("class", "zipcodes");

    var color = d3.scale.threshold()
        .domain([1, 10, 50, 100, 500, 1000, 2000, 5000])
        //.range(["#fff7ec", "#fee8c8", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#b30000", "#7f0000"]);
        //.range(['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58']);
        .range(['#f7fcfd', '#e0ecf4', '#bfd3e6', '#9ebcda', '#8c96c6', '#8c6bb1', '#88419d', '#810f7c', '#4d004b']);


    function mouseOver(d){;
        d3.select("#divmap").transition().duration(200).style("opacity", .9);


        d3.select("#divmap").html(tooltipHtml(d.properties))
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");

        function tooltipHtml(d){	/* function to create html content string in tooltip div. */
            console.log("mouseOver", d)
            return "<h4>"+ d.zipcode+"</h4><table>"+
                "<tr><td>Count</td><td>"+(d.density)+"</td></tr>"+
                "</table>";
        }

    }

    function mouseOut(){
        d3.select("#tooltip").transition().duration(500).style("opacity", 0);
    }

    //d3.select(id).selectAll(".state")
    //    .data(uStatePaths).enter().append("path").attr("class","state").attr("d",function(d){ return d.d;})
    //    .style("fill",function(d){ return data[d.id].color; })
    //    .on("mouseover", mouseOver).on("mouseout", mouseOut);


    d3.json("assets/Data/Clean/Location/chicago_ZC_Counts_topo.json", function(error, json) {
        if (error) return console.error(error);
        var transform = d3.geo.transform({point: projectPoint}),
            path = d3.geo.path().projection(transform);

        var chi = topojson.feature(json, json.objects.chicago_ZC_Geo);

        var feature = g.selectAll("path")
            .data(chi.features)
            .enter().append("path")
            .attr("class", function(d) { return "zip."+d.properties.zipcode})
            .style("fill", function(d) { return color(d.properties.density); })
            .on("mouseover", mouseOver).on("mouseout", mouseOut);



        self.map.map.on("viewreset", reset);
        reset();

        // Reposition the SVG to cover the features.
        function reset() {
            d3.selectAll("path")
                .style("fill-opacity", 1.0)
                .style("stroke", "null")
                .style("stroke-width", "null");

            var bounds = path.bounds(chi),
                topLeft = bounds[0],
                bottomRight = bounds[1];

            svg .attr("width", bottomRight[0] - topLeft[0])
                .attr("height", bottomRight[1] - topLeft[1])
                .style("left", topLeft[0] + "px")
                .style("top", topLeft[1] + "px");

            g   .attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

            feature.attr("d", path);
            //d3.selectAll("path")
            //    .style("fill-opacity", 1.0)
            //    .style("stroke", "null")
            //    .style("stroke-width", "null");

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

    d3.json("assets/Data/Clean/chicago_ZC_Geo.json", function(collection) {
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
    d3.json("assets/Data/Clean/chi.json", function(error, json) {
        if (error) return console.error(error);
        var chi = topojson.feature(json, json.objects.chicago_health2);
        console.log(chi);
        L.geoJson(chi).addTo(this.map)
    }.bind(this))
};

Controller.prototype.getGeoBoundingDataFromFile= function(){
    d3.json("assets/Data/Clean/Location/chicago_ZC_Geo.json", function(error, json) {
        if (error) return console.error(error);
        var chi = json.features;
        console.log(chi);
        L.geoJson(chi).addTo(this.map)
    }.bind(this))
};

Controller.prototype.getTopoBoundingDataFromFile= function(){
    d3.json("assets/Data/Clean/Location/chicago_ZC_Topo.json", function(error, json) {
        if (error) return console.error(error);
        window.chi = json;
        //var chi = json.features;
        var chi = topojson.feature(json, json.objects.zipCodes);
        console.log(chi);
        L.geoJson(chi).addTo(this.map)
    }.bind(this))
};

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

Controller.prototype.getChiPCCommunityHealthCenters= function() {};

Controller.prototype.getNeighborhoodHealthClinics= function() {};

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

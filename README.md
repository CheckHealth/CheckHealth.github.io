# MapView


### Web Technologies to be utilized:

For the map based API, we will use the following Javascript Libraries:

* [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript): The scripting language of the web
* [leafletjs](http://leafletjs.com/index.html): Powerful map based API, will drive the application
* [d3](http://d3js.org/): Figures and diagrams, should they be desired
* [mapbox](https://www.mapbox.com/): Source of google-maps-like maps. Lots and Lots of options I have a developer api key
* [GeoJson](http://geojson.org/): Data format for encoding geographic data structures
* [ogr2ogr](http://www.gdal.org/ogr2ogr.html): For converting GIS shapefiles to geojson format
* [topojson](https://github.com/mbostock/topojson): An extension of GeoJson which encodes topology, which may be useful
* [Python](https://www.python.org/): For data cleaning and preprocessing (if necessary)

### Data sources:
* [Chicago Data Portal](https://data.cityofchicago.org/): Contains a wealth of information about city services locations, community health centers, various census data stats.

---

I have already extracted location data (with meta info) on the following:

  * Community Service Centers
  * Libraries
  * Mental Health Clinics
  * Chicago Primary Care Community Health Centers
  * Neighborhood Health Clinics
  * Women and children health clinics
  * Sexually Transmitted Infections Health Clinics

---

* [2010 Illinois Zipcode boundaries](https://www.census.gov/cgi-bin/geo/shapefiles2010/layers.cgi): GIS shape files of 2010 Illinois Zipcode boundaries. From this data I can convert to GeoJson, then filter out only the ~250 zipcodes we have identified in order to ensure complete coverage.
* [jgoodall/us-maps](https://github.com/jgoodall/us-maps): This repository contains a wealth of information that could be of some use.

---

### Visualization Representation of Zipcode data:

* Zipcode boundary geo-information overlaid on top of a google-maps like. Think something  along these lines:

![](assets/img/zipcodes.png)

---

### Visualization Representation of Population Density within Zipcode boundaries

* Population densities will be best represented as a Choropleth map, or a Heatmap. Think something like this: ![](assets/img/choropleth.png)
* As an alternative, we could do something akin to this if you prefer that type of representation better: ![](assets/img/bubbles.png)
  * There are Costs and Benefits to both representations, of course. I think representing the data as a Choropleth will give us a good sense of which zones have the highest densities, without visually occluding other types of information such as Location markers for the various service types.

---

### Visual Representations of the Community services:
* Google maps style Markers (this is from an application I built last semester). We will have identifiable markers containing 'popup' tooltip windows containing anything from links to websites or other relevant meta information (addresses for example): ![](assets/img/popups.png) ![](assets/img/markers.png)

---

### Preprocessing steps to in order to prepare zipcode boundaries
1. Extracted Zipcodes from excel files provided by Monika, stored into txt files cookZips.txt and elidgibleZips.txt

2. Combine txt files into single file call ZipsRaw.txt. _Note_: There is an erroneous entry in the datafile "6527" which had to be removed
```bash
cat cookZips.txt > ZipsRaw.txt
echo >> ZipsRaw.txt
cat elidgibleZips.txt
```

3. Python program to get the set union of both files, to ensure no duplicates
```python
zipcodes = set()
with open('ZipsRaw.txt') as zips:
    for z in zips.readlines():
        zipcodes.add(z.strip())

with open('ZipsClean.txt', 'w') as zips:
    for z in zipcodes:
        zips.write(z+"\n")
```

4. Call ogr2ogr and extract the selected zipcodes from the 2010 Illinois zipcodes GIS shape file
```bash
ogr2ogr -f GeoJson -where "ZCTA5CE10 IN ('60201', '60101', '60203', '60053', '60517', '60055', '60056', '60209', '60208', '60022', '60202', '60689', '60688', '60103', '60685', '60684', '60687', '60686', '60681', '60680', '60682', '60443', '60604', '60607', '60606', '60601', '60446', '60445', '60602', '60609', '60608', '60115', '60107', '60104', '60675', '60563', '60070', '60025', '60026', '60699', '60696', '60697', '60694', '60695', '60029', '60693', '60690', '60691', '60616', '60617', '60614', '60615', '60458', '60459', '60610', '60406', '60454', '60455', '60290', '60457', '60452', '60453', '60193', '60192', '60195', '60194', '60196', '60827', '60513', '60456', '60402', '60651', '60131', '60130', '60657', '60612', '60678', '60618', '60110', '60506', '60619', '60038', '60501', '60429', '60428', '60621', '60620', '60627', '60626', '60625', '60624', '60159', '60629', '60422', '60425', '60426', '60181', '60120', '60605', '60123', '60082', '60085', '60440', '60007', '60006', '60005', '60004', '60915', '60009', '60008', '60534', '60438', '60439', '60638', '60603', '60634', '60433', '60430', '60611', '60630', '60631', '60632', '60633', '60046', '60628', '60803', '60674', '46404', '60805', '60804', '60525', '60526', '60527', '60487', '60204', '60482', '60480', '60155', '60154', '60613', '60018', '60019', '60153', '60679', '60016', '60017', '60010', '60011', '60409', '60649', '60641', '60640', '60643', '60642', '60645', '60644', '60647', '60646', '46306', '60950', '60499', '60558', '60068', '60412', '60415', '60141', '60419', '60062', '60065', '60067', '60639', '60712', '60659', '60714', '60652', '60653', '60471', '60656', '60171', '60654', '60655', '60094', '60095', '60090', '60091', '60093', '60636', '60940', '60637', '60546', '60544', '60545', '60301', '60302', '60303', '60304', '60305', '60173', '60666', '60078', '60664', '60663', '60176', '60661', '60660', '60073', '60179', '60076', '60077', '60074', '60668', '60465', '60464', '60467', '60466', '60461', '60463', '60462', '60706', '60707', '60469', '60701', '60505', '60669', '60099', '46312', '60623', '60043', '60622', '60670', '60673', '60168', '60169', '60677', '60164', '60165', '60160', '60161', '60162', '60163', '60476', '60477', '60475', '60472', '60473', '60411', '60478', '60148')" chiZipCodesGeo.json tl_2010_17_zcta510.shp
```

5. Call topojson to reduce the size of the previously created GeoJson file to make it faster when loading the page later on
```bash
topojson -o chiZipCodesTopo.json -- chiZipCodesGeo.json
```





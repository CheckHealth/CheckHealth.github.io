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

* [2012 US Zipcode boundaries](http://www2.census.gov/geo/tiger/TIGER2012/ZCTA5/tl_2012_us_zcta510.zip): GIS shape files of 2012 US Zipcode boundaries (*NOTE: BIG FILE*. From this data I can convert to GeoJson, then filter out only the 113 zipcodes we have identified in order to ensure complete coverage.
* [jgoodall/us-maps](https://github.com/jgoodall/us-maps): This repository contains a wealth of information that could be of some use.

---

### Visualization Representation of Zipcode data:

* Zipcode boundary geo-information overlaid on top of a google-maps like map. Think something  along these lines:

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
1. Extracted Zipcodes from excel files provided by Monika, stored into txt file PatientZipsRaw.txt

2. Combine txt files into single file call ZipsRaw.txt. _Note_: There is an erroneous entry in the datafile "6527" which had to be removed
```bash

```

3. Python program to get the set union of both files, to ensure no duplicates
```python
import json
from nltk.probability import FreqDist

INPUT = "../Data/Raw/Enrollment/PatientZipsRaw.txt"
OUTPUT = "../Data/Clean/Enrollment/patient_zip_counts.json"

counts = {}
with open(INPUT) as f:
    counts = FreqDist([z.strip() for z in f.readlines()])

if sum(counts.values()) != 28480:
    print "Dataset does not match!!! Expected 28480 but got", sum(counts.values())
else:
    with open(OUTPUT, 'w') as f:
        f.write(json.dumps(counts))

```

4. Call ogr2ogr and extract the selected zipcodes from the 2012 Illinois zipcodes GIS shape file
```bash
RAW="../Data/Raw/Location/tl_2012_us_zcta510"
CLEAN="../Data/Clean/Location"

ogr2ogr -f GeoJson -where "ZCTA5CE10 IN ('60203', '60202', '61109', ....)" ${CLEAN}/chicago_ZC_Geo.json ${RAW}/tl_2012_us_zcta510.shp

```

5. Call topojson to reduce the size of the previously created GeoJson file to make it faster when loading the page later on
```bash
topojson --id-property ZCTA5CE10 -p zipcode=ZCTA5CE10 ${CLEAN}/chicago_ZC_Geo.json -o ${CLEAN}/chicago_ZC_topo.json

```





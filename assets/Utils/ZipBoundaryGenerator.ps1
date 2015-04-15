#!/bin/bash
#================================================================================
#    Program Name: ZipBoundaryGenerator.ps1
#          Author: Kyle Reese Almryde
#            Date: 02/11/2015
#         Updated: 04/14/2015
#
#     Description:
#               Program makes the following assumptions:
#
#
#    Deficiencies: None, this program meets specification
#
#
#           ZipBoundaryGenerator.sh Raw_ZipCodes.txt
#
#================================================================================
#                      GLOBAL VARIABLE DEFINITIONS
#================================================================================

# Setup path names
$DIR_RAW_ZC="..\Data\Raw\Enrollment"
$DIR_CLEAN_ZC="..\Data\Clean\Enrollment"

$DIR_RAW_LOC="..\Data\Raw\Location"
$DIR_CLEAN_LOC="..\Data\Clean\Location"

# Setup filenames and urls for
$ZIPCODE_GIS="tl_2012_us_zcta510"
$LOCATION_GEOJSON="chicago_ZC_Geo"
$LOCATION_TOPOJSON="chicago_ZC_topo"
$LOCATION_TOPOJSON_COUNTS="chicago_ZC_Counts_topo"
$URL="http://www2.census.gov/geo/tiger/TIGER2012/ZCTA5/$ZIPCODE_GIS.zip"

#================================================================================
#                            FUNCTION DEFINITIONS
#================================================================================

Function getShapeFiles {
    #------------------------------------------------------------------------
    #
    #  Purpose:
    #
    #
    #    Input:
    #
    #   Output:
    #
    #------------------------------------------------------------------------
    local URL=$1
    local SHAPEFILE=$2    # The GIS Shape file

    if [[ -e ${DIR_RAW_LOC}/${SHAPEFILE}.zip ]]; then
        Write-Host "${SHAPEFILE}.zip exists!"
    else
        # Download GIS shapefiles of Illinois zipcode boundaries
        Write-Host "Please be patient while ${ZCGEO}.zip is downloaded"
        curl ${URL} --create-dirs -o ${DIR_RAW_LOC}/${SHAPEFILE}.zip

        Write-Host "unpacking ${SHAPEFILE}.zip"
        unzip ${DIR_RAW_LOC}/${SHAPEFILE}.zip -d ${DIR_RAW_LOC}

    fi


} # End of getShapeFiles


Function extractTopoJson {
    #------------------------------------------------------------------------
    #
    #  Purpose:
    #
    #
    #    Input:
    #
    #   Output:
    #
    #------------------------------------------------------------------------
    # Write-Host "=================================================================="
    # Write-Host "+                   extractTopoJson"
    # Write-Host "+      $1 \t$2 \n"
              # The geoJson file
    param{ [string]$INFILE_LOC, [string]$OUTFILE_LOC } # The converted topoJson file

    # Write-Host "#!/usr/bin/env bash\n" > extractTopoJson.sh
    # Write-Host "topojson --id-property ZCTA5CE10 -p zipcode=ZCTA5CE10 -o ${OUTFILE_LOC} -- ${INFILE_LOC}\n" >> extractTopoJson.sh
    # bash extractTopoJson.sh

    # This vvvv is identical to this ^^^^
    topojson \
       --id-property ZCTA5CE10 \
       -p zipcode=ZCTA5CE10 \
       -o $OUTFILE_LOC \
       -- $INFILE_LOC

} # End of extractTopoJson



Function extractGeoJson {
    #------------------------------------------------------------------------
    #
    #  Purpose: calls ogr2ogr to extract the supplied list of zipcodes
    #
    #
    #    Input:
    #
    #   Output:
    #
    #------------------------------------------------------------------------

    param{ [string]$INFILE_ZC, [string]$OUTFILE_ZC, [string]$INFILE_LOC, [string]$OUTFILE_LOC }
    # $INFILE_ZC:  The raw zipcodes text file
    # $OUTFILE_ZC:  The clean zipcodes json file

    # $INFILE_LOC:  The raw shape file
    # $OUTFILE_LOC:  The clean geoJson file

    zc_filter=$(python ZipCounts.py ${INFILE_ZC} ${OUTFILE_ZC})
    if [[ -e ${OUTFILE_LOC} ]]; then
        Write-Host "${OUTFILE_LOC} exists!"
        rm ${OUTFILE_LOC}
    fi

    # For reasons I truly cant understand, I have to Write-Host the following command
    # to a file and execute it rather than call the command directly...
    # It has something to do with passing filters on the command-line
    Write-Host "#!/usr/bin/env bash\n" > extractGeoJson.sh
    Write-Host "ogr2ogr -f GeoJson -where ${zc_filter} ${OUTFILE_LOC} ${INFILE_LOC}\n" >> extractGeoJson.sh
    bash extractGeoJson.sh

} # End of extractGeoJson


Function mergeCountsAndLocation {
    #------------------------------------------------------------------------
    #
    #  Purpose:
    #
    #
    #    Input:
    #
    #   Output:
    #
    #------------------------------------------------------------------------
    param{ [string]$COUNTS, [string]$TOPO, [string]$FINAL }

    python MergeCountsAndLocation.py ${COUNTS} ${TOPO} ${FINAL}
} # End of mergeCountsAndLocation


Function MAIN {
    #------------------------------------------------------------------------
    #
    #  Purpose:
    #
    #
    #    Input:
    #
    #   Output:
    #
    #------------------------------------------------------------------------

    param{ [string]$INPUT_ZIPCODE_FILE }

    # Check arguments
    if [[ -z $INPUT_ZIPCODE_FILE ]]; then
        $INPUT_ZIPCODE_FILE="PatientZipsRaw"
    fi

    $OUTPUT_ZIPCODE_FILE="patient_zip_counts"

    # Download GIS shapefiles of Illinois zipcode boundaries
    getShapeFiles $URL $ZIPCODE_GIS

    extractGeoJson \
        $DIR_RAW_ZC\$INPUT_ZIPCODE_FILE.txt \
        $DIR_CLEAN_ZC\$OUTPUT_ZIPCODE_FILE.json \
        $DIR_RAW_LOC\$ZIPCODE_GIS.shp \
        $DIR_CLEAN_LOC\$LOCATION_GEOJSON.json

    extractTopoJson \
        $DIR_CLEAN_LOC\$LOCATION_GEOJSON.json \
        $DIR_CLEAN_LOC\$LOCATION_TOPOJSON.json

    mergeCountsAndLocation \
        $DIR_CLEAN_ZC\$OUTPUT_ZIPCODE_FILE.json \
        $DIR_CLEAN_LOC\$LOCATION_TOPOJSON.json \
        $DIR_CLEAN_LOC\$LOCATION_TOPOJSON_COUNTS.json

    rm $DIR_RAW_LOC\$ZIPCODE_GIS.*   # remove the large files

} # End of MAIN


#================================================================================
#                                START OF MAIN
#================================================================================

INPUT_ZIPCODE_FILE=$1

MAIN $INPUT_ZIPCODE_FILE

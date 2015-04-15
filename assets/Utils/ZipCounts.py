"""
==============================================================================
Program: ZipCodeCounts.py
 Author: Kyle Reese Almryde
   Date: 04/14/2015

 Description:



==============================================================================
"""
import sys
import json


def getZipCounts(fname):
    """
    Using a FreqDist object, count the number of zipcodes in the
    provided file
    """
    counts = {}
    with open(fname) as f:
        for zc in f.readlines():
            z = zc.strip()
            if z in counts:
                counts[z] += 1
            else:
                counts[z] = 1
    return counts


def writeZipCountsToJson(counts, fname):
    with open(fname, 'w') as f:
        f.write(json.dumps(counts))
    return True


# =============================== START OF MAIN ===============================


def main():
    INPUT_ZC = sys.argv[1]
    OUTPUT_ZC = sys.argv[2]

    # zCc is the zipcode Counts, it is a dictionary with zipcodes as keys
    # and their counts as the values
    zCc = getZipCounts(INPUT_ZC)
    if writeZipCountsToJson(zCc, OUTPUT_ZC):
        print repr("ZCTA5CE10 IN " + str(tuple([str(x) for x in zCc.keys()])))
    else:
        raise Exception

if __name__ == '__main__':
    main()

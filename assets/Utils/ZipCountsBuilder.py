import json
from nltk.probability import FreqDist


INPUT_ENROLL = "../Data/Raw/Enrollment/PatientZipsRaw.txt"
OUTPUT_ENROLL = "../Data/Clean/Enrollment/patient_zip_counts.json"

INPUT_LOC = "../Data/Clean/Location/chicago_ZC_topo.json"
OUTPUT_LOC = "../Data/Clean/Location/chicago_ZC_Counts_topo.json"

counts = {}
location = {}

with open(INPUT_ENROLL) as f:
    counts = FreqDist([z.strip() for z in f.readlines()])

if sum(counts.values()) != 28480:
    print "ERROR!! Expected 28480 but got", sum(counts.values())
else:
    with open(OUTPUT_ENROLL, 'w') as f:
        f.write(json.dumps(counts))


with open(INPUT_LOC) as f:
    location = json.load(f)

print repr(counts.keys()[0])
for i in range(len(location['objects']['chicago_ZC_Geo']['geometries'])):
    zipKey = int(location['objects']['chicago_ZC_Geo']['geometries'][i]['properties']['zipcode'])
    zipKey2 = location['objects']['chicago_ZC_Geo']['geometries'][i]['properties']['zipcode']
    if zipKey2 in counts.keys():
        location['objects']['chicago_ZC_Geo']['geometries'][i]['properties']['density'] = counts[zipKey2]
    else:
        print "Keys dont match! {}, {}".format(repr(zipKey), repr(zipKey2))
with open(OUTPUT_LOC, 'w') as f:
    f.write(json.dumps(location))

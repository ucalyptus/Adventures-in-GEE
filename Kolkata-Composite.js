 1 // Filter the collection for the VV product from the descending track
var collectionVV = ee.ImageCollection('COPERNICUS/S1_GRD')
    .filter(ee.Filter.eq('instrumentMode', 'IW'))
    .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
    .filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'))
    .filterBounds(roi)
    .select(['VV']);
print(collectionVV);

// Filter the collection for the VH product from the descending track
var collectionVH = ee.ImageCollection('COPERNICUS/S1_GRD')
    .filter(ee.Filter.eq('instrumentMode', 'IW'))
    .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
    .filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'))
    .filterBounds(roi)
    .select(['VH']);
print(collectionVH);

Map.centerObject(roi,13);

var VV = collectionVV.median();

Map.addLayer(VV,{min:-20,max:-7},'VV');

//Calculate the VH layer and add it
var VH = collectionVH.median();
Map.addLayer(VH, {min: -20, max: -7}, 'VH');

// Create a 3 band stack by selecting from different periods (months)
var VV1 = ee.Image(collectionVV.filterDate('2018-01-01', '2018-04-30').median());
var VV2 = ee.Image(collectionVV.filterDate('2018-05-01', '2018-08-31').median());
var VV3 = ee.Image(collectionVV.filterDate('2018-09-01', '2018-12-31').median());

//Add to map
Map.addLayer(VV1.addBands(VV2).addBands(VV3), {min: -12, max: -7}, 'Season composite');

// Create a 3 band stack by selecting from different periods (months)
var VH1 = ee.Image(collectionVH.filterDate('2018-01-01', '2018-04-30').median());
var VH2 = ee.Image(collectionVH.filterDate('2018-05-01', '2018-08-31').median());
var VH3 = ee.Image(collectionVH.filterDate('2018-09-01', '2018-12-31').median());

//Add to map
Map.addLayer(VV1.addBands(VH2).addBands(VV3), {min: -12, max: -7}, 'VV1,VH2,VV3 composite');


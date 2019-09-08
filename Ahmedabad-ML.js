var image = ee.Image(ee.ImageCollection('LANDSAT/LC08/C01/T1_SR')
    .filterBounds(roi)
    .filterDate('2019-05-01', '2019-06-30')
    .sort('CLOUD_COVER')
    .first());

Map.addLayer(image, {bands: ['B4', 'B3', 'B2'],min:0, max: 3000}, 'True colour image');

//Merge into one FeatureCollection and print details to consloe
var classNames = tWater.merge(tCity).merge(tForest).merge(tOther);
print(classNames);
var bands = ['B2', 'B3', 'B4', 'B5', 'B6', 'B7'];
var training = image.select(bands).sampleRegions({
  collection: classNames,
  properties: ['landcover'],
  scale: 30
});
print(training);

var classifier = ee.Classifier.cart().train({
  features: training,
  classProperty: 'landcover',
  inputProperties: bands
});
var classified = image.select(bands).classify(classifier);
//Centre the map on your training data coverage
Map.centerObject(classNames, 11);
//Add the classification to the map view, specify colours for classes
Map.addLayer(classified,
{min: 0, max: 3, palette: ['blue', 'red', 'green', 'yellow']},
'classification');


//Merge into one FeatureCollection
var valNames = vWater.merge(vCity).merge(vForest).merge(vOther);
var validation = classified.sampleRegions({
  collection: valNames,
  properties: ['landcover'],
  scale: 30,
});
print(validation);

//Compare the landcover of your validation data against the classification result
var testAccuracy = validation.errorMatrix('landcover', 'classification');
//Print the error matrix to the console
print('Validation error matrix: ', testAccuracy);
//Print the overall accuracy to the console
print('Validation overall accuracy: ', testAccuracy.accuracy());


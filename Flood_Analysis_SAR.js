var aoi = ee.FeatureCollection("FAO/GAUL/2015/level2")
    .filter(ee.Filter.eq('ADM2_NAME', 'Dhuburi'));
var roi = aoi;

Map.centerObject(roi);

function despeckel(img){
  return img.focalMean(30,'square','meters')
  .copyProperties(img, img.propertyNames())
}

var year_start = '2023', year_end = '2024';

var before = ee.ImageCollection("COPERNICUS/S1_GRD")
  .filterBounds(roi)
  .filterDate(year_start, year_end)
  .filter(ee.Filter.calendarRange(4, 4, 'month'))
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
  .filter(ee.Filter.eq('instrumentMode', 'IW'))
  .select('VV')
  .map(despeckel)
  .min();

Map.addLayer(before.clip(roi), {}, 'Before24', false);
////
var after = ee.ImageCollection("COPERNICUS/S1_GRD")
  .filterBounds(roi)
  .filterDate(year_start, year_end)
  .filter(ee.Filter.calendarRange(7,7,'month'))
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
  .filter(ee.Filter.eq('instrumentMode', 'IW'))
  .select('VV')
  .map(despeckel)
  .min(); //----> We set it to min coz, looking for a lower backscattered value, amon flood areas

Map.addLayer(after.clip(roi), {}, 'After2024',  false);

var change = before.subtract(after);
Map.addLayer(change.clip(roi),{}, 'Flooded Regions24', false);

print(
  ui.Chart.image.histogram(change, roi, 30)
  );

Map.addLayer(change.gt(5).clip(roi), {}, 'Flooded Threshold24',false);
var flood_thr = change.gt(5);
var flood_mask = flood_thr.updateMask(flood_thr);
var flood_area = flood_mask.multiply(ee.Image.pixelArea().divide(1e6));
var flood_region24 = flood_area.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry : roi,
  scale : 30
}).values().get(0);

print(ee.Number(flood_region24), 'Flood area in 2024 AOI (Km2)')

///<<-----2023---->>>>----------2023---------->>>>----------2023-------->>>>------2023----->>>>\\\

function despeckel(img){
  return img.focalMean(30,'square','meters')
  .copyProperties(img, img.propertyNames())
}

var year_start = '2022', year_end = '2023';

var before23 = ee.ImageCollection("COPERNICUS/S1_GRD")
  .filterBounds(roi)
  .filterDate(year_start, year_end)
  .filter(ee.Filter.calendarRange(4, 4, 'month')) 
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
  .filter(ee.Filter.eq('instrumentMode', 'IW'))
  .select('VV')
  .map(despeckel)
  .min();

Map.addLayer(before23.clip(roi), {}, 'Before23', false);
////
var after23 = ee.ImageCollection("COPERNICUS/S1_GRD")
  .filterBounds(roi)
  .filterDate(year_start, year_end)
  .filter(ee.Filter.calendarRange(7,7,'month')) 
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
  .filter(ee.Filter.eq('instrumentMode', 'IW'))
  .select('VV')
  .map(despeckel)
  .min();

Map.addLayer(after23.clip(roi), {}, 'After23',  false);

var change = before23.subtract(after23);
Map.addLayer(change.clip(roi),{}, 'Flooded Regions23', false);

print(
  ui.Chart.image.histogram(change, roi, 30)
  );

Map.addLayer(change.gt(5).clip(roi), {}, 'Flooded Threshold23',false);
var flood_thr = change.gt(5);
var flood_mask = flood_thr.updateMask(flood_thr);
var flood_area = flood_mask.multiply(ee.Image.pixelArea().divide(1e6));
var flood_region23 = flood_area.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry : roi,
  scale : 30
}).values().get(0);

print(ee.Number(flood_region23), 'Flood area in 2023 AOI (Km2)')
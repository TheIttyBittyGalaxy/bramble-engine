// ASSET LOADER //
assets = {};
assets.image = {};
assets.sound = {};

assets.loader = {};
assets.loader.complete = false;
assets.loader.totalAssetCount = 0;
assets.loader.loadedAssetCount = 0;

assets.loader.unloadedAssets = [];

// Callback function used by an asset when it loads
assets.loader.assetLoadCallback = function () {
  assets.loader.loadedAssetCount++;
  if ( assets.loader.loadedAssetCount == assets.loader.totalAssetCount ) assets.loader.complete = true
}

// Functions used to declare assets
assets.loader.loadImages = function( assetNames , fileType ) {
  var fileType = fileType || 'png';
  assets.loader.totalAssetCount += assetNames.length;
  for ( var assetName of assetNames ) {
    assets.loader.unloadedAssets.push({
      "name": assetName,
      "fileType": fileType,
      "objectClass": Image,
      "src": "assets/images/" + assetName + "." + fileType,
      "loadEvent": "load",
      "container": assets.image,
    });
  }
}

assets.loader.loadSounds = function( assetNames , fileType ) {
  var fileType = fileType || "mp3";
  assets.loader.totalAssetCount += assetNames.length;
  for ( var assetName of assetNames ) {
    assets.loader.unloadedAssets.push({
      "name": assetName,
      "fileType": fileType,
      "objectClass": Audio,
      "src": "assets/sounds/" + assetName + "." + fileType,
      "loadEvent": "canplaythrough",
      "container": assets.sound,
    });
  }
}

// Function used to load assets
assets.loader.loadAssets = function() {
  while ( assets.loader.unloadedAssets.length > 0 ) {

    // Get asset info
    let assetInfo = assets.loader.unloadedAssets.pop();

    // Create the asset's DOM object
    let obj = new assetInfo.objectClass;
    obj.addEventListener( assetInfo.loadEvent , function() {
      assets.loader.loadedAssetCount++;
      assetInfo.container[ assetInfo.name ] = obj;
    });
    // obj.addEventListener( "error" , function() {});

    // Trigger the asset to load
    obj.src = assetInfo.src
  }
}

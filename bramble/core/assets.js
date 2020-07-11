// ASSET LOADER //
bramble.assetLoader = {};
bramble.assetLoader.unloadedAssets = [];
bramble.assetLoader.totalAssetCount = 0;
bramble.assetLoader.loadedAssetCount = 0;
bramble.assetLoader.onComplete = new Event();

bramble.assetLoader.defaultImageType = "png";
bramble.assetLoader.defaultSoundType = "mp3";

// Functions used to declare assets
bramble.assetLoader.loadImages = function(assetNames, fileType) {
  var fileType = fileType || bramble.assetLoader.defaultImageType;
  bramble.assetLoader.totalAssetCount += assetNames.length;
  for (var assetName of assetNames) {
    bramble.assetLoader.unloadedAssets.push({
      "name": assetName,
      "fileType": fileType,
      "objectClass": Image,
      "src": "assets/" + assetName + "." + fileType,
      "loadEvent": "load",
      "container": game.asset,
    });
  }
}

bramble.assetLoader.loadSounds = function(assetNames, fileType) {
  var fileType = fileType || bramble.assetLoader.defaultSoundType;
  bramble.assetLoader.totalAssetCount += assetNames.length;
  for (var assetName of assetNames) {
    bramble.assetLoader.unloadedAssets.push({
      "name": assetName,
      "fileType": fileType,
      "objectClass": Audio,
      "src": "assets/" + assetName + "." + fileType,
      "loadEvent": "canplaythrough",
      "container": game.asset,
    });
  }
}

// Function used to load assets
bramble.assetLoader.loadAssets = function() {
  while (bramble.assetLoader.unloadedAssets.length > 0) {

    // Get asset info
    let assetInfo = bramble.assetLoader.unloadedAssets.pop();

    // Reassign name and container
    while (assetInfo.name.search(/[\\/]/) > -1) {
      var slashPos = assetInfo.name.search(/[\\/]/);
      var subContainerName = assetInfo.name.charAt(0).toLowerCase() + assetInfo.name.substr(1, slashPos - 1);
      if (assetInfo.container[subContainerName] == null) assetInfo.container[subContainerName] = {};
      assetInfo.container = assetInfo.container[subContainerName];
      assetInfo.name = assetInfo.name.slice(slashPos + 1);
    }
    assetInfo.name = assetInfo.name.charAt(0).toLowerCase() + assetInfo.name.slice(1);

    // Create the asset's DOM object
    let obj = new assetInfo.objectClass;
    obj.addEventListener(assetInfo.loadEvent, function() {
      bramble.assetLoader.loadedAssetCount++;
      assetInfo.container[assetInfo.name] = obj;
    });

    // Trigger the asset to load
    obj.src = assetInfo.src;
  }
  bramble.assetLoader.onComplete.invoke();
}

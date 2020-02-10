import os

# Which files should be imported and and in which order
fileNames = [
    "core/init.js",
    "core/assets.js",
    "core/state.js",
    "core/loop.js",
    "core/load.js",
    "core/start.js",
    "core/draw.js",
    "core/input.js",

    "object/vector.js",
    "object/state.js",
    "object/entity.js",
    "object/component.js",
    "object/ComponentGroupList.js",

    "components.js",
    "states.js",
]

# Generate content of engine file
engineContent = ""
for fileName in fileNames:
    f = open( "bramble/" + fileName , "r" )
    engineContent += f.read() + "\n"
    f.close()

# Write content to file
f = open( "bramble.js" , "w" )
f.write( engineContent )
f.close()

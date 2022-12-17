import os
import re

# Which files should be imported and and in which order
fileNames = [
    "utility.js",

    "object/event.js",
    "object/entity.js",
    "object/component.js",
    "object/componentSignature.js",
    # "object/system.js",
    "object/vector.js",
    "object/bitset.js",

    "core/init.js",
    "core/ecsComponentManager.js",
    "core/assets.js",
    "core/loop.js",
    "core/load.js",
    "core/start.js",
    "core/draw.js",
    "core/audio.js",
    "core/input.js",

    "components.js"
]

# Generate content of engine file
engineContent = ""
for fileName in fileNames:
    f = open( "bramble/" + fileName , "r" )
    engineContent += f.read() + "\n"
    f.close()

# Modify content
engineContent = re.sub( r"//.*\n" , "\n" , engineContent )
engineContent = re.sub( r"\n\s*\n" , "\n" , engineContent )
engineContent = engineContent.strip()

# Write content to file
f = open( "bramble.js" , "w" )
f.write( engineContent )
f.close()

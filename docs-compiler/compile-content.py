import json
from pprint import pprint

# Load inital content
f = open( 'base-content.json' , 'r' )
content = json.loads( f.read() )
f.close()

# Parse code base for doc strings
fileNames = [
    # 'core/init.js',
    # 'core/assets.js',
    # 'core/state.js',
    # 'core/loop.js',
    # 'core/start.js',
    # 'core/draw.js',
    # 'core/input.js',

    # 'object/vector.js',
    'object/entity.js',
    # 'object/component.js',

    # 'components.js',
]

# For each file to be documented
for fileName in fileNames:
    f = open( '../bramble/' + fileName , 'r' )
    parsing = False
    getName = False;

    item = {}
    container = content

    # For each line in the file
    for line in f:
        sLine = line.strip()

        # Set the name and kind of the current item
        if ( getName ):

            # Is a class
            if ( sLine[:6] == 'class '):
                itemName = sLine[6:sLine.find(' ')-7]
                item['kind'] = 'class'
            else:
                itemName = sLine[:sLine.find('(')]
                item['kind'] = 'function'
            container['content'][itemName] = item
            getName = False;

        # If currently parsing a doc string
        elif ( parsing ):

            # Check if parsing should finish
            if ( sLine[:2] == '*/' ):
                parsing = False
                getName = True;
                sLine = sLine[::2]

            # Function argument
            if ( sLine[:9] == 'argument:' ):
                if ( 'arguments' not in item ): item['arguments'] = []
                data = sLine[9:].strip()
                name = data[:data.find(' ')]
                data = data[data.find(' ')+1:]
                type = data[:data.find(' ')]
                data = data[data.find(' ')+1:]
                description = data
                item['arguments'].append({
                    "name": name,
                    "type": type,
                    "description": description
                })

            # Implementation
            elif ( sLine[:15] == 'implementation:' ):
                item['implementation'] = sLine[15:].strip()

            # Description
            else:
                item['description'] = sLine

        # If a doc string has been started
        elif ( sLine[:4] == '/*::' ):
                parsing = True
                item = {}
                container = content
                for contentName in sLine[4:].strip().split('/'):
                    if ( 'content' not in container ): container['content'] = {}
                    if ( contentName not in container['content'] ): container['content'][contentName] = {}
                    container = container['content'][contentName]
                if ( 'content' not in container ): container['content'] = {}

# Test
f = open( 'full-content.json' , 'w' )
f.write( json.dumps(content , indent=2, sort_keys=True) )
f.close()
# print(json.dumps(content))

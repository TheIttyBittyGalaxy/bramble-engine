import json

#    JavaScript doc string syntax
#    /* parentContentPath
#    Lines with no definition indicator (see following lines) are added to the content's decription
#    Decription can be multi-line, and supports markdown
#    argument: valueName valueType Markdown description of the argument
#    return: valueName valueType Markdown description of the return value
#    implementation: none/partial/complete
#    */
#
#    Comment closer (*/) does not have to be on it's own line
#    To indicate that method c belongs to class B of system a, the parent content path would be "a/B"

# Load base content from file
f = open( 'base-content.json' , 'r' )
content = json.loads( f.read() ) # The json object representing all documented content
f.close()

# List of files that should be searched for doc strings
fileNames = [
    'core/init.js',
    'core/assets.js',
    'core/state.js',
    'core/loop.js',
    'core/start.js',
    'core/draw.js',
    'core/input.js',

    'object/vector.js',
    'object/entity.js',
    'object/component.js',

    'components.js',
]

# For each file to be documented, load the file and scan each line looking for doc strings
for fileName in fileNames:
    parsing = False # Indicates if a doc string is currently being parsed
    pLine = '' # The previous line of the file
    item = {} # The item (e.g. class) currently being parsed
    container = content # The container of the current item

    f = open( '../bramble/' + fileName , 'r' )

    # Scan lines
    for line in f:
        sLine = line.strip()

        # When parsing doc string
        if ( parsing ):

            # Check if parsing should finish
            if ( sLine[-2:] == '*/' ):
                parsing = False
                sLine = sLine[:-2]

            # Identify a function argument definition
            if ( sLine[:9] == 'argument:' ):
                if ( 'arguments' not in item ): item['arguments'] = []
                data = sLine[9:].strip()
                name = data[:data.find(' ')]
                data = data[data.find(' ')+1:]
                type = data[:data.find(' ')]
                data = data[data.find(' ')+1:]
                description = data
                item['arguments'].append({
                    'name': name,
                    'type': type,
                    'description': description
                })

            # Identify a function return value definition
            elif ( sLine[:7] == 'return:' ):
                if ( 'returns' not in item ): item['returns'] = []
                data = sLine[9:].strip()
                name = data[:data.find(' ')]
                data = data[data.find(' ')+1:]
                type = data[:data.find(' ')]
                data = data[data.find(' ')+1:]
                description = data
                item['returns'].append({
                    'name': name,
                    'type': type,
                    'description': description
                })

            # Identify an implementation definition
            elif ( sLine[:15] == 'implementation:' ):
                item['implementation'] = sLine[15:].strip()

            # Description definition
            else:
                if ( 'description' not in item ): item['description'] = sLine
                else: item['description'] += '\n' + sLine

        # When starting new doc string
        elif ( sLine[:4] == '/*::' ):

            # Reset parser
            parsing = True
            item = {}
            container = content

            # Navigate to new items's container
            for contentName in sLine[4:].strip().split('/'):
                if ( 'content' not in container ): container['content'] = {}
                if ( contentName not in container['content'] ): container['content'][contentName] = {}
                container = container['content'][contentName]
                if ( 'content' not in container ): container['content'] = {}

            # Set the name and kind of the current item based on the previous line
            if ( pLine[:6] == 'class '):
                itemName = pLine[6:pLine.find(' ')-7]
                item['kind'] = 'class'
            else: # Is a function/method
                itemName = pLine[:pLine.find('(')]
                item['kind'] = 'function'
            container['content'][itemName] = item

        # Remember the previous line for the next iteration
        pLine = sLine

# Save complete content to file
f = open( 'full-content.json' , 'w' ) # This file is include in .git-ignore. Run this script locally to see the result
f.write( json.dumps(content , indent=2, sort_keys=True) )
f.close()

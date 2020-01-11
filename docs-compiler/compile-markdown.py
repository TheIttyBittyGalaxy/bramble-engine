import json
import re

# Load full content from file
f = open( 'full-content.json' , 'r' ) # This file is include in .git-ignore
content = json.loads( f.read() ) # The json object representing all documented content
f.close()

# Function to compile a system content item into markdown
def compileSystem( systemName , systemItem ):
    if ( systemItem['kind'] != 'system' ): raise RuntimeError( 'Cannot compile "' + systemName + '" as a system as it is if of type "' + systemItem['kind'] + '"' )

    functionsMd = '\n## Functions\n'
    areFunctions = False
    classesMd = '\n## Classes\n'
    areClasses = False

    # Iterate through system content
    if ( 'content' in systemItem ):
        for itemName in systemItem['content']:
            item = systemItem['content'][itemName]

            # Item is a function
            if ( item['kind'] == 'function' ):
                areFunctions = True
                functionsMd += compileFunction( itemName , name , 3 )

            # Item is a class
            elif ( item['kind'] == 'class' ):
                areClasses = True

                # Basic overview
                classesMd += '\n### ' + itemName + '\n'
                if ( 'description' in item ): classesMd += re.sub( r'\n+' , '\n\n' , item['description'] ) + '\n'

                # Methods
                if ( 'content' in item ):
                    for subItemName in item['content']:
                        subItem = item['content'][subItemName]
                        if ( subItem['kind'] == 'function' ):
                            classesMd += compileFunction( itemName + '.' + subItemName , subItem , 4 )
                        else:
                            raise RuntimeError( 'Cannot compile ' + subItem['kind'] + ' "' + subItemName + '" (content of system "' + itemName + '") as it is not a function (method)' )

            # Item is of invalid kind
            else:
                raise RuntimeError( 'Cannot compile ' + item['kind'] + ' "' + itemName + '" (content of system "' + systemName + '") as it is not a function or class' )

    # Output final result
    finalMd = '\n# ' + systemName + '\n'
    if ( 'description' in systemItem ): finalMd += systemItem['description'] + '\n'
    if ( areFunctions ): finalMd += functionsMd + '\n'
    if ( areClasses ): finalMd += classesMd + '\n'

    return finalMd

# Function to compile function content item into markdown
def compileFunction( functName , functItem , level=1 ):
    if ( functItem['kind'] != 'function' ): raise RuntimeError( 'Cannot compile "' + functName + '" as a function as it is if of type "' + functItem['kind'] + '"' )

    # Basic overview
    finalMd = '\n' + '#'*(level) + ' ' + functName + '\n'
    if ( 'description' in functItem ): finalMd += re.sub( r'\n+' , '\n\n' , functItem['description'] ) + '\n'

    # Arguments
    if ( 'arguments' in functItem ):
        # finalMd += '\n' + '#'*(level+1) + ' Arguments\n'
        finalMd += '\n**Arguments**\n'

        finalMd += '\n| Data Type | Name | Description |\n| :--- | :--- | :--- |\n' # Blank line is required before a table so that GitHub can render it
        for arg in functItem['arguments']: finalMd += '| `' + arg['type'] + '` | `' + arg['name'] + '` | ' + arg['description'] + ' |\n'

    # Return values
    if ( 'returns' in functItem ):
        # finalMd += '\n' + '#'*(level+1) + ' Returns\n'
        finalMd += '\n**Returns**\n'

        finalMd += '\n| Data Type | Name | Description |\n| :--- | :--- | :--- |' # Blank line is required before a table so that GitHub can render it
        for val in functItem['returns']: finalMd += '| `' + val['type'] + '` | `' + val['name'] + '` | ' + val['description'] + ' |\n'

    return finalMd

# Compile all systems in the root content
docMd = ''
for systemName in content['content']:
    docMd += compileSystem( systemName , content['content'][systemName] )
docMd = docMd.strip()

# Save complete markdown to file
f = open( 'documentation.md' , 'w' )
f.write( docMd )
f.close()

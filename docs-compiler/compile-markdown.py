import copy
import json
import re

# Load full content from file
f = open( 'full-content.json' , 'r' ) # This file is include in .git-ignore
content = json.loads( f.read() ) # The json object representing all documented content
f.close()

# TEXT HANDLERS #

# Function to convert a string from camel case to a capitalised string
# e.g. "entityComponentSystem" -> "Entity Component System"
def deCamelCase( s ):
    return re.sub( r'(.)([A-Z])',r'\1 \2',s).title()

# Function to create a markdown header
def createHeader( text , level , deCamel=False ):
    return '\n' + '#'*level + ' ' + (deCamelCase(text) if deCamel else text) + '\n'

# Function to format a multiline string into markdown
def formatParagraphs( text ):
    return re.sub( r'\n+' , '\n\n' , text ) + '\n'

# Function to create a table of an object using the given mapping
def createTable( obj , mapping ):

    # Header row
    markdown = '\n|'
    for label in mapping: markdown += ' ' + label + ' |'
    markdown += '\n| :--- | :--- | :--- |\n'

    # Body rows
    for row in obj:
        markdown += '|'
        for label in mapping: markdown += ' ' + row[ mapping[label] ] + ' |'
        markdown += '\n'

    return markdown

# Function to create a table of function arguments or return values
def createFunctionValuesTable( heading , obj , level=1 ):
    table = copy.copy( obj )
    for row in table:
        row['name'] = '`' + row['name'] + '`'
        row['type'] = '`' + row['type'][row['type'].rfind('/')+1:] + '`'

    # markdown += createHeader( heading , level )
    markdown = '\n**' + heading + '**\n'
    markdown += createTable( table , {
        'Data Type': 'type',
        'Name': 'name',
        'Description': 'description'
    })

    return markdown

# COMPILE SYSTEM #
def compileSystem( itemName , item , level=1 ):
    if ( item['kind'] != 'system' ): raise RuntimeError( 'Cannot compile "' + itemName + '" as a system as it is if of kind "' + item['kind'] + '"' )

    # Markdown sections
    openingMd = createHeader( itemName , level , True )
    functionsMd = createHeader( 'Functions' , level+1 )
    classesMd = ''
    areFunctions = False
    areClasses = False

    # Opening section
    if ( 'description' in item ): openingMd += formatParagraphs( item['description'] )

    # Iterate through system content
    if ( 'contents' in item ):
        for childItemName in item['contents']:
            childItem = item['contents'][childItemName]
            if   ( childItem['kind'] == 'function' ): areFunctions = True; functionsMd += compileFunction( childItemName , childItem , level+2 )
            elif ( childItem['kind'] == 'class' ):    areClasses = True;   classesMd += compileClass( childItemName , childItem , level+1 )
            else: raise RuntimeError( 'Cannot compile ' + item['kind'] + ' "' + childItemName + '" (content of system "' + itemName + '") as it is not a function or class' )

    # Output final result
    finalMd = openingMd
    if ( areFunctions ): finalMd += functionsMd
    if ( areClasses ): finalMd += classesMd

    return finalMd

# COMPILE CLASS #
def compileClass( itemName , item , level=1 ):
    if ( item['kind'] != 'class' ): raise RuntimeError( 'Cannot compile "' + itemName + '" as a class as it is if of kind "' + item['kind'] + '"' )

    # Basic overview
    markdown = createHeader( itemName , level )
    if ( 'description' in item ): markdown += re.sub( r'\n+' , '\n\n' , item['description'] ) + '\n'

    # Methods section
    if ( 'contents' in item ):
        for subItemName in item['contents']:
            subItem = item['contents'][subItemName]
            if ( subItem['kind'] == 'function' ): markdown += compileFunction( itemName + '.' + subItemName , subItem , level+1 )
            else: raise RuntimeError( 'Cannot compile ' + subItem['kind'] + ' "' + subItemName + '" (content of system "' + itemName + '") as it is not a function (method)' )

    return markdown

# COMPILE FUNCTION #
def compileFunction( itemName , item , level=1 ):
    if ( item['kind'] != 'function' ): raise RuntimeError( 'Cannot compile "' + itemName + '" as a function as it is if of kind "' + item['kind'] + '"' )

    # Basic overview
    markdown = createHeader( itemName , level )
    if ( 'description' in item ): markdown += formatParagraphs( item['description'] )

    # Argument and return value tables
    if ( 'f-arguments' in item ): markdown += createFunctionValuesTable( 'Arguments' , item['f-arguments'] )
    if ( 'f-returns' in item ): markdown += createFunctionValuesTable( 'Return values' , item['f-returns'] )

    return markdown

# Compile all systems in the root content
docMd = ''
for systemName in content['contents']:
    itemKind = content['contents'][systemName]['kind']
    if ( itemKind == "system" ): docMd += compileSystem( systemName , content['contents'][systemName] )
    elif ( itemKind == "class" ): docMd += compileClass( systemName , content['contents'][systemName] )
    elif ( itemKind == "function" ): docMd += compileFunction( systemName , content['contents'][systemName] )
docMd = docMd.strip()

# Save complete markdown to file
f = open( 'documentation.md' , 'w' )
f.write( docMd )
f.close()

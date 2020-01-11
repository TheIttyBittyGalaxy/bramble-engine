# Vector
2D vector class 

| Data Type | Name | Description |
| :--- | :--- | :--- |
| `float` | `x` | The x value of the vector |
| `float` | `y` | The y value of the vector |
| `float` | `m` | The magnitude of the vector |
| `Vector` | `u` | The unit vector of vector |
| `Vector` | `n` | The normal to the vector |

## Methods

### add( v )

**Arguments**

| Data Type | Name | Description |
| :--- | :--- | :--- |
| `Vector` | `v` | The vector to be added to the calling vector |

**Return values**

| Data Type | Name | Description |
| :--- | :--- | :--- |
| `Vector` | `r` | A new vector object resulting from the operation |

### angleTo( v )
Finds the angle between the calling vector and the argument vector

**Arguments**

| Data Type | Name | Description |
| :--- | :--- | :--- |
| `Vector` | `v` | The argument vector |

**Return values**

| Data Type | Name | Description |
| :--- | :--- | :--- |
| `float` | `angle` | The angle between the two vectors |

### constructor( x, y )

**Arguments**

| Data Type | Name | Description |
| :--- | :--- | :--- |
| `int` | `x` | Vector x value |
| `int` | `y` | Vector y value |

### div( v )

**Arguments**

| Data Type | Name | Description |
| :--- | :--- | :--- |
| `Vector` | `v` | The vector to divide the calling vector |

**Return values**

| Data Type | Name | Description |
| :--- | :--- | :--- |
| `Vector` | `r` | A new vector object resulting from the operation |

### dot( v )

**Arguments**

| Data Type | Name | Description |
| :--- | :--- | :--- |
| `Vector` | `v` | The vector to be used in a dot multiplication with the calling vector |

**Return values**

| Data Type | Name | Description |
| :--- | :--- | :--- |
| `Vector` | `r` | A new vector object resulting from the operation |

### mul( v )

**Arguments**

| Data Type | Name | Description |
| :--- | :--- | :--- |
| `Vector` | `v` | The vector to be multiplied with the calling vector |

**Return values**

| Data Type | Name | Description |
| :--- | :--- | :--- |
| `Vector` | `r` | A new vector object resulting from the operation |

### sub( v )

**Arguments**

| Data Type | Name | Description |
| :--- | :--- | :--- |
| `Vector` | `v` | The vector to be subtracted from the calling vector |

**Return values**

| Data Type | Name | Description |
| :--- | :--- | :--- |
| `Vector` | `r` | A new vector object resulting from the operation |

# Asset Loader
The asset loader is used to automatically track the loading of all of the game's image and sound assets.

# Entity Component System
Bramble has a built in ECS. Entities are objects that inherit from the `Entity` class. Components are objects that inherit from a child class of the `Component` class

## Component
A component stores data about an aspect of an entity. Components should only contain data, and no functionality.

In practise, this means that component classes are primarily composed of attributes, getters, and setters, and may also have some methods for utility. Typically, they should not contain methods that contain game logic however.

### Methods

#### constructor()

## Entity
An entity represents a game object with a collection of instantiated components. Components can be added and removed at run time. Entities may contain multiple instances of the same component type if that component permits it.

Unlike traditional game objects, entities should not contain game logic. Instead they should only contain data, which should be processed in a game system.

### Methods

#### addComponent( comp )
Adds the given component to the entity

**Arguments**

| Data Type | Name | Description |
| :--- | :--- | :--- |
| `Component` | `comp` | The component that will be added to the entity |

#### constructor()
Creates a new entity

#### removeComponent( comp )
Removes the specified component from the entity

**Arguments**

| Data Type | Name | Description |
| :--- | :--- | :--- |
| `Component` | `comp` | The component that will be removed from the entity |
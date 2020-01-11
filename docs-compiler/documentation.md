# assetLoader
The asset loader is used to automatically track the loading of all of the game's image and sound assets.

# entityComponentSystem
Bramble has a built in ECS. Entities are objects that inherit from the `Entity` class. Components are are objects that inherit from a child class of the 'Component' class

## Classes

### Entity
An entity represents a game object with a collection of instansiated components. Components can be added and removed at run time. Entities may contain multiple instances of the same component type if that component permits it.

Unlike traditional game objects, entities should not contain game logic. Instead they should only contain data, which should be processed in a game system.

#### Entity.addComponent
Adds the given component to the entiy

argument: comp entityComponentSystem/Component The component that will be added to the entity

**Arguments**

| Data Type | Name | Description |
| --- | --- | --- |
| `entityComponentSystem/Component` | `comp` | The component that will be added to the entity |

#### Entity.constructor
Creates a new entity

#### Entity.removeComponent
Removes the specified component from the entity

argument: comp entityComponentSystem/Component The component that will be removed from the entity

**Arguments**

| Data Type | Name | Description |
| --- | --- | --- |
| `entityComponentSystem/Component` | `comp` | The component that will be removed from the entity |
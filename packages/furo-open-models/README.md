## Naming Conventions
The generated models are using camelCase notation for the field names, the UseProtoNames uses whatever was defined in the contract.
If a name start with an underscore, the model will use an X for the first letter.

`_user` => `XUser`

https://github.com/googleapis/googleapis/blob/master/google/api/field_behavior.proto

## Validators

### Class Validators

### Instance Validators

## Options
```js
import {OPEN_MODELS_OPTIONS} from "./x/@furo/open-models/core/OPEN_MODELS_OPTIONS";

OPEN_MODELS_OPTIONS.labelFormatter = (l)=> customTranslator(l.replaceAll('.','_').toUpperCase())
```


## CustomPrototypes

## Reserved words
- toString
- valueOf

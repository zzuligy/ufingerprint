# ms

![CI](https://github.com/vercel/ms/workflows/CI/badge.svg)

Use this package to easily get a unique device fingerprint

## Examples

<!-- prettier-ignore -->
```js
import {getFingerprint} from 'ufingerprint'
const fingerPrint = getFingerprint()
```

## Features

- get a unique fingerprint by webgl
- the different browsers will get the same fingerprint
- Incognito mode and standard mode will get the same fingerprint
- js will get the unique fingerprint in one device

## Related Packages

- [get-browser-fingerprint](https://github.com/damianobarbati/get-browser-fingerprint#readme) - inspired by this library

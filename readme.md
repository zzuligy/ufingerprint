# ufingerprint

![CI](https://github.com/vercel/ms/workflows/CI/badge.svg)

Use this package to easily get a unique device fingerprint([using webgl](https://privacycheck.sec.lrz.de/active/fp_wg/fp_webgl.html))

## Usage

<!-- prettier-ignore -->
```js
import {getFingerprint} from 'ufingerprint'
// if fingerPrint begin d like d3259600042,it means the fingerprint is from hardware not webgl.
const fingerPrint = getFingerprint()
```

## Example

<!-- prettier-ignore -->
```js
npm run demo
```

## Features

- get a unique fingerprint by webgl
- the different browsers will get the same fingerprint
- Incognito mode and standard mode will get the same fingerprint
- js will get the unique fingerprint in one device
- if fingerPrint begins with 'd' like d3259600042, it means the fingerprint is from hardware, not WebGL.

## Limit

- if your browser does not supports WegGl, your fingerprint is got from hardware. The fingerprint will differ by browser and Incognito mode. But the same chrome or safari in the same mode will return the same device id.
- if your browser supports WebGL, you will get a unique fingerprint on one device.

## Related Packages

- [get-browser-fingerprint](https://github.com/damianobarbati/get-browser-fingerprint#readme) - inspired by this library

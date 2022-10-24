/* eslint-disable  */
/**
 *
 * get the unique fingerprint by webgl identifier(if webgl is disable,the unique will according the hardware)
 *
 * chrome Incognito mode and standard mode,different browser(chrome,safari) will return the same fingerprint(when webgl is enable).
 * @param debug - whether enable debug mode(in debug mode the canvas will show on the screen)
 * @returns unique fingerprint
 */
export const getFingerprint = (debug = false) => {
  const webglId = getWebglID(debug);
  if (!webglId) {
    return `d${getDeviceId(debug)}`;
  }
  return `${webglId}`;
};

export const getWebglID = (debug: boolean) => {
  try {
    const canvas = document.createElement('canvas');
    const ctx: WebGLRenderingContext = canvas.getContext(
      'webgl',
    ) as WebGLRenderingContext;
    canvas.width = 256;
    canvas.height = 128;

    const f =
      'attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}';
    const g =
      'precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}';
    const h = ctx.createBuffer() as WebGLBuffer;

    ctx.bindBuffer(ctx.ARRAY_BUFFER, h);

    const i = new Float32Array([-0.2, -0.9, 0, 0.4, -0.26, 0, 0, 0.7321, 0]);

    ctx.bufferData(ctx.ARRAY_BUFFER, i, ctx.STATIC_DRAW);
    h.itemSize = 3;
    h.numItems = 3;

    const j = ctx.createProgram() as WebGLProgram;
    const k = ctx.createShader(ctx.VERTEX_SHADER) as WebGLShader;

    ctx.shaderSource(k, f);
    ctx.compileShader(k);

    const l = ctx.createShader(ctx.FRAGMENT_SHADER) as WebGLShader;

    ctx.shaderSource(l, g);
    ctx.compileShader(l);
    ctx.attachShader(j, k);
    ctx.attachShader(j, l);
    ctx.linkProgram(j);
    ctx.useProgram(j);

    j.vertexPosAttrib = ctx.getAttribLocation(j, 'attrVertex');
    j.offsetUniform = ctx.getUniformLocation(j, 'uniformOffset');

    ctx.enableVertexAttribArray(j.vertexPosArray);
    ctx.vertexAttribPointer(j.vertexPosAttrib, h.itemSize, ctx.FLOAT, !1, 0, 0);
    ctx.uniform2f(j.offsetUniform, 1, 1);
    ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, h.numItems);

    const n = new Uint8Array(canvas.width * canvas.height * 4);
    ctx.readPixels(
      0,
      0,
      canvas.width,
      canvas.height,
      ctx.RGBA,
      ctx.UNSIGNED_BYTE,
      n,
    );

    const result = JSON.stringify(n).replace(/,?"[0-9]+":/g, '');

    if (debug) {
      document.body.appendChild(canvas);
    } else {
      ctx.clear(
        // eslint-disable-next-line no-bitwise
        ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT | ctx.STENCIL_BUFFER_BIT,
      );
    }

    return murmurhash332gc(result);
  } catch {
    return null;
  }
};

export const getDeviceId = (debug: boolean) => {
  const {
    appName,
    appCodeName,
    appVersion,
    cookieEnabled,
    deviceMemory,
    doNotTrack,
    hardwareConcurrency,
    language,
    languages,
    maxTouchPoints,
    platform,
    product,
    productSub,
    userAgent,
    vendor,
    vendorSub,
  } = window.navigator;

  const { width, height, colorDepth, pixelDepth } = window.screen;
  const timezoneOffset = new Date().getTimezoneOffset();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const touchSupport = 'ontouchstart' in window;

  const data = JSON.stringify({
    appCodeName,
    appName,
    appVersion,
    colorDepth,
    cookieEnabled,
    deviceMemory,
    devicePixelRatio,
    doNotTrack,
    hardwareConcurrency,
    height,
    language,
    languages,
    maxTouchPoints,
    pixelDepth,
    platform,
    product,
    productSub,
    timezone,
    timezoneOffset,
    touchSupport,
    userAgent,
    vendor,
    vendorSub,
    width,
  });

  const datastring = JSON.stringify(data, null, 4);

  if (debug) {
    // eslint-disable-next-line no-console
    console.log('fingerprint data', datastring);
  }

  const result = murmurhash332gc(datastring);
  return result;
};

const murmurhash332gc = (key: string) => {
  const remainder = key.length & 3; // key.length % 4
  const bytes = key.length - remainder;
  const c1 = 0xcc9e2d51;
  const c2 = 0x1b873593;

  let h1, h1b, k1;

  for (let i = 0; i < bytes; i++) {
    k1 =
      (key.charCodeAt(i) & 0xff) |
      ((key.charCodeAt(++i) & 0xff) << 8) |
      ((key.charCodeAt(++i) & 0xff) << 16) |
      ((key.charCodeAt(++i) & 0xff) << 24);
    ++i;

    k1 =
      ((k1 & 0xffff) * c1 + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
    k1 = (k1 << 15) | (k1 >>> 17);
    k1 =
      ((k1 & 0xffff) * c2 + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;

    h1 ^= k1;
    h1 = (h1 << 13) | (h1 >>> 19);
    h1b =
      ((h1 & 0xffff) * 5 + ((((h1 >>> 16) * 5) & 0xffff) << 16)) & 0xffffffff;
    h1 = (h1b & 0xffff) + 0x6b64 + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16);
  }

  const i = bytes - 1;

  k1 = 0;

  switch (remainder) {
    case 3: {
      k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
      break;
    }
    case 2: {
      k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
      break;
    }
    case 1: {
      k1 ^= key.charCodeAt(i) & 0xff;
      break;
    }
  }

  k1 =
    ((k1 & 0xffff) * c1 + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
  k1 = (k1 << 15) | (k1 >>> 17);
  k1 =
    ((k1 & 0xffff) * c2 + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
  h1 ^= k1;

  h1 ^= key.length;

  h1 ^= h1 >>> 16;
  h1 =
    ((h1 & 0xffff) * 0x85ebca6b +
      ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) &
    0xffffffff;
  h1 ^= h1 >>> 13;
  h1 =
    ((h1 & 0xffff) * 0xc2b2ae35 +
      ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16)) &
    0xffffffff;
  h1 ^= h1 >>> 16;

  return h1 >>> 0;
};

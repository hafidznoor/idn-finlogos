export default {
  multipass: true,
  floatPrecision: 3,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
          cleanupIds: false,
          inlineStyles: { onlyMatchedOnce: false },
          convertPathData: { floatPrecision: 3 },
          convertTransform: { floatPrecision: 3 }
        }
      }
    },
    { name: 'removeXMLNS', active: false },
    { name: 'removeDimensions', active: false },
    'removeXMLProcInst',
    'removeComments',
    'removeMetadata',
    'removeEditorsNSData',
    'sortAttrs',
    'sortDefsChildren'
  ]
};

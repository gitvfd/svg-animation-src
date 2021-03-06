const range = require('lodash/range');
const { vec2 } = require('gl-matrix');

const SVG = require('../../utils/SVG');
const { createPoints } = require('../../utils/Polygon');

module.exports = () => {
  const animationDuration = 10;
  const NUM_POINTS = 8;
  const NUM_INNER_SHAPES = 4;
  const RADIUS = 30;

  const svg = SVG.svg({
    dataAnimationDuration: `${animationDuration}s`,
    viewBox: '-50 -50 100 100',
  });

  const points = createPoints(NUM_POINTS, RADIUS);
  const pointsString = points.map(p => p.join(',')).join(' ');

  const pointOffsets = createPoints(NUM_POINTS, RADIUS * 0.5);

  svg
    .defs()
    .clipPath({
      id: 'mask',
    })
    .polygon({
      points: pointsString,
    });

  svg.style(`
    polygon {
      fill: none;
      stroke: black;
      stroke-width: 2;
    }

    .inner-polygon {
      stroke-width: 2;
      animation: moving-poly-anim ${animationDuration}s linear infinite;
    }

    @keyframes moving-poly-anim {
      0% {
        transform: translate(${pointOffsets[0][0]}%, ${pointOffsets[0][1]}%)
      }

      ${pointOffsets
        .slice(1)
        .map(
          (point, index) => `
      ${(100 * (index + 1)) / pointOffsets.length}% {
        transform: translate(${point[0]}%, ${point[1]}%)
      }
      `,
        )
        .join('\n')}

      100% {
        transform: translate(${pointOffsets[0][0]}%, ${pointOffsets[0][1]}%)
      }
    }
  `);

  const mainGroup = svg;

  const g = mainGroup.g({
    clipPath: 'url(#mask)',
  });
  range(NUM_INNER_SHAPES).forEach(index => {
    g.polygon({
      className: 'inner-polygon',
      points: pointsString,
      style: {
        animationDelay: `-${(index * animationDuration) / NUM_INNER_SHAPES}s`,
      },
    });
  });

  mainGroup.polygon({
    className: 'outer-polygon',
    points: pointsString,
  });

  return svg;
};

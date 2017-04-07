/* tslint:disable:quotemark */

import {assert} from 'chai';

import {BinNode} from '../../../src/compile/data/bin';
import {Model} from '../../../src/compile/model';
import {parseUnitModel} from '../../util';

function assemble(model: Model) {
  return new BinNode(model).assemble();
}

describe('compile/data/bin', function() {
  describe('parseUnit', function() {
    describe('binned field with custom extent', () => {
      it('should add bin transform and correctly apply bin', function() {
        const model = parseUnitModel({
          mark: "point",
          encoding: {
            y: {
              bin: {extent: [0, 100]},
              'field': 'Acceleration',
              'type': "quantitative"
            }
          }
        });

        assert.deepEqual(assemble(model)[0], {
          type: 'bin',
          field: 'Acceleration',
          as: ['bin_Acceleration_start', 'bin_Acceleration_end'],
          maxbins: 10,
          extent: [0, 100],
          signal: "Acceleration_bins",
        });
      });
    });

    describe('binned field without custom extent', () => {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          y: {
            bin: true,
            'field': 'Acceleration',
            'type': "quantitative"
          }
        }
      });

      const transform = assemble(model);

      it('should add bin transform and correctly apply bin', function() {
        assert.deepEqual(transform[0], {
          type: 'extent',
          field: 'Acceleration',
          signal: 'Acceleration_extent'
        });
        assert.deepEqual(transform[1], {
          type: 'bin',
          field: 'Acceleration',
          as: ['bin_Acceleration_start', 'bin_Acceleration_end'],
          maxbins: 10,
          signal: "Acceleration_bins",
          extent: {signal: 'Acceleration_extent'}
        });
      });
    });
  });
});

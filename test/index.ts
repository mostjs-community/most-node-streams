import * as assert from 'assert';
import { from } from 'most';
import { stdio } from 'stdio-mock';
import { fromReadable, fromWritable, toWritable } from '../src';
import { join } from 'path';
import { createReadStream, createWriteStream } from 'fs';

describe('Most Node Streams', () => {
  describe('fromWritable', () => {
    it('captures events from writable stream', () => {
      const writeStream = createWriteStream(join(__dirname, 'test.txt'));
      const stream = fromWritable(writeStream).map(x => x.toString());

      const expected = ['1', '2', '3'];

      stream.observe(function (x: any) {
        assert.strictEqual(x, expected.join('\n'));
      });

      writeStream.write('1\n');
      writeStream.write('2\n');
      writeStream.write('3');
    });
  });

  describe('fromReadable', () => {
    it('captures events from readable stream', () => {
      const readStream = createReadStream(join(__dirname, 'test.txt'));

      const stream = fromReadable(readStream, 'data').map(data => data.toString());

      const expected = ['1', '2', '3'];

      return stream.observe(function (x: any) {
        assert.strictEqual(x, expected.join('\n'));
      });
    });
  });

  describe('toWritable', () => {
    it('pushes events to a writable stream', (done) => {
      const stdout = stdio().stdout;
      const expected = ['1', '2', '3'];
      const stream = from<string>(expected);

      toWritable(stdout, stream);

      stdout.addListener('end', () => {
        assert.deepEqual(stdout.data(), expected);
        done();
      });
    });
  });
});
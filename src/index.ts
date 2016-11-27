import { Stream, Subscription } from 'most';
import { FromStream } from './FromStream';
import { NodeStream } from './types';

export interface FromStreamOptions {
  endEventName?: string;
  dataEventName?: string;
}

export function fromStream(
  nodeStream: NodeStream,
  options: FromStreamOptions = {})
{
  const { endEventName = 'end', dataEventName = 'data' } = options;

  if (typeof (nodeStream as NodeJS.ReadableStream).pause === 'function')
    (nodeStream as NodeJS.ReadableStream).pause();

  return new Stream<any>(new FromStream<any>(nodeStream, endEventName, dataEventName));
}

export function fromReadable(
  nodeStream: NodeJS.ReadableStream,
  dataEventName = 'data',
): Stream<Buffer> {
  return fromStream(nodeStream, { dataEventName, endEventName: 'end' });
}

export function fromWritable(nodeStream: NodeJS.WritableStream) {
  return fromStream(nodeStream, { endEventName: 'finish' });
}

export function toWritable(
  nodeStream: NodeJS.WritableStream,
  stream: Stream<string | Buffer>): Subscription<any>
{
  return stream.subscribe({
    next (x: string | Buffer) {
      nodeStream.write(x);
    },
    error (e: Error) {
      nodeStream.emit('error', e);
    },
    complete() {
      // process.stdout && process.stderr are not closable
      if (!(nodeStream as any).isStdio) {
        nodeStream.end();
      }
    },
  });
}
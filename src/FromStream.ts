import { never, Disposable, Sink, Scheduler } from 'most';
import { MulticastSource } from '@most/multicast';
import { FromStreamDisposable } from './FromStreamDisposable';
import { addListeners } from './addListeners';
import { NodeStream } from './types';

export class FromStream<T> extends MulticastSource<T> {
  private stream: NodeStream;
  private endEventName: string;
  private dataEventName: string;

  // From MulticastSource
  private _disposable: Disposable<T>;

  constructor(stream: NodeStream, endEventName: string, dataEventName: string) {
    super(never().source);

    this.stream = stream;
    this.endEventName = endEventName;
    this.dataEventName = dataEventName;
  }

  public run(sink: Sink<T>, scheduler: Scheduler) {
    const n = this.add(sink);

    if (n === 1) {
      const stream = this.stream;

      this._disposable =
        addListeners(stream, this.endEventName, this.dataEventName, sink, scheduler);

      if (typeof (stream as NodeJS.ReadableStream).resume === 'function') {
        (stream as NodeJS.ReadableStream).resume();
      }
    }

    return new FromStreamDisposable(this, sink);
  }
}
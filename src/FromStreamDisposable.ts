import { Sink, Disposable } from 'most';
import { FromStream } from './FromStream';

export class FromStreamDisposable implements Disposable<any> {
  private source: FromStream<any>;
  private sink: Sink<any>;
  private disposed: boolean;

  constructor(source: FromStream<any>, sink: Sink<any>) {
    this.source = source;
    this.sink = sink;
    this.disposed = false;
  }

  public dispose() {
    if (this.disposed) return;
    this.disposed = true;
    const remaining = this.source.remove(this.sink);

    return remaining === 0 && (this.source as any)._dispose();
  }
}
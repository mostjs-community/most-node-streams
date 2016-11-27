import { Sink, Scheduler, Disposable, PropagateTask } from 'most';
import { NodeStream } from './types';

export function addListeners(
  stream: NodeStream,
  endEventName: string,
  dataEventName: string,
  sink: Sink<any>,
  scheduler: Scheduler): Disposable<any>
{
  const event = (value: any) => scheduler.asap(PropagateTask.event(value, sink));
  const error = (err: Error) => scheduler.asap(PropagateTask.error(err, sink));
  const end = (value: any) => scheduler.asap(PropagateTask.end(value, sink));

  stream.addListener(dataEventName, event);
  stream.addListener(endEventName, end);
  stream.addListener('error', error);

  return {
    dispose() {
      stream.removeListener(dataEventName, event);
      stream.removeListener(endEventName, end);
      stream.removeListener('error', error);
    },
  };
}
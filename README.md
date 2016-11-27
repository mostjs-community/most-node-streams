# most-node-streams

> Convert Node.js Streams to Most.js Streams

Allows you to translate basic Node.js Streams into Most.js Streams.

WARNING:
This does not attempt to cover the use case where you need backpressure or flow control.
If you need backpressure or flow control then please continue to use Node.js Streams.

## Let me have it!
```sh
npm install --save most-node-streams
```

## API

#### `fromReadable(stream: NodeJS.ReadableStream, dataEventName?: string): Stream<Buffer>`

Creates a Most.js Stream from a Node.js Readable Stream. Optionally takes an event name
to recieve events defaulting to `data` if none is provided.

#### `fromWritable(stream: NodeJS.WritableStream): Stream<Buffer>`

Creates a Most.js Stream that replicates the values being written to a WritableStream.

#### `toWritable (nodeStream: NodeJS.WritableStream, mostStream: Stream<Buffer | string>): Subscription`

Subscribes to a stream and replicates its values into a NodeJS WritableStream.

#### `fromStream(nodeStream: NodeStream, options?: FromStreamOptions): Stream<Buffer>`

This is the function that fromReadable and fromWritable are built from for when you need a little
more configuration.

## Types

#### `FromStreamOptions`

```typscript
export interface FromStreamOptions {
  endEventName?: string;
  dataEventName?: string;
}
```

#### `NodeStram`

```typescript
export type NodeStream =
  NodeJS.WritableStream | NodeJS.ReadableStream | NodeJS.ReadWriteStream;
```
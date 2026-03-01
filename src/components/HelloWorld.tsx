import { useState } from 'react';

/**
 * A boilerplate component provided by the CRXJS starter.
 * It demonstrates basic React state usage and HMR (Hot Module Replacement)
 * within the context of a browser extension.
 */
export default function HelloWorld(props: { msg: string }) {
  // Simple state hook to demonstrate interactivity
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>{props.msg}</h1>

      <div className="card">
        {/* Button that increments the counter on each click */}
        <button type="button" onClick={() => setCount(count + 1)}>
          count is {count}
        </button>
        <p>
          Edit
          <code>src/components/HelloWorld.tsx</code> to test HMR
        </p>
      </div>

      <p>
        Check out
        <a href="https://github.com/crxjs/create-crxjs" target="_blank" rel="noreferrer">
          create-crxjs
        </a>
        , the official starter
      </p>

      <p className="read-the-docs">Click on the Vite, React and CRXJS logos to learn more</p>
    </>
  );
}

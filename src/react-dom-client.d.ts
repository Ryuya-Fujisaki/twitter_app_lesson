declare module 'react-dom/client' {
  import * as React from 'react';

  type Root = {
    render(children: React.ReactNode): void;
    unmount(): void;
  };

  export function createRoot(container: Element | DocumentFragment): Root;
}
declare function print(this: void, text?: string | number): void

declare namespace os {
  function getenv(this: void, envVariable: string): string;
}

declare function print(this: void, text?: string | number): void

declare namespace os {
  interface DateTable {
    year: number;
    month: number;
    day: number;
    hour: number;
    min: number;
    sec: number;
    wkday: number;
    yday: number;
    isdst?: number;
  }

  function date(this: void, format: string, time?: number): string | DateTable;
  function getenv(this: void, envVariable: string): string;
}

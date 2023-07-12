export type Join<K, P> = K extends string | number ?
  P extends string | number ?
    `${K}${'' extends P ? '' : '.'}${P}`
    : never : never;

export type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]['1'];

export type Paths<T, D extends number = 10> = [D] extends [never] ? never : T extends object ?
  {
    [K in keyof T]-?: K extends string | number ?
    T[K] extends string[] ? `${K}` : `${K}` | Join<K, Paths<T[K], Prev>>
    : never
  }[keyof T] : '';

export type OptionalDeep<T> = {
  [P in keyof T]?: T[P] extends object ? OptionalDeep<T[P]> : T[P];
}
export type GetPath<T, P extends string> =
  P extends `${infer K}.${infer R}`
    ?
    K extends keyof T ? GetPath<T[K], R> : never
    :
    P extends keyof T ? T[P] : (P extends string ? T : never);

export type GetPathArrayItem<T, P extends string> =
  P extends `${infer K}.${infer R}`
    ?
    K extends keyof T ? GetPathArrayItem<T[K], R> : never
    :
    P extends keyof (T extends (infer AI)[] ? AI : T) ? (T extends (infer AI)[] ? AI : T)[P] : (P extends string ? T : never);

export type FlatKeyObject<T, V = unknown> = {
  [P in keyof T as T[P] extends object
    ?
    // @ts-ignore
    `${P}.${keyof FlatKeyObject<T[P]>}` | `${P}`
    :
    // @ts-ignore
    `${P}`]: V;
}

export type RootFlatKeyObject<T, V = unknown> = {
  // @ts-ignore
  [P in keyof FlatKeyObject<T,V> as `$.${P}`]: FlatKeyObject<T,V>[P];
}
export type RootFlatKey<T> = keyof RootFlatKeyObject<T>

export type FlatKeyObjectOption<T, V> = FlatKeyObject<OptionalDeep<T>, V>;

export type FlatKey<T> = keyof FlatKeyObject<T>

export type FlatKeyExcludeArrayDeep<T> = {
  [P in keyof T as // @ts-ignore
    T[P] extends unknown[] ? `${P}` : T[P] extends object
      ?
      // @ts-ignore
      `${P}.${keyof FlatKeyExcludeArrayDeep<T[P]>}` | `${P}`
      :
      // @ts-ignore
      `${P}`]: unknown;
}


type RelationshipOperator = 'LEFT JOIN' | 'RIGHT JOIN' | 'FULL OUTER JOIN' | 'LEFT OUTER JOIN' | 'RIGHT OUTER JOIN';
type LogicalOperator = 'AND' | 'OR';
type ComparisonOperator = '=' | '!=' | '>' | '<' | '>=' | '<=' | 'IN' | 'NOT IN' | 'LIKE' | 'NOT LIKE' | 'IS' | 'IS NOT' | 'BETWEEN' | 'NOT BETWEEN';
type Direction = 'ASC' | 'DESC';
type ManualValue<T> = string | number | boolean | null | RootFlatKey<T>;
type RelationShipWhere<T> = {
  operandFirst: ManualValue<T>;
  operator: ComparisonOperator;
  operandSecond: ManualValue<T>;
  joinOperator?: LogicalOperator;
};

type Where<T> = {
  operandFirst: ManualValue<T> //| Meta<T, ROOT>;
  operator: LogicalOperator | ComparisonOperator | RelationshipOperator;
  operandSecond: ManualValue<T>; //| Meta<T, ROOT>;
  joinOperator?: LogicalOperator;
};
type MetaBody<T, ROOT = T> = {
  // $alias?: string;
  $target?: ManualValue<ROOT>;
  $order?: { path: ManualValue<ROOT>, direction: Direction }[];
  $relationship?: {
    operator?: RelationshipOperator,
    where?: (RelationShipWhere<ROOT> | RelationShipWhere<T>[])[]
  };

  $where?: (Where<ROOT> | Where<ROOT>[])[]
}
// export type Meta<T, ROOT = T> = MetaBody<T, ROOT> &
// {
//   // @ts-ignore
//   [P in FlatKey<T>]?: GetPath<T, P> extends object ? Meta<GetPath<T, P>, ROOT> : MetaBody<GetPath<T, P>, ROOT>;
// }
export type Meta<T, ROOT = T> = MetaBody<T, ROOT> & {
  [P in keyof T as T[P] extends object ? P : never]?: Meta<T[P], ROOT>;
} & {
  [P in keyof T as T[P] extends object ? never : P]?: MetaBody<T[P], ROOT>;
}


// } & {
//   [P in keyof T as T[P] extends object ? P : never]?:
//   T[P] extends (infer AI)[] ?
//     AI extends object ?
//       FetchRequest<AI, C>
//       : RequestFetchBody<T, RequestTypeType extends keyof T[P] ? T[P][RequestTypeType] : C, R>
//     : FetchRequest<T[P], C>;
// }
//






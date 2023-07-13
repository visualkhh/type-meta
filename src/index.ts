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
  [P in keyof FlatKeyObject<T, V> as `$.${P}`]: FlatKeyObject<T, V>[P];
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

export type SQLType = 'SELECT' | 'DELETE' | 'UPDATE';
export type RefMeta<T> = { meta: Meta<T>, alias?: string };
type ManualValue<T> = string | number | boolean; // | RootFlatKey<T>;
export type Target<T, ROOT = T> = Meta<T, ROOT> | string;

type RelationshipOperator = 'JOIN' | 'CROSS JOIN' | 'LEFT JOIN' | 'RIGHT JOIN' | 'FULL OUTER JOIN' | 'LEFT OUTER JOIN' | 'RIGHT OUTER JOIN';
type LogicalOperator = 'AND' | 'OR';
// type TargetJoinOperator = 'ON';
type ComparisonOperator = '=' | '!=' | '>' | '<' | '>=' | '<=' | 'IN' | 'NOT IN' | 'LIKE' | 'NOT LIKE' | 'IS' | 'IS NOT' | 'BETWEEN' | 'NOT BETWEEN';
type Direction = 'ASC' | 'DESC';
type RelationShipWhere<T> = {
  operandFirst: ManualValue<T> | Meta<T> | RefMeta<T>;
  operator: ComparisonOperator;
  operandSecond: ManualValue<T> | Meta<T> | RefMeta<T>;
  joinOperator?: LogicalOperator;
};

type Where<T> = {
  operandFirst: ManualValue<T> | Meta<T> | RefMeta<T>;
  operator: LogicalOperator | ComparisonOperator | RelationshipOperator;
  operandSecond: ManualValue<T> | Meta<T> | RefMeta<T>;
  joinOperator?: LogicalOperator;
};


type Column<T> = ManualValue<T> | RefMeta<T>;
type MetaBody<T, ROOT = T> = {
  $target?: Target<T, ROOT>;
  $order?: { path: ManualValue<ROOT>, direction: Direction }[];
  $relationship?: {
    operator?: RelationshipOperator | string,
    where?: (RelationShipWhere<ROOT> | RelationShipWhere<T>[])[]
  };

  // $columns?: Column<ROOT>[];

  $where?: (Where<ROOT> | Where<ROOT>[])[]
}

export type Meta<T, ROOT = T> = MetaBody<T, ROOT> & {
  [P in keyof T as T[P] extends object ? P : never]?: Meta<T[P], ROOT>;
} & {
  [P in keyof T as T[P] extends object ? never : P]?: MetaBody<T[P], ROOT>;
}

const isMeta = (target: any): target is Meta<any> => {
  return typeof target === 'object' && ('$target' in target || '$relationship' in target || '$where' in target || '$order' in target); //  '$columns' in target ||
}
const isRefMeta = (target: any): target is RefMeta<any> => {
  return typeof target === 'object' && 'meta' in target; //  && ('alias' in target);
}

// const skipKey = ['$alias', '$order', '$where', '$value'];
const from = <F = any>(meta: Meta<F>, keys: string[] = [], trunks: { columns: string[], from: string, alias: string, wheres: string[] }[] = []) => {
  // @ts-ignore
  const $target = (isMeta(meta['$target']) ? (`(${sql('SELECT', meta['$target'] as Meta<F>)})`) : meta['$target']) as string | undefined;
  // $target = $target?.replace('$', '_root_').replace('.', '_dot_');
  // @ts-ignore
  const $where = meta['$where'];
  // const $columns = meta['$columns'] as Column<F>[];
  // const columns = ($columns?.map(it => {
  //   if (isRefMeta(it)) {
  //     return `(${sql('SELECT', it.meta)}) AS ${it?.alias}`
  //   } else {
  //     return it;
  //   }
  // }) ?? []) as string[];
  // const alias = keys.join('_dot_').replace('$', '_root_');
  const alias = keys.join('.');

  if ($target) {
    // let target = `${$target} ${alias ? `AS \`${(alias)}\`` : ''}`;
    // let target = `${$target} ${alias ? `AS ${(alias)}` : ''}`;
    let target = `${$target}`;
    // @ts-ignore
    let relationship = meta['$relationship'];
    if (relationship) {
      target = `${relationship.operator ?? ','} ${target}`;
      const on = relationship.where?.map(it => {
        if (Array.isArray(it)) {
          const flat = it.map(it => {
            const operandFirstAlias = isRefMeta(it.operandFirst) ? it.operandFirst.alias : '';
            const operandFirstStr = isRefMeta(it.operandFirst) ? `(${sql('SELECT', it.operandFirst.meta)})` : (isMeta(it.operandFirst) ? (`(${sql('SELECT', it.operandFirst)})`) : it.operandFirst) as string;
            const operandSecondAlias = isRefMeta(it.operandSecond) ? it.operandSecond.alias : '';
            const operandSecondStr = isRefMeta(it.operandSecond) ? `(${sql('SELECT', it.operandSecond.meta)})` : (isMeta(it.operandSecond) ? (`(${sql('SELECT', it.operandSecond)})`) : it.operandSecond) as string;
            const operandFirst = (`${operandFirstStr} ${operandFirstAlias}`) as string;
            const operandSecond = (`${operandSecondStr} ${operandSecondAlias}`) as string;
            return `${operandFirst} ${it.operator} ${operandSecond} ${it.joinOperator ?? ''}`
          });
          return `(${flat.join(' ')})`;
        } else {
          const operandFirstAlias = isRefMeta(it.operandFirst) ? it.operandFirst.alias : '';
          const operandFirstStr = isRefMeta(it.operandFirst) ? `(${sql('SELECT', it.operandFirst.meta)} AS ${operandFirstAlias})` : (isMeta(it.operandFirst) ? (`(${sql('SELECT', it.operandFirst)})`) : it.operandFirst) as string;
          const operandSecondAlias = isRefMeta(it.operandSecond) ? it.operandSecond.alias : '';
          const operandSecondStr = isRefMeta(it.operandSecond) ? `(${sql('SELECT', it.operandSecond.meta)} AS ${operandSecondAlias})` : (isMeta(it.operandSecond) ? (`(${sql('SELECT', it.operandSecond)})`) : it.operandSecond) as string;
          const operandFirst = (`${operandFirstStr}`) as string;
          const operandSecond = (`${operandSecondStr}`) as string;
          return `${operandFirst} ${it.operator} ${operandSecond} ${it.joinOperator ?? ''}`;
        }
      })
      if (on) {
        target += ` ON ${on.join(' ')}`;
      }
    }
    trunks.push({columns: [], from: target, alias: alias, wheres: []});
    // trunks.push({columns: [...columns], from: target, alias: alias, wheres: []});
  }


  if ($where) {
    const wheres = $where.map(it => {
      if (Array.isArray(it)) {
        const flat = it.map(it => `${it.operandFirst as string} ${it.operator} ${it.operandSecond as string} ${it.joinOperator ?? ''}`);
        return `(${flat.join(' ')})`;
      } else {
        return `${it.operandFirst as string} ${it.operator} ${it.operandSecond as string} ${it.joinOperator ?? ''}`;
      }
    });
    trunks.find(it => it.alias === alias)?.wheres.push(...wheres);
  }


  for (const [key, value] of Array.from(Object.entries(meta))) {
    // @ts-ignore
    if (!key.startsWith('$') && $target && typeof value['$target'] === 'string' && value['$relationship'] === undefined) {
      // @ts-ignore
      const ttt = value['$target'];
      trunks.find(it => it.alias === alias)?.columns.push(ttt);
    } else if (!key.startsWith('$')) {
      const newKeys = [...keys, key];
      from(value as Meta<any>, newKeys, trunks);
    }
  }
  return trunks;
}
//..
export const sql = <T = any>(type: SQLType, meta: Meta<T>) => {
  const fromData = from(meta, ['$']);
  const presentations = fromData.map(it => it.columns);
  const wheres = fromData.map(it => it.wheres);
  let whereFlat = wheres.flat();
  let presentFlat = presentations.flat();
  return `${type} ${presentFlat.length ? presentFlat.join(',') : '*'} from ${fromData.map(it => it.from).join(' ')} ${whereFlat.length ? `where ${whereFlat.join(' ')}` : ''}`.trim();
}

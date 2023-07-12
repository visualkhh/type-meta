import { Meta, SQLType, Target } from 'objectmeta';

type Friend = {
  name: string;
  age: number;
}

type User = {
  name: string;
  age: number;
  address: {
    details: {
      first: string;
      last?: string;
      subDetails: {
        first: string;
        last?: string;
      },
    },
    summary: string;
  }
  friends: Friend[]
}


type Office = {
  name: string;
  age: number;
}

const OfficeMeta: Meta<Office> = {
  $target: 'OFFICE',
}
console.log('--dd-');

const UserMeta: Meta<User> = {
  // $alias: 'userAlias',
  // $target: 'USER',
  $target: OfficeMeta,
  $order: [
    {direction: 'ASC', path: 'age'}
  ],
  address: {
    $relationship: {
      operator: 'LEFT OUTER JOIN',
      where: [{
        operandFirst: 'age',
        operator: '=',
        operandSecond: '$.address.details',
        joinOperator: 'AND'
      }, {
        operandFirst: 'ageaaaaaaa',
        operator: '=',
        operandSecond: '$.address.detailsaaa',
        joinOperator: 'OR'
      },
        [
          {
            operandFirst: 'ageaaaaaaa',
            operator: '=',
            operandSecond: '$.address.detailsaaa',
            joinOperator: 'AND'
          },
          {
            operandFirst: 'ageaaaaaabbbbbba',
            operator: '=',
            operandSecond: '$.address.detabbbbilsaaa'
          }
        ]

      ]
    },
    $target: 'ADDRESS',
    details: {
      $target: '$.address.details'
    },
    summary: {
      $target: '$.address.summary'
    },
    $where: [{
      operandFirst: '$.address.details',
      operator: '=',
      operandSecond: '$.address.summary',
      joinOperator: 'AND'
    }, [{
      operandFirst: '$.address.details222222',
      operator: '=',
      operandSecond: '$.address.summary22222'
    }]]
  },

  age: {
    $target: '$.age'
  },
  name: {
    $target: '$.name'
  }
  // age: {}
}

const surroundBacktip = (target: string, alias: string) => {
  const a = alias.replace('$', '\\`$\\`')
  const t = target.replace('$', '\\`$\\`')
  const tt = t.replace(a, `\`${a}\``);
  const ttt = tt.replace(/\\`/g, '');
  return ttt;
}

const isMeta = (target: any): target is Meta<any> => {
  return typeof target === 'object' && ('$target' in target || '$relationship' in target || '$where' in target);
}

// const skipKey = ['$alias', '$order', '$where', '$value'];
const from = <F = any>(meta: Meta<F>, keys: string[] = [], trunks: { columns: string[], from: string, alias: string, wheres: string[] }[] = []) => {
  const $target = (isMeta(meta['$target']) ? (`(${sqlBuilder('SELECT', meta['$target'] as Meta<F>)})`) : meta['$target']) as string | undefined;
  const $where = meta['$where'];
  const alias = keys.join('.');

  if ($target) {
    let target = `${$target} ${alias ? `AS \`${(alias)}\`` : ''}`;
    let relationship = meta['$relationship'];
    if (relationship) {
      target = `${relationship.operator ?? ','} ${target}`;
      const on = relationship.where?.map(it => {
        if (Array.isArray(it)) {
          const flat = it.map(it => `${surroundBacktip(it.operandFirst as string, alias)} ${it.operator} ${surroundBacktip(it.operandSecond as string, alias)} ${it.joinOperator ?? ''}`);
          return `(${flat.join(' ')})`;
        } else {
          return `${surroundBacktip(it.operandFirst as string, alias)} ${it.operator} ${surroundBacktip(it.operandSecond as string, alias)} ${it.joinOperator ?? ''}`;
        }
      })
      if (on) {
        target += ` ON ${on.join(' ')}`;
      }
    }
    trunks.push({columns: [], from: target, alias: alias, wheres: []});
  }


  if ($where) {
    const wheres = $where.map(it => {
      if (Array.isArray(it)) {
        const flat = it.map(it => `${surroundBacktip(it.operandFirst as string, alias)} ${it.operator} ${surroundBacktip(it.operandSecond as string, alias)} ${it.joinOperator ?? ''}`);
        return `(${flat.join(' ')})`;
      } else {
        return `${surroundBacktip(it.operandFirst as string, alias)} ${it.operator} ${surroundBacktip(it.operandSecond as string, alias)} ${it.joinOperator ?? ''}`;
      }
    });
    trunks.find(it => it.alias === alias)?.wheres.push(...wheres);
  }


  for (const [key, value] of Array.from(Object.entries(meta))) {
    // console.log('------k', alias, key, value);
    if (!key.startsWith('$') && $target && typeof value['$target'] === 'string' && value['$relationship'] === undefined) {
      const ttt = surroundBacktip(value['$target'], alias);
      trunks.find(it => it.alias === alias)?.columns.push(ttt);
    } else if (!key.startsWith('$')) {
      const newKeys = [...keys, key];
      from(value as Meta<any>, newKeys, trunks);
    }
  }
  return trunks;
}
const sqlBuilder = <T = any>(type: SQLType, meta: Meta<T>) => {
  const fromData = from(meta, ['$']);
  console.log(fromData);
  const presentations = fromData.map(it => it.columns);
  const wheres = fromData.map(it => it.wheres);
  console.log('--------', presentations, wheres)
  let whereFlat = wheres.flat();
  let presentFlat = presentations.flat();
  return `${type} ${presentFlat.length ? presentFlat.join(',') : '*' } from ${fromData.map(it => it.from).join(' ')} ${whereFlat.length ? `where ${whereFlat.join(' ')}` : ''}`;
}


const data = sqlBuilder('SELECT', UserMeta);
console.log('-->', data);
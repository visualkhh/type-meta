import { Meta, sql, SQLType, Target } from 'objectmeta';

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
  },
  office: Office,
  friends: Friend[]
}


type Office = {
  name: string;
  address: string;
}

const OfficeMeta: Meta<Office> = {
  $target: 'OFFICE',
}
const OfficeSubMeta: Meta<Office> = {
  $target: 'OFFICE',
  name: {
    $target: '$.name'
  }
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
        operandFirst: '$.address.summary',
        operator: '=',
        operandSecond: '$.age',
        joinOperator: 'AND'
      }, {
        operandFirst: 'ageaaaaaaa',
        operator: '=',
        operandSecond: OfficeSubMeta,
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

  office: {
    $relationship: {
      operator: 'LEFT OUTER JOIN',
    },
    $target: 'OFFICEAAA',
  },

  age: {
    $target: '$.age'
  },
  name: {
    $target: '$.name'
  }
  // age: {}
}




const data = sql('SELECT', UserMeta);
console.log('-->', data);
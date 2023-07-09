# objectmeta

### Concept
```sql
SELECT 컬럼명 FROM 테이블명;
SELECT 컬럼명 FROM 테이블명 WHERE 컬럼명=값;
SELECT 컬럼명 FROM 테이블명 WHERE 컬럼명=값 ORDER BY 컬럼명 ASC or DESC;
SELECT 컬럼명 FROM 테이블명 WHERE 컬럼명=값 ORDER BY 컬럼명 ASC or DESC LIMIT 개수;

INSERT INTO 테이블명 (컬럼명1, 컬럼명2, 컬럼명3) VALUES (값1, 값2, 값3);
INSERT INTO table_Student (Name, Class, Age) VALUES ('Jane','A',16);
INSERT INTO 테이블명 VALUES (값1, 값2, 값3);
INSERT INTO table_Student value ('Jane','A',16); -> 성공
INSERT INTO table_Student value ('Jane','A'); -> 실패

UPDATE 테이블명 SET 컬럼명 = 변경할 값;
UPDATE 테이블명 SET 컬럼명 = 변경할 값 WHERE 컬럼명=값;
UPDATE 테이블명 SET 컬럼명1 = 변경할 값1,컬럼명2 = 변경할 값2 WHERE 컬럼명=값;

DELETE from 테이블명;
DELETE from 테이블명 WHERE 컬럼명=값;
```

```typescript

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


```


```typescript


const UserMeta: Meta<User> = {
  $target: 'USER',
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
}
```
```sql
SELECT `$`.age, `$`.name, `$.address`.details, `$.address`.summary
from USER AS `$`
         LEFT OUTER JOIN ADDRESS AS `$.address` ON age = `$.address`.details AND ageaaaaaaa = `$.address`.detailsaaa OR
                                                   (ageaaaaaaa = `$.address`.detailsaaa AND
                                                    ageaaaaaabbbbbba = `$.address`.detabbbbilsaaa)
where `$.address`.details = `$.address`.summary
  AND (`$.address`.details222222 = `$.address`.summary22222)

```
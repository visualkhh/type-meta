# type-meta

It has the meta information of the object type and runs several combination business logic based on the data.

## sql builder example

```typescript
import { Meta, sql, SQLType, Target } from 'objectmeta';

type TEACHER_FEEDBACK = {
  // ...
}
type ACCOUNT = {
  sid: string,
  // ...
}
type TEACHER = {
  // ...
}
type VISIT_INSTANCE = {
  // ...
}

type Query = TEACHER_FEEDBACK & {
  account: ACCOUNT;
  teacher: TEACHER;
  visit_instance: VISIT_INSTANCE;

}
const query: Meta<Query> = {
  $target: 'teacher_feedback as teacher_feedback',
  sid: {
    $target: 'teacher_feedback.sid',
  },
  account: {
    $target: 'account as account',
    $relationship: {
      operator: 'JOIN',
      where: [
        {
          operandFirst: 'teacher_feedback.parent_account_sid',
          operator: '=',
          operandSecond: 'account.sid',
        }
      ]
    }
  },
  teacher: {
    $target: 'teacher as teacher',
    $relationship: {
      operator: 'JOIN',
      where: [
        {
          operandFirst: 'teacher_feedback.teacher_account_sid',
          operator: '=',
          operandSecond: 'teacher.account_sid',
        }
      ]
    }
  },
  visit_instance: {
    $target: 'visit_instance',
    $relationship: {
      operator: 'JOIN',
      where: [
        {
          operandFirst: 'teacher_feedback.visit_instance_sid',
          operator: '=',
          operandSecond: 'visit_instance.sid',
        }
      ]
    }
  },
  $where: [
    {
      operandFirst: 'teacher_feedback.created_at',
      operator: '>',
      operandSecond: 'DATE_SUB(NOW(), INTERVAL 1 MONTH)',
    }
  ]
}

const data = sql('SELECT', query);
console.log('sql', data);
```

```sql
 SELECT teacher_feedback.sid
 from teacher_feedback as teacher_feedback
          JOIN account as account ON teacher_feedback.parent_account_sid = account.sid
          JOIN teacher as teacher ON teacher_feedback.teacher_account_sid = teacher.account_sid
          JOIN visit_instance ON teacher_feedback.visit_instance_sid = visit_instance.sid
 where teacher_feedback.created_at > DATE_SUB(NOW(), INTERVAL 1 MONTH)

```
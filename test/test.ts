import { Meta, sql, SQLType, Target } from 'objectmeta';

type TEACHER_FEEDBACK = {
  sid: string,
  parent_account_sid: string,
  teacher_account_sid: string,
  visit_instance_sid: string,
  recommend: number,
  passion: number,
  promise: number,
  comment: string,
  status: number,
  created_at: string,
  completed_at: string,
  visit_instance_number: number,
  reject_count: number
}
type ACCOUNT = {
  sid: string,
  email: string,
  password: string,
  name: string,
  mobile: string,
  address: string,
  geocode: string,
  service_area_code: string,
  date_of_birth: string,
  gender: number,
  profile_picture_filename: string,
  facebook: string,
  kakao: string,
  bank_account: string,
  resident_registration_number: string,
  payment_subscribe_sid: string,
  payment_password: string,
  credit_card: string,
  mobile_certified: number,
  allow_shooting: number,
  language: string,
  authority: number,
  role: number,
  status: number,
  type: number,
  observation_level: number,
  created_at: string,
  updated_at: string,
  last_signed_in: string,
  sign_in_count: number,
  page_row_num: number,
  cryptography: string,
  email_sent: number,
  friendtalk_sent: number,
  admin_memo: string,
  token: string,
  uuid: string,
  autopay_agreed: number,
  autopay_agreed_at: string,
  payment_method: number,
  term_version_name: string,
  marketing_term_version_name: string,
  pg_type: number,
  use_pay_jaranda_point: number,
  use_pay_jaranda_money: number,
  hanwha_member_id: string,
  last_signed_in_type: string,
}
type TEACHER = {
  characteristics: string,
  specialties: string,
  child_age_groups: string,
  childcare_experience: number,
  childcare_types: string
  regularity: number,
  experience_hour: number,
  experience_hour_for_play: number,
  experience_hour_for_study: number,
  previous_experience: number,
  previous_experience_for_play: number,
  previous_experience_for_study: number,
  additional_point: number,
  penalty: number,
  expertise_score: number,
  expertise_level: number,
  expertise_level_for_play: number,
  expertise_level_for_study: number,
  expertise_level_for_english: number,
  wage_level_for_play: number,
  wage_level_for_study: number,
  suggested: number,
  accepted: number,
  rejected: number,
  noshowed: number,
  lateness: number,
  cancellation_rate: number,
  response_ratio: number,
  wage_for_play: number,
  charge_for_play: number,
  wage_for_study: number,
  charge_for_study: number,
  name: string,
  onboarding_type: string,
  admin_memo: string,
  mobile: string,
  address: string,
  area_gu: string,
  area_dong: string,
  email: string,
  university: string,
  year: string,
  major: string,
  minor: string,
  gender: number,
  service_area_1: string,
  service_area_2: string,
  service_area_3: string,
  service_area_4: string,
  service_area_5: string,
  subway_line_1: string,
  subway_station_1: string,
  subway_line_2: string,
  subway_station_2: string,
  monday: string,
  tuesday: string,
  wednesday: string,
  thursday: string,
  friday: string,
  saturday: string,
  sunday: string,
  current_regular_visit: string,
  self_introduction: string,
  jaranda_introduction: string,
  specialty_detail: string,
  short_introduction: string,
  account_sid: string,
  signed: number,
  profile_picture_filename: string,
  thumbnail_profile_url: string,
  profile_url: string,
  visit_instance_picture_filenames: string,
  activity_status: number,
}
type VISIT_INSTANCE = {
  sid: string,
  visit_sid: string,
  order_number: string,
  story_id: number,
  instance_condition_sid: string,
  admin_account_sid: string,
  admin_name: string,
  parent_account_sid: string,
  parent_name: string,
  parent_mobile: string,
  parent_address: string,
  auxiliary_mobile: string,
  wage_version: string,
  regularity: number,
  regular_visit_term: number,
  biweekly: number,
  designated_date: string,
  designated_start_time: string,
  designated_end_time: string,
  designated_visit_schedule: string,
  original_designated_date: string,
  instance_condition: string,
  child_account_sid: string,
  child_name: string,
  children_account_sids: string,
  additional_children: string,
  additional_children_num: number,
  pay_additional_children: number,
  teacher_specialties: string,
  achievement_level: number,
  todos: string,
  pickup_description: string,
  protectors: string,
  extra_info_pet_status: number,
  extra_info_cctv_status: number,
  extra_info_activity_picture_preference: number,
  parent_request_to_teacher: string,
  precaution_to_find_home: string,
  teachers: string,
  matched_teacher_account_sid: string,
  matched_teacher_name: string,
  jaranda_comment: string,
  comment_to_teachers: string,
  visit_guide: string,
  admin_memo: string,
  teacher_informed_at: string,
  parent_informed_at: string,
  created_at: string,
  updated_at: string,
  completed_at: string,
  cancelled_at: string,
  cancelled_info: string,
  manually_modified: number,
  payment_status: number,
  parent_charge_changed: number,
  modifying_admin_account_sid: string,
  status: number,
  status_text: string,
  adjust_status: number,
  adjust_confirm_status: number,
  visit_change_request_id: number,
  cancellation_requested_at: string,
  on_the_way_at: string,
}
type CHILD = {
  account_sid: string,
  parent_account_sid: string,
  name: string,
  date_of_birth: string,
  gender: number,
  characteristics: string,
  characteristic_levels: string,
  disposition: string,
  favorite_plays: string,
  favorite_toys: string,
  taste: string,
  description: string,
  characteristic_description: string,
  favorite_activities: string,
  hashtags: string,
  updated_at: string,
  is_deleted: number,
}

const teacher_feedback: Meta<TEACHER_FEEDBACK> = {}
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

const account: Meta<ACCOUNT> = {}
const teacher: Meta<TEACHER> = {}
const visit_instance: Meta<VISIT_INSTANCE> = {}
const child: Meta<CHILD> = {}

const data = sql('SELECT', query);
console.log('sql', data);
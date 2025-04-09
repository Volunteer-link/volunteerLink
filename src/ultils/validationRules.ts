// Rule cho DatePicker (VD yêu cầu ngày phải lớn hơn hiện tại, >= 18 năm so với hôm nay)
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { Rule, FormInstance } from 'antd/es/form';
export const nameRules: Rule[] = [
  { required: true, message: 'Vui lòng nhập tên' },
  {
    pattern: /^[A-Za-z0-9\s\u00C0-\u1EF9]+$/,
    message: 'Tên không được chứa ký tự đặc biệt',
  },
];

export const passwordRules: Rule[] = [
  { required: true, message: 'Vui lòng nhập mật khẩu' },
  {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
    message:
      'Mật khẩu phải chứa ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt',
  },
];

export const emailRules: Rule[] = [
  {
    required: true,
    message: 'Vui lòng nhập email',
  },
  {
    type: 'email',
    message: 'Định dạng email không hợp lệ',
  },
];

// Rule xác nhận mật khẩu
// Cần truyền tham chiếu đến form để so sánh với field "password"
export const confirmPasswordRules = (form: FormInstance): Rule[] => [
  { required: true, message: 'Vui lòng xác nhận mật khẩu' },
  {
    validator(_: any, value: string) {
      const password = form.getFieldValue('password');
      if (!value || password === value) {
        return Promise.resolve();
      }
      return Promise.reject(
        new Error('Mật khẩu xác nhận không khớp với mật khẩu đã nhập')
      );
    },
  },
];

export const dateRules: Rule[] = [
  { required: true, message: 'Vui lòng chọn ngày' },
  {
    validator(_: any, value: Dayjs) {
      const today = dayjs();
      const maxDate = today.subtract(18, 'year');
      if (value?.isAfter(maxDate, 'day')) {
        return Promise.reject('Bạn phải trên 18 tuổi');
      }
      return Promise.resolve();
    },
  },
];

export const dateRulesEvent: Rule[] = [
 
];

export const timePublishedRulesEvent: Rule[] = [
  {
    required: true,
    message: 'Vui lòng chọn ngày!',
  },
  {
    validator: (_, value) => {
      if (!value) {
        return Promise.resolve();
      }
      const selectedDateStr = value.format
        ? value.format('YYYY-MM-DD HH:mm:ss')
        : value;
      const selectedDate = new Date(selectedDateStr);
      const currentDate = new Date();

      if (isNaN(selectedDate.getTime())) {
        return Promise.reject('Ngày không hợp lệ!');
      }

      if (selectedDate.getTime() <= currentDate.getTime()) {
        return Promise.reject('Ngày phải lớn hơn ngày hiện tại!');
      }

      return Promise.resolve();
    },
  },
];

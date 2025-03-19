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
  {
    required: true,
    message: 'Bạn cần chọn khoảng thời gian!',
  },
  {
    validator: async (_, value: [Dayjs, Dayjs]) => {
      if (!value || value.length < 2) {
        return Promise.reject('Hãy chọn cả ngày bắt đầu và ngày kết thúc!');
      }

      const [startDate, endDate] = value;
      const currentDate = dayjs();
      const minStartDate = currentDate.add(1, 'day'); // Thêm 1 ngày vào ngày hiện tại
      if (startDate.isBefore(minStartDate, 'day')) {
        return Promise.reject('Ngày bắt đầu phải lớn hơn ngày hiện tại ít nhất 1 ngày!');
      }
      if (endDate.isBefore(currentDate, 'day')) {
        return Promise.reject('Ngày kết thúc phải sau ngày hiện tại!');
      }

      if (endDate.isBefore(startDate)) {
        return Promise.reject('Ngày kết thúc phải sau ngày bắt đầu!');
      }

      return Promise.resolve();
    },
  },
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

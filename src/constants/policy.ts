import { type ValueOf } from '@/interfaces';
export const POLICY = [
  'Sử dụng sản phẩm đúng mục đích.',
  'Không sử dụng xe thuê vào mục đích phi pháp, trái pháp luật.',
  'Không sử dụng xe thuê để cầm cố, thế chấp.',
  'Không hút thuốc, nhả kẹo cao su, xả rác trong xe.',
  'Không chở hàng quốc cấm dễ cháy nổ.',
];

export type OrderType = ValueOf<typeof POLICY>;

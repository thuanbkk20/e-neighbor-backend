export type IpnResponse = {
  RspCode: string;
  Message: string;
};

export const IPN_SUCCESS: IpnResponse = {
  RspCode: '00',
  Message: 'Confirm Success',
};

export const IPN_ORDER_NOT_FOUND: IpnResponse = {
  RspCode: '01',
  Message: 'Order not found',
};

export const INP_ORDER_ALREADY_PAID: IpnResponse = {
  RspCode: '02',
  Message: 'Order already paid',
};

export const IPN_INVALID_AMOUNT: IpnResponse = {
  RspCode: '04',
  Message: 'Invalid amount',
};

export const IPN_FAIL_CHECKSUM: IpnResponse = {
  RspCode: '97',
  Message: 'Fail checksum',
};

export const IPN_UNKNOWN_ERROR: IpnResponse = {
  RspCode: '99',
  Message: 'Unknown error',
};

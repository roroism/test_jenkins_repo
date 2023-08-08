/** Response of `apiTransmissionLogs`. */
export type LogAPILogResponse = {
  categoryId: string;
  categoryName: string;
  cmd: string;
  contentId: string;
  contentName: string;
  createDate: Date;
  deviceId: string;
  deviceName: string;
  endDate: Date;
  id: string;
  isSuccess: 'true' | 'false';
  requestUser: string;
  startDate: Date;
  status: "ACTIVATED";
  type: "ASSET" | "PRESENTATION";
  _id: string;
}
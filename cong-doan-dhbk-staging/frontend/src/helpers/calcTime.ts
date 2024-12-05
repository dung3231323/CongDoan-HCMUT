export const CalculateTime = (updatedAt: string): string => {
  const updatedAtTime = Date.parse(updatedAt.toString());
  const currentDate = new Date();
  const currentTime = Date.parse(currentDate.toString());

  const diffMilliseconds: number = currentTime - updatedAtTime + 1000; //plus 1s vì bug -1h nếu tạo mới quá nhanh
  const diffHours: number = (diffMilliseconds / (1000 * 60 * 60)) % 60;

  //floor làm tròn xuống
  if (diffHours < 24) return `${Math.floor(diffHours)} giờ trước`;
  else if (diffHours >= 24 && diffHours < 30 * 24) return `${Math.floor(diffHours / 24)} ngày trước`;
  else if (diffHours >= 30 * 24 && diffHours < 365 * 24) return `${Math.floor(diffHours / (24 * 30))} tháng trước`;
  else return `${Math.floor(diffHours / (24 * 30 * 12))} năm trước`;
  return '';
};

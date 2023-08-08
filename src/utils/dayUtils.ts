import dayjs from 'dayjs';

const defaultFormatStr = 'YYYY-MM-DDTHH:mm:00.0000[Z]';

/**
 * Description
 * @author jaehee
 * @date 2023-08-02
 * @param {string} dayStr?:string
 * @param {string} formatStr:string=defaultFormatStr
 * @returns {string}
 */
export const formattingDate = (dayStr?: string, formatStr: string = defaultFormatStr): string => {
  if (!dayStr) return dayjs().format(formatStr);
  return dayjs(dayStr).format(formatStr);
};

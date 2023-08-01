import dayjs from 'dayjs';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Calcutta');

const defaultFormate = 'YYYY-MM-DD';
/**
 **CURRENT WEEK
 * @param {{type:('label' | 'date')}} dateType
 * @returns {{currentWeekStartDate:String, currentWeekEndDate:String}}
 */
const getCurrentWeekDates = ({ type = 'label' } = '') => {
  const formate = type === 'label' ? 'DD-MMM-YYYY' : defaultFormate;
  const currentWeekStartDate = dayjs().startOf('week').format(formate);
  const currentWeekEndDate = dayjs().endOf('week').format(formate);
  return { currentWeekStartDate, currentWeekEndDate };
};
/**
 **PREVIOUSE WEEK
 * @param {{type:('label' | 'date')}} dateType
 * @returns {{previouseWeekStartDate:String, previouseWeekEndDate:String}}
 */
const getPreviouseWeekDates = ({ type = 'label' } = '') => {
  const formate = type === 'label' ? 'DD-MMM-YYYY' : defaultFormate;
  const previouseWeekStartDate = dayjs()
    .startOf('week')
    .subtract(1, 'w')
    .format(formate);
  const previouseWeekEndDate = dayjs()
    .endOf('week')
    .subtract(1, 'w')
    .format(formate);
  return { previouseWeekStartDate, previouseWeekEndDate };
};
/**
 **CURRENT MONTH
 * @param {{type:('label' | 'date')}} dateType
 * @returns {{currentMonthStartDate:String, currentMonthEndDate:String}}
 */
const getCurrentMonthDates = ({ type = 'label' } = '') => {
  const formate = type === 'label' ? 'DD-MMM-YYYY' : defaultFormate;
  const currentMonthStartDate = dayjs().startOf('M').format(formate);
  const currentMonthEndDate = dayjs().endOf('M').format(formate);
  return { currentMonthStartDate, currentMonthEndDate };
};
/**
 **PREVIOUSE MONTH
 * @param {{type:('label' | 'date')}} dateType
 * @returns {{previousMonthStartDate:String, previousMonthEndDate:String}}
 */
const getPreviouseMonthDates = ({ type = 'label' } = '') => {
  const formate = type === 'label' ? 'DD-MMM-YYYY' : defaultFormate;
  const previousMonthStartDate = dayjs()
    .month(dayjs().month() - 1)
    .date(1)
    .hour(0)
    .minute(0)
    .second(0)
    .format(formate);
  const previousMonthEndDate = dayjs()
    .endOf('M')
    .subtract(1, 'M')
    .format(formate);
  return { previousMonthStartDate, previousMonthEndDate };
};
/**
 **CURRENT YEAR
 * @param {{type:('label' | 'date')}} dateType
 * @returns {{currentYearStartDate:String, currentYearEndDate:String}}
 */
const getCurrentYearDates = ({ type = 'label' } = '') => {
  const formate = type === 'label' ? 'DD-MMM-YYYY' : defaultFormate;
  const currentYearStartDate = dayjs().startOf('y').format(formate);
  const currentYearEndDate = dayjs().endOf('y').format(formate);
  return { currentYearStartDate, currentYearEndDate };
};
/**
 ** PREVIOUSE YEAR
 * @param {{type:('label' | 'date')}} dateType
 * @returns {{previousYearStartDate:String, previousYearEndDate:String}}
 */
const getPreviouseYearDates = ({ type = 'label' } = '') => {
  const formate = type === 'label' ? 'DD-MMM-YYYY' : defaultFormate;
  const previousYearStartDate = dayjs()
    .startOf('y')
    .subtract(1, 'y')
    .format(formate);
  const previousYearEndDate = dayjs()
    .endOf('y')
    .subtract(1, 'y')
    .format(formate);
  return { previousYearStartDate, previousYearEndDate };
};
export {
  getCurrentWeekDates,
  getCurrentMonthDates,
  getCurrentYearDates,
  getPreviouseWeekDates,
  getPreviouseMonthDates,
  getPreviouseYearDates,
};

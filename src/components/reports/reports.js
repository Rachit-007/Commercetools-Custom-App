import React, { useState } from 'react';
import Card from '@commercetools-uikit/card';
import Text from '@commercetools-uikit/text';
import SelectField from '@commercetools-uikit/select-field';
import Spacings from '@commercetools-uikit/spacings';
import {
  getCurrentMonthDates,
  getCurrentWeekDates,
  getCurrentYearDates,
  getPreviouseMonthDates,
  getPreviouseWeekDates,
  getPreviouseYearDates,
} from './dates';
import {
  changeDateFormat,
  useReports,
} from '../../hooks/use-reports-connector';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const Reports = () => {
  const [selectValue, setSelectValue] = useState('currentWeek');

  const getDateValues = (dateType) => {
    switch (dateType) {
      case 'currentWeek':
        const { currentWeekEndDate, currentWeekStartDate } =
          getCurrentWeekDates({ type: 'date' });
        return {
          startDate: currentWeekStartDate,
          endDate: currentWeekEndDate,
        };
      case 'currentMonth':
        const { currentMonthEndDate, currentMonthStartDate } =
          getCurrentMonthDates({ type: 'date' });
        return {
          startDate: currentMonthStartDate,
          endDate: currentMonthEndDate,
        };
      case 'currentYear':
        const { currentYearEndDate, currentYearStartDate } =
          getCurrentYearDates({ type: 'date' });
        return {
          startDate: currentYearStartDate,
          endDate: currentYearEndDate,
        };
      case 'previousWeek':
        const { previouseWeekStartDate, previouseWeekEndDate } =
          getPreviouseWeekDates({ type: 'date' });
        return {
          startDate: previouseWeekStartDate,
          endDate: previouseWeekEndDate,
        };
      case 'previousMonth':
        const { previousMonthStartDate, previousMonthEndDate } =
          getPreviouseMonthDates({ type: 'date' });
        return {
          startDate: previousMonthStartDate,
          endDate: previousMonthEndDate,
        };
      case 'previousYear':
        const { previousYearStartDate, previousYearEndDate } =
          getPreviouseYearDates({ type: 'date' });
        return {
          startDate: previousYearStartDate,
          endDate: previousYearEndDate,
        };
    }
  };

  const { abandonedCarts, error, loading, soldCarts } = useReports(
    getDateValues(selectValue)
  );

  const getDateLabels = (dateType) => {
    switch (dateType) {
      case 'currentWeek':
        const { currentWeekEndDate, currentWeekStartDate } =
          getCurrentWeekDates();
        return `This Week ${currentWeekStartDate} To ${currentWeekEndDate}`;
      case 'currentMonth':
        const { currentMonthEndDate, currentMonthStartDate } =
          getCurrentMonthDates();
        return `This Month ${currentMonthStartDate} To ${currentMonthEndDate}`;
      case 'currentYear':
        const { currentYearEndDate, currentYearStartDate } =
          getCurrentYearDates();
        return `This Year ${currentYearStartDate} To ${currentYearEndDate}`;
      case 'previousWeek':
        const { previouseWeekStartDate, previouseWeekEndDate } =
          getPreviouseWeekDates();
        return `Previous Week ${previouseWeekStartDate} To ${previouseWeekEndDate}`;
      case 'previousMonth':
        const { previousMonthStartDate, previousMonthEndDate } =
          getPreviouseMonthDates();
        return `Previous Month ${previousMonthStartDate} To ${previousMonthEndDate}`;
      case 'previousYear':
        const { previousYearStartDate, previousYearEndDate } =
          getPreviouseYearDates();
        return `Previous Year ${previousYearStartDate} To ${previousYearEndDate}`;
      default:
        break;
    }
  };

  var options = [
    { value: 'currentWeek', label: getDateLabels('currentWeek') },
    { value: 'currentMonth', label: getDateLabels('currentMonth') },
    { value: 'currentYear', label: getDateLabels('currentYear') },
    { value: 'previousWeek', label: getDateLabels('previousWeek') },
    { value: 'previousMonth', label: getDateLabels('previousMonth') },
    { value: 'previousYear', label: getDateLabels('previousYear') },
  ];

  const { newMergedArry } = changeDateFormat(soldCarts, abandonedCarts);

  console.log(newMergedArry);

  return (
    <div>
      <Text.Headline as="h1">Reports</Text.Headline>
      <div style={{ marginTop: '20px' }}>
        <Card theme="light" type="raised">
          <Spacings.Inline>
            <SelectField
              value={selectValue}
              options={options}
              onChange={(e) => {
                console.log(e.target.value);
                setSelectValue(e.target.value);
              }}
            ></SelectField>
          </Spacings.Inline>
          {newMergedArry && (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={newMergedArry}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <XAxis dataKey="date" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Legend verticalAlign="top" height={36} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="Abandoned"
                  stroke="#00b39e"
                  fill="#00b39e"
                />
                <Area
                  type="monotone"
                  dataKey="Orders"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Reports;

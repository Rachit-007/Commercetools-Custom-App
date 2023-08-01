import { useMcQuery } from '@commercetools-frontend/application-shell';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import dayjs from 'dayjs';
import { countBy } from 'lodash';
import { map } from 'lodash';
import fetchOrderAndCart from './fetchCartAndOrder.graphql';

export const useReports = ({ startDate, endDate }) => {
  const oldCartStartDate = dayjs(startDate)
    .subtract(14, 'd')
    .format('YYYY-MM-DD');
  const oldCartEndDate = dayjs(endDate).subtract(14, 'd').format('YYYY-MM-DD');

  const { data, error, loading } = useMcQuery(fetchOrderAndCart, {
    variables: {
      cartwhere: `lastModifiedAt > "${oldCartStartDate}" and lastModifiedAt < "${oldCartEndDate}" and ( cartState =  "Active" )`,
      orderwhere: `createdAt >= "${startDate}" and createdAt <= "${endDate}" `,
      cartsort: [`lastModifiedAt asc`],
      ordersort: [`createdAt asc`],
      limit: 500,
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });
  return {
    abandonedCarts: data?.abandonedCarts?.results,
    soldCarts: data?.soldCarts?.results,
    error,
    loading,
  };
};

export const changeDateFormat = (orderData, cartData) => {
  console.log(orderData, cartData, 'from hook');
  const newOrderDate =
    orderData &&
    orderData.map((item) => {
      return { date: dayjs(item.createdAt).format('YYYY/MM/DD') };
    });

  const newCartDate =
    cartData &&
    cartData.map((item) => {
      return {
        date: dayjs(item.lastModifiedAt).add(14, 'd').format('YYYY/MM/DD'),
      };
    });

  const orderCounter =
    newOrderDate &&
    map(countBy(newOrderDate, 'date'), (value, date) => {
      return {
        date,
        Orders: value,
        Abandoned: 0,
      };
    });

  const cartCounter =
    newCartDate &&
    map(countBy(newCartDate, 'date'), (value, date) => {
      return {
        date,

        Abandoned: value,

        Orders: 0,
      };
    });

  const mergArr = orderCounter &&
    cartCounter && [...orderCounter, ...cartCounter];

  console.log(mergArr);

  const dateMap = new Map();

  console.log(dateMap);

  mergArr &&
    mergArr.forEach((item) => {
      if (dateMap.has(item.date)) {
        const existingItem = dateMap.get(item.date);

        existingItem.Orders += item.Orders;

        existingItem.Abandoned += item.Abandoned;
      } else {
        dateMap.set(item.date, { ...item });
      }
    });

  const mergedArray = [];

  dateMap.forEach((item) => mergedArray.push(item));

  console.log(mergedArray);

  const newMergedArry = mergedArray.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  newMergedArry.forEach((item) => {
    item.date = dayjs(item.date).format('DD-MMM-YY');
  });

  return {
    newMergedArry,
  };
};

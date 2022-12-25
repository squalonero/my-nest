/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

import { PipelineStage } from 'mongoose';

export const DayAvailabilityAgg = (inputDate): PipelineStage[] => [
  {
    $project: {
      selectedDate: inputDate,
      date: 1,
      status: 1,
      passengers: 1,
      dateString: {
        $dateToString: {
          format: '%Y-%m-%d',
          date: '$date',
        },
      },
      month: {
        $month: '$date',
      },
      year: {
        $year: '$date',
      },
      passengersSize: {
        $size: '$passengers',
      },
    },
  },
  {
    $match: {
      $expr: {
        $eq: ['$selectedDate', '$dateString'],
      },
    },
  },
  {
    $group: {
      _id: '$dateString',
      pending: {
        $sum: {
          $cond: [
            {
              $eq: ['$status', 'PENDING'],
            },
            '$passengersSize',
            0,
          ],
        },
      },
      confirmed: {
        $sum: {
          $cond: [
            {
              $eq: ['$status', 'CONFIRMED'],
            },
            '$passengersSize',
            0,
          ],
        },
      },
      cancelled: {
        $sum: {
          $cond: [
            {
              $eq: ['$status', 'CANCELLED'],
            },
            '$passengersSize',
            0,
          ],
        },
      },
      total: {
        $sum: {
          $add: [
            {
              $cond: [
                {
                  $eq: ['$status', 'PENDING'],
                },
                '$passengersSize',
                0,
              ],
            },
            {
              $cond: [
                {
                  $eq: ['$status', 'CONFIRMED'],
                },
                '$passengersSize',
                0,
              ],
            },
            {
              $cond: [
                {
                  $eq: ['$status', 'CANCELLED'],
                },
                '$passengersSize',
                0,
              ],
            },
          ],
        },
      },
    },
  },
  { $sort: { _id: 1 } },
];


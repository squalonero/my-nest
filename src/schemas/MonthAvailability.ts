/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

import { PipelineStage } from 'mongoose';

export const MonthAvailability = (inputDate): PipelineStage[] => [
  {
    $project: {
      selectedDate: {
        $dateFromString: {
          format: '%Y-%m-%d',
          dateString: inputDate,
        },
      },
      dateString: {
        $dateToString: {
          format: '%Y-%m-%d',
          date: {
            $toDate: '$date',
          },
        },
      },
      monthDate: {
        $month: '$date',
      },
      yearDate: {
        $year: '$date',
      },
      status: 1,
      passengers: 1,
    },
  },
  {
    $match: {
      $and: [
        {
          $expr: {
            $eq: [
              {
                $month: '$selectedDate',
              },
              '$monthDate',
            ],
          },
        },
        {
          $expr: {
            $eq: [
              {
                $year: '$selectedDate',
              },
              '$yearDate',
            ],
          },
        },
      ],
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
            {
              $size: '$passengers',
            },
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
            {
              $size: '$passengers',
            },
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
            {
              $size: '$passengers',
            },
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
                {
                  $size: '$passengers',
                },
                0,
              ],
            },
            {
              $cond: [
                {
                  $eq: ['$status', 'CONFIRMED'],
                },
                {
                  $size: '$passengers',
                },
                0,
              ],
            },
            {
              $cond: [
                {
                  $eq: ['$status', 'CANCELLED'],
                },
                {
                  $size: '$passengers',
                },
                0,
              ],
            },
          ],
        },
      },
    },
  },
  {
    $sort: {
      _id: 1,
    },
  },
];

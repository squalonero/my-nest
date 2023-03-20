import { BookingStatus } from '../dto/create-booking.dto';

export const UsersAgg = (reqDate: string) => [
  {
    $match: {
      $or: [
        {
          status: BookingStatus.PENDING,
        },
        {
          status: BookingStatus.CONFIRMED,
        },
        {
          status: BookingStatus.CANCELLED,
        },
      ],
    },
  },
  {
    $lookup: {
      from: 'users',
      localField: 'user',
      foreignField: '_id',
      as: 'user',
    },
  },
  {
    $project: {
      _id: 1,
      user: {
        email: '$user.email',
        phone: '$user.phone',
      },
      status: 1,
      date: 1,
      passengers: 1,
    },
  },
  {
    $project: {
      _id: 1,
      user: {
        $ifNull: [
          {
            $arrayElemAt: ['$user', 0],
          },
          '',
        ],
      },
      status: 1,
      date: 1,
      passengers: 1,
    },
  },
  {
    $match: {
      date: {
        $gte: reqDate,
        $lte: reqDate,
      },
    },
  },
];

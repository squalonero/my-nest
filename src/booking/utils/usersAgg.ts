export const UsersAgg = (reqDate: string) => [
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
      user: '$user.email',
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

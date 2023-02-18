export const UsersAgg = [
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
      status: 1,
      date: 1,
      passengers: 1,
      user: '$user.email',
    },
  },
  {
    $project: {
      user: {
        $ifNull: [
          {
            $arrayElemAt: ['$user', 0],
          },
          '',
        ],
      },
    },
  },
];

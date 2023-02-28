import * as dayjs from 'dayjs';
import { UpdateBookingDto } from '../dto/update-booking.dto';

export const formatUpdateBookingDto = (
  updateBookingDto: UpdateBookingDto,
): UpdateBookingDto => {
  const { date, ...rest } = updateBookingDto;
  const formattedDate = dayjs(date).toDate();

  return {
    ...(date && { date: formattedDate }),
    ...rest,
  };
};

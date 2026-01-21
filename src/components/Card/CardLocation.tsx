import { Stack, HStack, Text, Tooltip } from '@chakra-ui/react';
import { DateFormatter } from '../../utils/dateFormatter';

interface CardLocationProps {
  location: string;
  dates: Date[];
}

export const CardLocation = ({ location, dates }: CardLocationProps) => {
  const formatDateRange = () => {
    if (dates.length === 1) {
      return DateFormatter.formatToShortDate(dates[0]);
    }
    return `${DateFormatter.formatToShortDate(dates[0])} - ${DateFormatter.formatToShortDate(dates[dates.length - 1])}`;
  };

  const allDatesFormatted = dates.map(DateFormatter.formatToShortDate).join(', ');

  return (
    <Stack
      direction="row"
      justify="space-between"
      alignItems="center"
      color="white"
    >
      <HStack spacing={1}>
        <Text fontSize="12px" fontWeight="bold">
          Ubicacion:
        </Text>
        <Text fontSize="12px" fontWeight="200">
          {location}
        </Text>
      </HStack>
      <HStack spacing={1} fontSize="14px">
        <Tooltip label={allDatesFormatted} placement="top-start">
          <Text>
            Fechas: {formatDateRange()}
          </Text>
        </Tooltip>
      </HStack>
    </Stack>
  );
};

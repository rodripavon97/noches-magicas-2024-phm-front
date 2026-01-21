import { Stack, Text, HStack } from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';
import { theme } from '../../styles/styles';
import { ScoreFormatter } from '../../utils/scoreFormatter';

interface CardHeaderProps {
  bandName: string;
  showName: string;
  score: number | null;
  totalComments: number;
}

export const CardHeader = ({ 
  bandName, 
  showName, 
  score, 
  totalComments 
}: CardHeaderProps) => {
  return (
    <Stack
      direction="row"
      justify="space-between"
      alignItems="center"
      color="white"
    >
      <Text fontSize="12px" fontWeight="400">
        {bandName} - {showName}
      </Text>
      <HStack spacing={1} fontSize="12px">
        <FaStar color={theme.colors.brand.colorFourth} />
        <Text>{ScoreFormatter.formatScore(score)}</Text>
        <Text>({totalComments})</Text>
      </HStack>
    </Stack>
  );
};

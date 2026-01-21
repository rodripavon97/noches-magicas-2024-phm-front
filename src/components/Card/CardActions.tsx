import { Stack, Text, Button } from '@chakra-ui/react';
import { theme } from '../../styles/styles';

interface CardActionsProps {
  isProfileView: boolean;
  isShowOpen: boolean;
  pricePaid?: number;
  priceMin?: number;
  priceMax?: number;
  onBuyClick?: () => void;
  commentButton?: React.ReactNode;
}

export const CardActions = ({
  isProfileView,
  isShowOpen,
  pricePaid,
  priceMin,
  priceMax,
  onBuyClick,
  commentButton,
}: CardActionsProps) => {
  return (
    <Stack
      direction="row"
      justify="space-between"
      alignItems="center"
      color="white"
      mb='4px'
      pr={1}
      pl={1}
    >
      {isProfileView ? (
        <>
          <Text fontSize="14px" fontWeight="600">
            Precio pagado ${pricePaid}
          </Text>
          {!isShowOpen && commentButton}
        </>
      ) : (
        <>
          <Text fontSize="14px" fontWeight="600">
            Desde ${priceMin} a ${priceMax}
          </Text>
          <Button 
            size="sm" 
            bg={theme.colors.brand.colorFourth}
            textColor={theme.colors.brand.text}
            onClick={onBuyClick}
          >
            Comprar
          </Button>
        </>
      )}
    </Stack>
  );
};

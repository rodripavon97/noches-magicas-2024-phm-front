import { Image, Badge } from '@chakra-ui/react';
import { theme } from '../../styles/styles';

interface CardImageProps {
  src: string;
  alt: string;
  showQuantityBadge?: boolean;
  quantity?: number;
}

export const CardImage = ({ 
  src, 
  alt, 
  showQuantityBadge = false, 
  quantity = 1 
}: CardImageProps) => {
  return (
    <>
      <Image
        srcSet={src}
        alt={alt}
        borderRadius="1rem 1rem 1rem 1rem"
        w="100%"
        h="230px"
        objectFit="cover"
      />
      {showQuantityBadge && (
        <Badge
          borderRadius="full"
          px="2"
          bg={theme.colors.brand.borderColorCard}
          color={theme.colors.brand.text}
          position="absolute"
          top="0"
          right="0"
          mt="1"
          mr="1"
        >
          X{quantity}
        </Badge>
      )}
    </>
  );
};

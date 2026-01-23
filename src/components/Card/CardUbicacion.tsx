import { Flex, Heading, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Text } from '@chakra-ui/react'
import { theme } from '../../styles/styles'

export interface CardUbicacionProps {
  title: string,
  ubicacionCosto: number,
  onCardClick: (cantidad: number, ubicacionCosto: number) => void
}

  const CardUbicacion = ({ title, ubicacionCosto, onCardClick }: CardUbicacionProps) => {

    const handleClick = (valueString) => {
      const cantidad = parseInt(valueString, 10);
      if (!isNaN(cantidad)) {
        onCardClick(cantidad, ubicacionCosto);
      }
    }

  return (
    <Flex gap={0.2} alignItems="center" justifyContent="center">
      <Flex
        flexDirection="row"
        width="100%"
        justifyContent="space-between"
        height={100}
        alignItems="center"
        color={"black"}
        bg={theme.colors.brand.colorDateSecundary}
        style={{ border: "1px solid" }}
        onClick={handleClick}
        cursor="pointer"
      >
        <Heading size="md" ml={"1.2rem"}>
          {title}
        </Heading>

        <Text fontSize="12px" fontWeight="200">
          ${ubicacionCosto}
        </Text>

        <Text fontSize="12px" fontWeight="200" width={"15%"}>
          <NumberInput mr={"0.2rem"} defaultValue={0} min={0} max={100}  
          onChange={(valueString) => handleClick(valueString)}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Text>
      </Flex>
    </Flex>
  );
};


export default CardUbicacion;

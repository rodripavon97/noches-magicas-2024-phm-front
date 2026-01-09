import { Card, Flex, Heading, Text } from '@chakra-ui/react'
import { theme } from '../../styles/styles'
import PropTypes from 'prop-types'
import { useState } from 'react'

export interface CardFechaProps {
  color: string,
  selectedColor: string,
  title: string,
  text1: string,
  text2: string,
  width: number,
  onClick: () => void,
  disabled: boolean
}

const CardFecha = ({ color, selectedColor, title, text1, text2, width, onClick, disabled }: CardFechaProps) => {
  const [isSelected, setIsSelected] = useState(false)
  const backgroundColor = isSelected ? selectedColor : color

  const handleClick = () => {
    if (!disabled) {
      setIsSelected(!isSelected)
      onClick()
    }
  }

  return (
    <Flex alignItems="center" justifyContent="center">
      <Card 
        overflow='hidden'
        variant='outline'
        width={width} 
        height={100} 
        mr={2} 
        alignItems='center' 
        justifyContent='center' 
        bg={backgroundColor}
        onClick={handleClick}
        style={{
          border: `2px inset ${theme.colors.brand.colorDatePrimary}`,
          cursor: disabled ? 'default' : 'pointer',
          boxShadow: isSelected ? `0 0 40px orange` : 'none'
        }}
      >
        <Heading size='md' mb={2}> {title}</Heading>
        <Text fontSize="12px" fontWeight="bold">
          {text1}
        </Text>
        {text2 && (
          <Text fontSize="12px">
            {text2}
          </Text>
        )}
      </Card>
    </Flex>
  )
}

export default CardFecha

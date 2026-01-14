import { LuRadioTower } from 'react-icons/lu'
import { theme } from '../../styles/styles'
import {
  Button,
  Checkbox,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputRightAddon,
  Text,
} from '@chakra-ui/react'
import { FaCity } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

export interface FiltroBusquedaProps {
  isAdmin: boolean
  clickSearch: () => void
  changeArtistaText: (e: React.ChangeEvent<HTMLInputElement>) => void
  changeLocacionText: (e: React.ChangeEvent<HTMLInputElement>) => void
  changeCheckboxAmigos: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const FiltroBusqueda = ({isAdmin, clickSearch, changeArtistaText, changeLocacionText, changeCheckboxAmigos}: FiltroBusquedaProps) => {
  const { t } = useTranslation('commons')



  return (
    <Flex
      direction={{ base: "column", lg: "row" }}
      justifyContent="center"
      alignItems="center"
      gap={{ base: 4, lg: 2 }}
      p={{ base: "1rem", md: "1rem 4rem", lg: "1rem 12rem 0 12rem" }}
      w="100%"
    >
      <InputGroup
        display="flex"
        justifyContent="center"
        alignItems="center"
        maxW={{ base: "100%", lg: "auto" }}
        _placeholder={{ color: 'brand.colorSecundary' }}
      >
        <Input
          type="text"
          color="white"
          focusBorderColor="brand.colorFourth"
          placeholder="Artista"
          borderColor={theme.colors.brand.colorSecundary}
          onChange={changeArtistaText}
          textColor={theme.colors.brand.text}
          
        />
        <InputRightAddon
          bg="brand.colorFourth"
          borderColor={theme.colors.brand.colorSecundary}
        >
          <LuRadioTower />
        </InputRightAddon>
      </InputGroup>
      <InputGroup
        display="flex"
        justifyContent="center"
        alignItems="center"
        maxW={{ base: "100%", lg: "auto" }}
        _placeholder={{ color: 'brand.colorSecondary' }}
      >
        <Input
          type="text"
          focusBorderColor="brand.colorFourth"
          color="white"
          placeholder="Locacion"
          borderColor={theme.colors.brand.colorSecundary}
          onChange={changeLocacionText}
          textColor={theme.colors.brand.text}
        />
        <InputRightAddon
          bg="brand.colorFourth"
          borderColor={theme.colors.brand.colorSecundary}
        >
          <FaCity />
        </InputRightAddon>
      </InputGroup>
      <Flex 
        direction={{ base: "column", lg: "row" }} 
        gap={{ base: 3, lg: 2 }}
        alignItems="center"
        w={{ base: "100%", lg: "auto" }}
      >
        {!isAdmin &&
          <Checkbox
          color="white"
          iconColor="brand.colorFourth"
          w={{ base: "100%", lg: "auto" }}
          onChange={changeCheckboxAmigos}
        >
          {t('withFriends')}
        </Checkbox>
        }
        
        <Button 
          bg="brand.colorSecundary" 
          color="brand.colorFourth" 
          w={{ base: "100%", lg: "130px" }}
          onClick={clickSearch}
        >
          {t('search')}
        </Button>
      </Flex>
    </Flex>
  )
}
export default FiltroBusqueda

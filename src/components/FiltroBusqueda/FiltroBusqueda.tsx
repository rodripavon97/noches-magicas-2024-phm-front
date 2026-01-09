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
      direction="row"
      justifyContent="center"
      alignItems="center"
      p="1rem 12rem 0 12rem"
    >
      <InputGroup
        p="0 0 0 1rem"
        display="flex"
        justifyContent="center"
        alignItems="center"
        mx="auto"
        _placeholder={{ color: 'brand.colorSecundary' }}
      >
        <Input
          type="text"
          color="white"
          focusBorderColor="brand.colorFourth"
          placeholder="Artista"
          borderColor={theme.colors.brand.colorSecundary}
          onChange={changeArtistaText}
          
        />
        <InputRightAddon
          bg="brand.colorFourth"
          borderColor={theme.colors.brand.colorSecundary}
        >
          <LuRadioTower />
        </InputRightAddon>
      </InputGroup>
      <InputGroup
        p="0 0 0 1rem"
        display="flex"
        justifyContent="center"
        alignItems="center"
        mx="auto"
        _placeholder={{ color: 'brand.colorSecondary' }}
      >
        <Input
          type="text"
          focusBorderColor="brand.colorFourth"
          color="white"
          placeholder="Locacion"
          borderColor={theme.colors.brand.colorSecundary}
          onChange={changeLocacionText}
        />
        <InputRightAddon
          bg="brand.colorFourth"
          borderColor={theme.colors.brand.colorSecundary}
        >
          <FaCity />
        </InputRightAddon>
      </InputGroup>
      <HStack spacing={2} alignItems="center">
        {!isAdmin &&
          <Checkbox
          color="white"
          iconColor="brand.colorFourth"
          flex="0 0 130px"
          paddingLeft="0.5rem"
          onChange={changeCheckboxAmigos}
        >
          {t('withFriends')}
        </Checkbox>
        }
        
        <Button bg="brand.colorSecundary" color="brand.colorFourth" w="130px" ml={2} onClick={clickSearch}>
        {t('search')}
        </Button>
      </HStack>
    </Flex>
  )
}
export default FiltroBusqueda

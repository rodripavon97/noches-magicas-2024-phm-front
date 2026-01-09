import React, { useRef, useState } from 'react'
import { theme } from '../../styles/styles'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Input
} from '@chakra-ui/react'

export interface ModalFormProps {
  isOpen: boolean,
  onClose: () => void,
  title: string,
  text: string,
  inputs: Array<{name: string, label: string, type: string}>,
  onSubmit: (formData: any) => void,
  initialValues: any
}

const Form = ({ isOpen, onClose, title, text, inputs,onSubmit ,initialValues}) => {
  const cancel = useRef()
  const [formData, setFormData] = useState(initialValues);

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(formData)
    onClose()
  }

  const handleChange = (e, name) => {
    setFormData({
      ...formData,
      [name]: e.target.value,
    })
  }

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancel}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <form onSubmit={handleSubmit}>
              <AlertDialogHeader fontSize="lg" fontWeight="bold" color="black">
                {title}: {text}
              </AlertDialogHeader>

              <AlertDialogBody>
                {inputs.map((input, index) => (
                  <Input
                    key={index}
                    type={input.type}
                    value={formData[input.name]} 
                    onChange={(e) => handleChange(e, input.name)}
                    placeholder={input.label}
                    style={{color:'black'}}
                  />
                ))}
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancel} onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit" color={theme.colors.brand.colorFourth} ml={3}>
                  Aceptar
                </Button>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default Form

// import { useState } from 'react'
// import { PropTypes } from 'prop-types'
// import { Box, SimpleGrid, Spinner, Text } from '@chakra-ui/react'
// import { useOnInit } from '../../hooks/useOnInit'
// import { theme } from '../../styles/style'

// export const SpinnerLoading = ({ children }) => {
//   const [isLoading, setIsLoading] = useState(true)

//   const spinnerLoader = () => {
//     setTimeout(() => {
//       setIsLoading(false)
//     }, 250)
//   }

//   useOnInit(spinnerLoader)

//   return (
//     <>
//       {isLoading ? (
//         <SimpleGrid height="100vh"  placeItems="center">
//           <Box alignItems="center" textAlign="center">
//             <Spinner
//               thickness="4px"
//               speed="0.65s"
//               emptyColor={theme.colors.brand.colorFourth}
//               color={theme.colors.brand.colorSecundary}
//               size="xl"
//             />
//             <Text> Cargando ...</Text>
//           </Box>

          
//         </SimpleGrid>
//       ) : (
//         children
//       )}
//     </>
//   )
// }
// SpinnerLoading.propTypes = {
//   children: PropTypes.node,
// }
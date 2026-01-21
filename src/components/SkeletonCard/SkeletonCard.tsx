import { Box, Skeleton, SkeletonCircle, SkeletonText, Stack } from '@chakra-ui/react'

export function SkeletonCard() {
  return (
    <Box padding="6" boxShadow="lg" bg="white" borderRadius="md">
      <SkeletonCircle size="12" />
      <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="2" />
    </Box>
  )
}

interface SkeletonListProps {
  count?: number
}

export function SkeletonList({ count = 5 }: SkeletonListProps) {
  return (
    <Stack spacing={4}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </Stack>
  )
}

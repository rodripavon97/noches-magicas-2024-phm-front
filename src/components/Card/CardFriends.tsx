import { Wrap, Text, Avatar, AvatarGroup, Tooltip } from '@chakra-ui/react';
import { theme } from '../../styles/styles';
import { UsuarioAmigos } from '../../domain/UserAmigos';

interface CardFriendsProps {
  friends: UsuarioAmigos[];
}

export const CardFriends = ({ friends }: CardFriendsProps) => {
  if (friends.length === 0) {
    return (
      <Text color="white" h="61px" p={1} textAlign="center">
        No asiste ningún amigo
      </Text>
    );
  }

  return (
    <Wrap
      direction="row"
      justifyItems="center"
      alignItems="center"
      color="white"
      p={1}
    >
      <Text fontSize="12px" fontWeight="400">
        Asistieron al show
      </Text>
      <AvatarGroup
        size="sm"
        max={2}
        borderColor={theme.colors.brand.colorFourth}
        variant="solid"
        spacing={1}
      >
        {friends.map((friend) => (
          <Tooltip 
            key={friend.id} 
            label={`${friend.nombre} ${friend.apellido}`} 
            placement="top"
          >
            <Avatar src={friend.foto} />
          </Tooltip>
        ))}
      </AvatarGroup>
    </Wrap>
  );
};

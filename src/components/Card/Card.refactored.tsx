import { useNavigate } from 'react-router-dom';
import { Card, CardBody, Wrap } from '@chakra-ui/react';
import { theme } from '../../styles/styles';
import { Show } from '../../domain/Show';
import { useUserStore, selectIsLoggedIn } from '../../hooks/useUserStore';
import { LoggingService } from '../../service/loggingService';
import ModalComentario from '../Comentario/ModalComentario';
import { CardImage } from './CardImage';
import { CardHeader } from './CardHeader';
import { CardLocation } from './CardLocation';
import { CardFriends } from './CardFriends';
import { CardActions } from './CardActions';

/**
 * Card refactorizado siguiendo principios SOLID:
 * - SRP: Separado en sub-componentes con responsabilidades únicas
 * - OCP: Extensible mediante props
 * - ISP: Interfaces segregadas por componente
 * - DIP: Depende de abstracciones (hooks, servicios)
 */

interface CardShowProps {
  show: Show;
  mostrarCantidadEntrada: boolean;
  estaEnPerfil: boolean;
  onComentarioPublicado?: () => void;
}

const CardShow = ({
  show,
  mostrarCantidadEntrada,
  estaEnPerfil,
  onComentarioPublicado,
}: CardShowProps) => {
  const navigate = useNavigate();
  const isLoggedIn = useUserStore(selectIsLoggedIn);

  const handleBuyClick = async () => {
    if (isLoggedIn) {
      await LoggingService.registrarClickEnShow(show.id, show.ubicacion);
      navigate(`/detalle-show/${show.id}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <Card
      width={380}
      borderRadius="1rem 1rem 1rem 1rem"
      bg={theme.colors.brand.colorSecondary}
      borderColor={theme.colors.brand.borderColorCard}
      variant="outline"
    >
      <CardImage
        src={show.imagen}
        alt={`${show.nombreBanda} - ${show.nombreRecital}`}
        showQuantityBadge={mostrarCantidadEntrada}
        quantity={2}
      />

      <CardBody p={1}>
        <CardHeader
          bandName={show.nombreBanda}
          showName={show.nombreRecital}
          score={show.puntaje}
          totalComments={show.comentariosTotales}
        />

        <CardLocation
          location={show.ubicacion}
          dates={show.fecha}
        />

        {isLoggedIn && (
          <Wrap
            direction="row"
            justifyItems="center"
            alignItems="center"
            color="white"
            p={1}
          >
            <CardFriends friends={show.amigosQueVanAlShow} />
          </Wrap>
        )}

        <CardActions
          isProfileView={estaEnPerfil}
          isShowOpen={show.estaAbierto}
          pricePaid={show.precioEntrada}
          priceMin={show.precioLocacionBarata}
          priceMax={show.precioLocacionCara}
          onBuyClick={handleBuyClick}
          commentButton={
            <ModalComentario 
              entrada={show} 
              onComentarioPublicado={onComentarioPublicado} 
            />
          }
        />
      </CardBody>
    </Card>
  );
};

export default CardShow;

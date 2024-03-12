import { useOrder } from 'components/OrderContext';
import ButtonRow from 'components/ButtonRow';
import { StyledPaper } from 'components/Layout/SharedStyles';

export default function Confirmation() {
  const { startOver } = useOrder();

  return (
    <StyledPaper>
      <ButtonRow centerButtonProps = {{ onClick: startOver, text: 'Start another registration' }} />
    </StyledPaper>
  );
}

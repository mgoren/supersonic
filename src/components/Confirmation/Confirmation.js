import { useOrder } from 'components/OrderContext';
import ButtonRow from 'components/ButtonRow';
import { StyledPaper } from 'components/Layout/SharedStyles';

export default function Confirmation({ setCurrentPage }) {
  const { resetOrder } = useOrder();

  function startOver() {
    resetOrder();
    setCurrentPage(1);
  }

  return (
    <StyledPaper>
      <ButtonRow centerButtonProps = {{ onClick: startOver, text: 'Start another registration' }} />
    </StyledPaper>
  );
}

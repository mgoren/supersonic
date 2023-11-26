import { clearCache } from 'utils';
import ButtonRow from 'components/ButtonRow';
import config from 'config';
const { ORDER_DEFAULTS } = config;

export default function Confirmation({ setOrder, setCurrentPage }) {
  function startOver() {
    clearCache();
    setOrder(ORDER_DEFAULTS);
    setCurrentPage(1);
  }

  return (
    <ButtonRow centerButtonProps = {{ onClick: startOver, text: 'Start another registration' }} />
  );
}

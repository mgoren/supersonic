import { useOrder } from 'components/OrderContext';
import { Stepper, Step, StepLabel, MobileStepper, Button } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import config from 'config';
const { STEPS, NUM_PAGES } = config;

export const MyStepper = () => {
  const { currentPage } = useOrder();

  return (
    <Stepper
      activeStep={STEPS.findIndex(step => step.key === currentPage)}
      sx={{
        my: 5,
        '& .MuiStepLabel-root .Mui-active': {color: 'secondary.main'},
        '& .MuiStepLabel-root .Mui-completed': {color: 'secondary.main'}
      }}
    >
      {STEPS.map(({ label }) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export const MyMobileStepper = ({ onClickBack }) => {
  const { currentPage } = useOrder();

  return (
    <MobileStepper
      variant="dots"
      steps={STEPS.length}
      position="static"
      activeStep={STEPS.findIndex(step => step.key === currentPage)}
      nextButton={
        <>
          <Button
            type='submit'
            size='small'
            sx={currentPage === 'checkout' ? { visibility: 'hidden' } : {} }
          >
            {currentPage === NUM_PAGES ? 'Checkout' : 'Next'}<KeyboardArrowRight />
          </Button>
        </>
      }
      backButton={
        <>
          <Button
            type='button'
            onClick={onClickBack}
            size="small"
            sx={currentPage === 1 ? { visibility: 'hidden' } : {} }
          >
            <KeyboardArrowLeft />Back
          </Button>
        </>
      }
    />
  );
};

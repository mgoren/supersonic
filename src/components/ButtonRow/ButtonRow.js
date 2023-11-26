import { StyledPaper } from 'components/Layout/SharedStyles.js';
import { Box, Button } from '@mui/material';
import { StyledGreyButton } from "components/Layout/SharedStyles.js";

function BackButton({ onClick, text, ...props }) {
  return (
    <StyledGreyButton variant='outlined' onClick={onClick} {...props}>
      {text}
    </StyledGreyButton>
  );
}

function NextButton({ onClick, text, ...props }) {
  return (
    <Button variant='contained' color='secondary' onClick={onClick} {...props}>
      {text}
    </Button>
  );
}

export default function ButtonRow({ backButtonProps, nextButtonProps, centerButtonProps }) {
  return (
    <StyledPaper>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {backButtonProps ?
          <BackButton
            type='button'
            onClick={backButtonProps.onClick}
            text={backButtonProps.text || 'Back'}
          /> : <div />
        }
        {centerButtonProps &&
          <>
            <BackButton
              type='button'
              onClick={centerButtonProps.onClick}
              text={centerButtonProps.text}
            />
            <div />
          </>
        }
        {nextButtonProps &&
          <NextButton
            type={nextButtonProps.type === 'submit' ? 'submit' : 'button'}
            onClick={nextButtonProps.type === 'submit' ? undefined : nextButtonProps.onClick}
            text={nextButtonProps.text || 'Next'}
            sx={{ justifyContent: "flex-end" }}
          />
        }
      </Box>
    </StyledPaper>
  );
}

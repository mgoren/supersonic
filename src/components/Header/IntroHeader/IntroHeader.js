import { mailtoLink } from "utils";
import { StyledLink, Paragraph } from 'components/Layout/SharedStyles';
import config from 'config';
const { EMAIL_CONTACT } = config;

export default function IntroHeader() {
  return (
    <>
      <Paragraph>Intro descriptive content here...</Paragraph>
      <Paragraph>Questions? Email <StyledLink to={mailtoLink(EMAIL_CONTACT)}>{EMAIL_CONTACT}</StyledLink>.</Paragraph>
    </>
  );
}

import { mailtoLink } from "utils";
import { StyledLink, Paragraph } from 'components/Layout/SharedStyles';
import config from 'config';
const { EMAIL_CONTACT } = config;

export default function IntroHeader() {
  return (
    <>
      <Paragraph>Join us at Really Fun Contra Dance Camp...</Paragraph>
      <Paragraph>
        <strong>Some notes on this form:</strong><br />
        Pronouns are for our own communications with you, and will not be published.
      </Paragraph>
      <Paragraph>Questions? Email <StyledLink to={mailtoLink(EMAIL_CONTACT)}>{EMAIL_CONTACT}</StyledLink>.</Paragraph>
    </>
  );
}

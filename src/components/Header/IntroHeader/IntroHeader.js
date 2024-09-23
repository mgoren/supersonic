import { mailtoLink } from "utils";
import { StyledLink, Paragraph } from 'components/Layout/SharedStyles';
import config from 'config';
const { EMAIL_CONTACT, TECHNICAL_CONTACT } = config;

export default function IntroHeader() {
  return (
    <>
      <Paragraph>Join us Feb 7-9 in Seattle for the 2025 Supersonic Contra Dance Weekend!</Paragraph>
      <Paragraph>After you hit save, there will be an opportunity to add additional registrants.</Paragraph>
      <Paragraph>Registration system questions? Email <StyledLink to={mailtoLink(TECHNICAL_CONTACT)}>{TECHNICAL_CONTACT}</StyledLink>.</Paragraph>
      <Paragraph>Any other questions? Email <StyledLink to={mailtoLink(EMAIL_CONTACT)}>{EMAIL_CONTACT}</StyledLink>.</Paragraph>
    </>
  );
}

import { signOut, useSession } from 'next-auth/react';
import styled from 'styled-components';
import { Fade } from 'react-awesome-reveal';
import { TextLoop } from 'react-text-loop-next';
import { media } from '@/lib/media';

const Wrapper = styled.div`
  display: flex;
  background: #fff;
  padding: 30px 0;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  border: 8px solid ${({ theme }) => theme.colors.primary};
  ${media.tablet`
    padding: 0;
    min-height: 640px;
    height: calc(100vh - 16px);
  `}
`;

const Title = styled.h1`
  margin: 0 auto;
  font-size: 38px;
  max-width: 900px;
  font-weight: 800;
  text-align: center;
  letter-spacing: -1px;
  ${media.tablet`
    padding: 0 20px;
    font-size: 84px;
    max-width: 900px;
    font-weight: 800;
    letter-spacing: -4px;
  `}
`;

const Intro = styled.p`
  color: #0070f3;
  font-size: 14px;
  line-height: 1.6;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 7px;
  margin: 0 auto 20px auto;
  background: rgba(0,118,255,0.1);
  ${media.tablet`
    margin: 30px auto 20px auto;
    font-size: 18px;
    max-width: 900px;
    line-height: 1.6;
  `}
`;

const Description = styled.p`
  color: #666666;
  font-size: 18px;
  line-height: 1.4;
  font-weight: 400;
  padding: 0 30px;
  text-align: center;
  letter-spacing: -0.5px;
  margin: 20px auto 10px auto;
  ${media.tablet`
    padding: 0;
    font-size: 20px;
    padding: 0 30px;
    max-width: 600px;
    line-height: 1.4;
    letter-spacing: -1px;
  `}
`;

const LoopRowTitle = styled.div`
  word-break: break-all;
  margin: 8px 8px 0 8px;
  font-size: 18px;
  ${media.tablet`
    font-size: 24px;
  `}
`;

const LoopRowWrapper = styled.div`
  margin-top: 8px;
  width: 200px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const FixedTextPart = styled.span`
  font-size: 18px;
  ${media.tablet`
    font-size: 24px;
  `}
`;

const LoopedTextPart = styled.span`
  font-size: 18px;
  ${media.tablet`
    font-size: 24px;
  `}
`;

const Link = styled.a`
  color: #0070f3;
  font-weight: 400;
  text-decoration: none;
  letter-spacing: -0.5px;
  &:hover {
    color: #0070f3;
    border-color: transparent;
  }
`;

const CTAWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 40px auto 20px auto;
  ${media.tablet`
    flex-direction: row;
  `}
`;

const CTAPrimary = styled.a`
  color: #fff;
  height: 2.81rem;
  cursor: pointer;
  padding: 0;
  width: 260px;
  text-align: center;
  margin: 0 0 10px 0;
  border-radius: 7px;
  line-height: 2.8rem;
  text-decoration: none;
  background-color: #0070f3;
  box-shadow: 0 4px 14px 0 rgb(0 118 255 / 39%);
  &:hover {
    background: rgba(0,118,255,0.9);
    box-shadow: 0 6px 20px rgb(0 118 255 / 23%);
  }
  ${media.tablet`
    margin: 0;
  `}
`;

const CTASecondary = styled.a`
  color: #696969;
  cursor: pointer;
  height: 2.81rem;
  background: #fff;
  width: 260px;
  text-align: center;
  padding: 0;
  margin: 10px 0 0 0;
  text-decoration: none;
  line-height: 2.8rem;
  border-radius: 7px;
  box-shadow: 0 4px 14px 0 rgb(0 0 0 / 10%);
  &:hover {
    background: rgba(255,255,255,0.9);
    box-shadow: 0 6px 20px rgb(93 93 93 / 23%);
  }
  ${media.tablet`
    margin: 0 0 0 30px;
  `}
`;

const FooterWrapper = styled.div`
  display: flex;
  margin: 20px 0;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 14px;
`;

const FooterLink = styled.a`
  padding: 8px;
  color: #0070f3;
  font-weight: 400;
  border-radius: 7px;
  text-decoration: none;
  &:hover {
    color: #0070f3;
    background: rgba(0,118,255,0.1);
  }
`;

const Bold = styled.span`
  margin: 0;
  padding: 0;
  display: block;
  font-weight: 600;
  padding-bottom: 5px;
  letter-spacing: -0.5px;
`;

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <Wrapper>
      <Fade triggerOnce direction="up" cascade delay={500}>
        <Intro>Under Construction</Intro>
        <Title>Lightning to Email</Title>
      </Fade>
      <Fade triggerOnce direction="up" delay={900}>
        <Description>
          <Bold>Accept Bitcoin payments via your email address + &quot;.ln2.email&quot;.</Bold>
          A massively simpler way to switch between lightning wallets,
          without changing your{' '}
          <Link href="https://lightningaddress.com" target="_blank" rel="noreferrer noopener">
            lightning address
          </Link>.
        </Description>
      </Fade>
      <Fade triggerOnce direction="up" delay={1300}>
        <LoopRowTitle>
          Forward payments from:
        </LoopRowTitle>
        {
          session?.user?.email ? (
            <LoopRowTitle>
              {session.user.email}.ln2.email
            </LoopRowTitle>
          ) : (
            <LoopRowWrapper>
              <FixedTextPart>you@</FixedTextPart>
              <TextLoop interval={3000} delay={1600}>
                <LoopedTextPart>gmail.com</LoopedTextPart>
                <LoopedTextPart>protonmail.com</LoopedTextPart>
                <LoopedTextPart>hotmail.com</LoopedTextPart>
                <LoopedTextPart>icloud.com</LoopedTextPart>
              </TextLoop>
              <FixedTextPart>.ln2.email</FixedTextPart>
            </LoopRowWrapper>
          )
        }
        <LoopRowTitle>
          to:
        </LoopRowTitle>
        <LoopRowWrapper>
          <TextLoop interval={3000} delay={1600}>
            <LoopedTextPart>spiderman@zbd.gg</LoopedTextPart>
            <LoopedTextPart>deadpool@lntxbot.com</LoopedTextPart>
            <LoopedTextPart>hannibal@zebedee.io</LoopedTextPart>
            <LoopedTextPart>darthvader@coinos.io</LoopedTextPart>
            <LoopedTextPart>batman@ln.tips</LoopedTextPart>
            <LoopedTextPart>gladiator@coincorner.io</LoopedTextPart>
            <LoopedTextPart>guyfawkes@bitrefill.me</LoopedTextPart>
            <LoopedTextPart>shredder@fbtc.me</LoopedTextPart>
            <LoopedTextPart>ironman@lnmarkets.com</LoopedTextPart>
            <LoopedTextPart>westley@getalby.com</LoopedTextPart>
            <LoopedTextPart>zorro@walletofsatoshi.com</LoopedTextPart>
            <LoopedTextPart>scorpion@sparkwallet.me</LoopedTextPart>
            <LoopedTextPart>rorschach@getmash.cash</LoopedTextPart>
            <LoopedTextPart>theloneranger@8333.mobi</LoopedTextPart>
            <LoopedTextPart>greenlantern@starbackr.me</LoopedTextPart>
          </TextLoop>
        </LoopRowWrapper>
      </Fade>
      <Fade triggerOnce direction="up" delay={1700}>
        <CTAWrapper>
          <CTAPrimary
            style={{
              ...(status === 'loading') && {
                visibility: 'hidden'
              }
            }}
            href={
              session ? '/settings' : '/api/auth/signin?callbackUrl=%2Fauth-callback'
            }
          >
            {
              session ? 'Go to Settings' : 'Sign in'
            }
          </CTAPrimary>
          {
            session && (
              <CTASecondary
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  signOut();
                }}
              >
                Sign out
              </CTASecondary>
            )
          }
        </CTAWrapper>
        <FooterWrapper>
          <FooterLink
            href="https://github.com/oren-z0/ln2email"
            target="_blank"
            rel="noreferrer noopener"
          >
            GitHub
          </FooterLink>
          <FooterLink
            href="https://twitter.com/ln2email"
            target="_blank"
            rel="noreferrer noopener"
          >
            Twitter
          </FooterLink>
        </FooterWrapper>
      </Fade>
    </Wrapper>
  );
}

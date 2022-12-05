import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import styled from 'styled-components';
import { Fade } from 'react-awesome-reveal';
import { TextLoop } from 'react-text-loop-next';
import { media } from '@/lib/media';

const Wrapper = styled.div`
  display: flex;
  background: #fff;
  align-items: center;
  flex-direction: column;
  justify-content: space-evenly;
  border: 8px solid ${({ theme }) => theme.colors.primaryLight};
  padding: 8svh 0;
  min-height: calc(84svh - 16px);
`;

const Title = styled.h1`
  margin: 0 auto;
  padding: 0 10px;
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

const CTAWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 30px auto 20px auto;
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
  background-color: ${({ theme }) => theme.colors.primary};
  box-shadow: 0 4px 14px 0 ${({ theme }) => theme.colors.primaryLighter1};
  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
    box-shadow: 0 6px 20px ${({ theme }) => theme.colors.primaryLighter2};
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
  margin: 8px 0;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 14px;
`;

const FooterLink = styled.a`
  padding: 8px;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 400;
  border-radius: 7px;
  text-decoration: none;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primaryLightest};
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

const ExamplesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <Wrapper>
      <Fade triggerOnce direction="up" cascade delay={500}>
        <Image src="/logo.svg" width="50" height="50" alt="Logo" />
        <Title>Lightning to Email</Title>
      </Fade>
      <Fade triggerOnce direction="up" delay={900}>
        <Description>
          <Bold>
            Link your email address to your current lightning wallet.
          </Bold>
          Get a static lightning address, share it with anyone, and replace the wallet that
          receives the payments at any time.
        </Description>
      </Fade>
      <Fade triggerOnce direction="up" delay={1300}>
        <ExamplesContainer>
          <LoopRowTitle>
            Redirect payments from:
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
        </ExamplesContainer>
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
          <FooterLink
            href="mailto:support@ln2.email"
            target="_blank"
            rel="noreferrer noopener"
          >
            Contact
          </FooterLink>
        </FooterWrapper>
      </Fade>
    </Wrapper>
  );
}

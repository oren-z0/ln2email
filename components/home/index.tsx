import Image from 'next/image';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import styled from 'styled-components';
import { Fade } from 'react-awesome-reveal';
import { media } from '@/lib/media';
import TextLoop from '../text-loop';
import CookieConsent from 'react-cookie-consent';

const Wrapper = styled.div`
  display: flex;
  background: #fff;
  align-items: center;
  flex-direction: column;
  justify-content: space-evenly;
  border: 8px solid ${({ theme }) => theme.colors.primaryLight};
  padding: 4dvh 0;
  min-height: calc(92dvh - 16px);
`;

const ImageContainer = styled.div`
  padding: 10px;
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
  margin: 10px auto 10px auto;
  letter-spacing: -0.5px;
  ${media.tablet`
    padding: 0;
    font-size: 20px;
    max-width: 600px;
    letter-spacing: -1px;
  `}
`;

const ExamplesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  letter-spacing: -0.5px;
  ${media.tablet`
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

const CTAWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 24px auto 14px auto;
  ${media.tablet`
    flex-direction: row;
    margin: 30px auto 20px auto;
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
`;

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <Wrapper>
      <Fade triggerOnce direction="up" cascade delay={500}>
        <ImageContainer>
          <Link href="/">
            <Image src="/logo.svg" width={60} height={60} alt="Logo" />
          </Link>
        </ImageContainer>
        <Title>Lightning to Email</Title>
      </Fade>
      <Fade triggerOnce direction="up" delay={900}>
        <Description>
          <Bold>
            Link your email address to your current Bitcoin-Lightning wallet.
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
                <TextLoop
                  animationDuration={3000}
                  texts={[
                    "gmail.com",
                    "protonmail.com",
                    "hotmail.com",
                    "icloud.com",
                  ]}
                />
                <FixedTextPart>.ln2.email</FixedTextPart>
              </LoopRowWrapper>
            )
          }
          <LoopRowTitle>
            to:
          </LoopRowTitle>
          <LoopRowWrapper>
            <FixedTextPart>&nbsp;</FixedTextPart>
            <TextLoop
              animationDuration={3000}
              texts={[
                "spiderman@zbd.gg",
                "deadpool@lntxbot.com",
                "hannibal@zebedee.io",
                "darthvader@coinos.io",
                "batman@ln.tips",
                "gladiator@coincorner.io",
                "guyfawkes@bitrefill.me",
                "shredder@fbtc.me",
                "ironman@lnmarkets.com",
                "westley@getalby.com",
                "zorro@walletofsatoshi.com",
                "scorpion@sparkwallet.me",
                "theloneranger@8333.mobi",
                "greenlantern@starbackr.me",
                "rorschach@lifpay.me",
              ]}
            />
            <FixedTextPart>&nbsp;</FixedTextPart>
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
              session ? '/profile' : '/api/auth/signin?callbackUrl=%2Fauth-callback'
            }
          >
            {
              session ? 'Go to your profile' : 'Sign in for free!'
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
      <CookieConsent
        debug={process.env.NODE_ENV === "development"}
        buttonStyle={{ color: "#FFF", backgroundColor: "#F7931A" }}
      >
        This website uses cookies to follow the user session and enhance the user experience.
      </CookieConsent>
    </Wrapper>
  );
}

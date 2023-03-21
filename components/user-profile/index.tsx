import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import styled from 'styled-components';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size/throttled';
import { media, sizes } from '@/lib/media';
import { UserProps } from '@/lib/api/user';

const UserProfileModule = styled.div`
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0;
  flex-direction: column;
  justify-content: center;
`;

const PageTitle = styled.div`
  padding: 0 30px;
  font-size: 18px;
  line-height: 1.4;
  font-weight: 600;
  max-width: 800px;
  text-align: center;
  margin: 10px auto 10px auto;
  letter-spacing: -0.5px;

  ${media.tablet`
    font-size: 22px;
    line-height: 1.6;
    letter-spacing: -1px;
  `}
`;

const UserProfileTitle = styled.div`
  margin: 0 auto;
  font-size: 30px;
  padding: 0 30px;
  max-width: 500px;
  font-weight: 800;
  line-height: 1.3;
  text-align: center;
  letter-spacing: -1px;

  ${media.tablet`
    padding: 0;
    font-size: 44px;
    letter-spacing: -2px;
  `}
`;

const UserProfileSubtitle = styled.div`
  color: #666666;
  padding: 0 30px;
  font-size: 16px;
  line-height: 1.4;
  font-weight: 400;
  max-width: 800px;
  text-align: center;
  margin: 5px auto 5px auto;
  letter-spacing: -0.5px;

  ${media.tablet`
    font-size: 20px;
    line-height: 1.6;
    letter-spacing: -1px;
  `}
`;

const UserProfileCardGrid = styled.div`
  display: flex;
  padding: 10px 0;
  flex-direction: column;
  ${media.tablet`
    width: 540px;
  `}
`;

const UserProfileCard = styled.div`
  padding: 20px 20px;
  display: flex;
  margin: 0 10px 20px 10px;
  background: #fff;
  border-radius: 7px;
  align-items: center;
  flex-direction: column;
  border: 1px solid #eaeaea;
  transition: box-shadow .2s ease;

  ${media.tablet`
    font-size: 20px;
    line-height: 1.6;
  `}
`;

const UserProfileCardTitle = styled.div`
  color: #111;
  margin: 0 0 8px 0;
  line-height: 1.4;
  font-weight: 600;
  font-size: 1.125em;
  letter-spacing: -0.5px;

  ${media.tablet`
    letter-spacing: -1px;
  `}
`;

const UserProfileCardDescription = styled.div`
  color: #111;
  font-size: 14px;
  padding: 0 5px;
  line-height: 1.4;
  font-weight: 400;
  text-align: left;
  margin-bottom: 8px;
`;

const LightningAddress = styled.span`
  font-weight: 700;
`

const SignoutWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin: 10px 10px 10px auto;
  ${media.tablet`
    margin: 10px 20px 0 auto;
  `}
`;

const CTASignout = styled.a`
  color: #696969;
  cursor: pointer;
  background: #fff;
  width: 80px;
  text-align: center;
  padding: 0;
  margin: 0;
  text-decoration: none;
  height: 2.1rem;
  line-height: 2rem;
  font-size: 0.75em;
  border-radius: 7px;
  box-shadow: 0 4px 14px 0 rgb(0 0 0 / 10%);
  &:hover {
    background: rgba(255,255,255,0.9);
    box-shadow: 0 6px 20px rgb(93 93 93 / 23%);
  }
  ${media.tablet`
    width: 100px;
    height: 2.81rem;
    line-height: 2.8rem;
    font-size: 0.875em;
  `}
`;


const CTAWrapper = styled.div`
  display: flex;
  margin: 0 auto 0 0;
  flex-direction: row;
`;

const LightningAddressInput = styled.input`
  width: 100%;
  border: 1px solid #bbb;
  border-radius: 0.3rem;
  box-shadow: inset 0 .1rem .2rem rgba(0,0,0,.2);
  box-sizing: border-box;
  font-size: 1rem;
  padding: .5rem .8rem;
  &:focus {
    box-shadow: none;
    border: 1px solid ${({ theme }) => theme.colors.primary};
  }
`;

const LightningAddressInputSublabel = styled.div`
  color: #555;
  font-size: 11px;
  padding: 0 5px;
  line-height: 1.2;
  font-weight: 400;
  text-align: left;
  margin: 2px 0 8px 0;
  width: 100%;
  letter-spacing: 0px;
`;

const CTAPrimary = styled.button`
  color: ${(props) => props.disabled ? 'rgba(0,0,0,0.26)' : '#fff'};
  ${(props) => props.disabled ? '' : 'cursor: pointer;'}
  padding: 0;
  width: 80px;
  text-align: center;
  margin: 0 10px 0 0;
  border-radius: 7px;
  height: 2.1rem;
  font-size: 0.875em;
  text-decoration: none;
  background-color: ${(props) => props.disabled ? 'rgba(0,0,0,0.12)' : props.theme.colors.primary};
  border: 0;

  ${(props) => props.disabled ? '' : `&:hover {
    background-color: ${props.theme.colors.primaryLight};
    box-shadow: 0 6px 20px ${props.theme.colors.primaryLighter2};
  }`}
  ${media.tablet`
    height: 2.3rem;
    font-size: 0.75em;
  `}
`;

const CTASecondary = styled.button`
  color: ${(props) => props.disabled ? 'rgba(0,0,0,0.26)' : props.theme.colors.primary};
  ${(props) => props.disabled ? '' : 'cursor: pointer;'}
  padding: 0;
  width: 80px;
  text-align: center;
  margin: 0 10px 0 0;
  border-radius: 7px;
  height: 2.1rem;
  font-size: 0.875em;
  text-decoration: none;
  background-color: rgba(0,0,0,0);
  border: 1px solid ${(props) => props.disabled ? 'rgba(0,0,0,0.12)' : props.theme.colors.primary};
  ${(props) => props.disabled ? '' : `&:hover {
    box-shadow: inset 0 6px 20px ${props.theme.colors.primaryLighter2};
  }`}
  ${media.tablet`
    height: 2.3rem;
    font-size: 0.75em;
  `}
`;

const ConfettiWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
`;

const toastOptions = {
  duration: 4000
};

export interface UserProfileProps {
  user: UserProps;
}

export default function UserProfile({ user }: UserProfileProps) {
  const [confettiRun, setConfettiRun] = useState(false);
  const [loading, setLoading] = useState(false);
  const [
    savedTargetLightningAddress, setSavedTargetLightningAddress
  ] = useState(user.lightningAddress ?? '');
  const [
    targetLightningAddress, setTargetLightningAddress
  ] = useState(user.lightningAddress ?? '');
  const [windowWidth, windowHeight] = useWindowSize();

  const resetTargetLightningAddress = () => {
    setTargetLightningAddress(savedTargetLightningAddress);
  };

  const saveTargetLightningAddress = async () => {
    setLoading(true);
    try {
      const fetchResponse = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          lightningAddress: targetLightningAddress.trim(),
        })
      });
      const fetchResponseJson: { reason?: string } = await fetchResponse.json();
      if (!fetchResponse.ok) {
        toast.error(fetchResponseJson.reason ?? 'Unexpected error', toastOptions);
        setTargetLightningAddress(savedTargetLightningAddress);
        return;
      }
      toast.success('Lightning address saved successfully', toastOptions);
      setSavedTargetLightningAddress(targetLightningAddress);
      if (targetLightningAddress) {
        setConfettiRun(true);
      }
    } catch (error) {
      console.error('Failed to update target lightning address', error);
      toast.error('Unexpected error', toastOptions);
      setTargetLightningAddress(savedTargetLightningAddress);
    } finally {
      setLoading(false);
    }
  };

  const ctaDisabled = loading || (savedTargetLightningAddress === targetLightningAddress);

  const stopConfetti = () => {
    setConfettiRun(false);
  };

  return (
    <UserProfileModule>
      <SignoutWrapper>
        <CTASignout
          href="#"
          onClick={(e) => {
            e.preventDefault();
            signOut();
          }}
        >
          Sign out
        </CTASignout>
      </SignoutWrapper>
      <Link href="/">
        <Image src="/logo.svg" width={60} height={60} alt="Logo" />
      </Link>
      <PageTitle>Lightning to Email</PageTitle>
      <UserProfileTitle>User Profile</UserProfileTitle>
      <UserProfileSubtitle>{user.email}</UserProfileSubtitle>
      <UserProfileCardGrid>
        <UserProfileCard>
          <UserProfileCardTitle>
            Lightning Address
          </UserProfileCardTitle>
          <UserProfileCardDescription>
            All lightning payments to{' '}
            <LightningAddress>{user.email}.ln2.email</LightningAddress>
            {' '}will be redirected to:
          </UserProfileCardDescription>
          <LightningAddressInput
            type="email"
            disabled={loading}
            maxLength={320}
            value={targetLightningAddress}
            onChange={(event) => setTargetLightningAddress(event.target.value)}
          />
          <LightningAddressInputSublabel>
            Leave empty to block all payment attempts
          </LightningAddressInputSublabel>
          <CTAWrapper>
            <CTAPrimary
              onClick={saveTargetLightningAddress}
              disabled={ctaDisabled}
            >
              { loading ? 'Saving...' : 'Save' }
            </CTAPrimary>
            <CTASecondary
              onClick={resetTargetLightningAddress}
              disabled={ctaDisabled}
            >
              Reset
            </CTASecondary>
          </CTAWrapper>
        </UserProfileCard>
      </UserProfileCardGrid>
      <Toaster />
      {
        confettiRun && (
          <ConfettiWrapper>
            <Confetti
              gravity={0.15}
              recycle={false}
              numberOfPieces={(windowWidth < sizes.tablet) ? 512 : 1024}
              width={windowWidth}
              height={windowHeight}
              tweenDuration={10000}
              onConfettiComplete={stopConfetti}
            />
          </ConfettiWrapper>
        )
      }
    </UserProfileModule>
  );
}

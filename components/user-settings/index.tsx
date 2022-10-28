import { signOut } from 'next-auth/react';
import styled from 'styled-components';
import { media } from '@/lib/media';
import { UserProps } from '@/lib/api/user';

const UserSettingsModule = styled.div`
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0;
  flex-direction: column;
  justify-content: center;
`;

const UserSettingsTitle = styled.div`
  margin: 0 auto;
  font-size: 30px;
  padding: 0 30px;
  max-width: 500px;
  font-weight: 800;
  line-height: 1.3;
  text-align: center;
  letter-spacing: -0.5px;

  ${media.tablet`
    padding: 0;
    font-size: 44px;
    letter-spacing: -1px;
  `}
`;

const UserSettingsSubtitle = styled.div`
  color: #666666;
  padding: 0 30px;
  font-size: 16px;
  line-height: 1.4;
  font-weight: 400;
  max-width: 800px;
  text-align: center;
  letter-spacing: -1px;
  margin: 20px auto 10px auto;

  ${media.tablet`
    font-size: 20px;
    line-height: 1.6;
  `}
`;

const UserSettingsCardGrid = styled.div`
  display: flex;
  padding: 10px 0;
  flex-direction: column;
  ${media.tablet`
    width: 540px;
  `}
`;

const UserSettingsCard = styled.div`
  padding: 20px 10px;
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

const UserSettingsCardTitle = styled.div`
  color: #111;
  margin: 0 0 8px 0;
  line-height: 1.4;
  font-weight: 600;
  font-size: 1.125em;
`;

const UserSettingsCardDescription = styled.div`
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
  padding: .5rem 1rem;
  &:focus {
    box-shadow: none;
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
`;

const CTAPrimary = styled.button`
  color: #fff;
  cursor: pointer;  
  padding: 0;
  width: 80px;
  text-align: center;
  margin: 0 10px 0 0;
  border-radius: 7px;
  height: 2.1rem;
  font-size: 0.875em;
  text-decoration: none;
  background: #0070f3;
  border: 0;

  &:hover {
    background: rgba(0,118,255,0.9);
    box-shadow: 0 6px 20px rgb(0 118 255 / 23%);
  }
  ${media.tablet`
    height: 2.3rem;
    font-size: 0.75em;
  `}
`;

const CTASecondary = styled.button`
  color: #fff;
  cursor: pointer;  
  padding: 0;
  width: 80px;
  text-align: center;
  margin: 0 10px 0 0;
  border-radius: 7px;
  height: 2.1rem;
  font-size: 0.875em;
  text-decoration: none;
  background: #707070;
  border: 0;
  &:hover {
    background: rgba(112,112,112,0.9);
    box-shadow: 0 6px 20px rgb(112 112 112 / 23%);
  }
  ${media.tablet`
    height: 2.3rem;
    font-size: 0.75em;
  `}
`;

export interface UserSettingsProps {
  user: UserProps;
}

export default function UserSettings({ user }: UserSettingsProps) {
  return (
    <UserSettingsModule>
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
      <UserSettingsTitle>User Settings</UserSettingsTitle>
      <UserSettingsSubtitle>{user.email}</UserSettingsSubtitle>
      <UserSettingsCardGrid>
        <UserSettingsCard>
          <UserSettingsCardTitle>
            Lightning Address
          </UserSettingsCardTitle>
          <UserSettingsCardDescription>
            All lightning payments to{' '}
            <LightningAddress>{user.email}.ln2.email</LightningAddress>
            {' '}will be forwarded to:
          </UserSettingsCardDescription>
          <LightningAddressInput type="email" />
          <LightningAddressInputSublabel>
            Leave empty to block all payment attempts
          </LightningAddressInputSublabel>
          <CTAWrapper>
            <CTAPrimary>Save</CTAPrimary>
            <CTASecondary>Reset</CTASecondary>
          </CTAWrapper>
        </UserSettingsCard>
      </UserSettingsCardGrid>
    </UserSettingsModule>
  );
}

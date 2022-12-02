import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import styled from 'styled-components';
import { media } from '@/lib/media';

const UnsubscribeModule = styled.div`
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0;
  flex-direction: column;
  justify-content: center;
`;

const PageTitle = styled.div`
  padding: 20px 30px 0 30px;
  font-size: 18px;
  line-height: 1.4;
  font-weight: 600;
  max-width: 800px;
  text-align: center;
  letter-spacing: -1px;
  margin: 0 auto 10px auto;

  ${media.tablet`
    font-size: 22px;
    line-height: 1.6;
  `}
`;

const UnsubscribeTitle = styled.div`
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

const UnsubscribeCardGrid = styled.div`
  display: flex;
  padding: 10px 0;
  flex-direction: column;
  ${media.tablet`
    width: 540px;
  `}
`;

const UnsubscribeCard = styled.div`
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

const UnsubscribeCardTitle = styled.div`
  color: #111;
  margin: 0 0 8px 0;
  line-height: 1.4;
  font-weight: 600;
  font-size: 1.125em;
`;

const UnsubscribeCardDescription = styled.div`
  color: #111;
  font-size: 14px;
  padding: 0 5px;
  line-height: 1.4;
  font-weight: 400;
  text-align: left;
  margin-bottom: 8px;
`;

const Email = styled.span`
  color: #111;
  font-weight: 700;
`;

const EmailLink = styled.a`
  color: #111;
  font-weight: 700;
  text-decoration: none;
`;


const CTAWrapper = styled.div`
  display: flex;
  margin: 0 auto 0 0;
  flex-direction: row;
`;

const CTAPrimary = styled.button`
  color: ${(props) => props.disabled ? 'rgba(0,0,0,0.26)' : '#fff'};
  ${(props) => props.disabled ? '' : 'cursor: pointer;'}
  padding: 0;
  width: 130px;
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
    box-shadow: 0 6px 20px rgb(0 118 255 / 23%);
  }`}
  ${media.tablet`
    height: 2.3rem;
    font-size: 0.75em;
    width: 140px;
  `}
`;

const CTASecondary = styled.button`
  color: ${(props) => props.disabled ? 'rgba(0,0,0,0.26)' : props.theme.colors.primary};
  ${(props) => props.disabled ? '' : 'cursor: pointer;'}
  padding: 0;
  width: 130px;
  text-align: center;
  margin: 0 10px 0 0;
  border-radius: 7px;
  height: 2.1rem;
  font-size: 0.875em;
  text-decoration: none;
  background-color: rgba(0,0,0,0);
  border: 1px solid ${(props) => props.disabled ? 'rgba(0,0,0,0.12)' : props.theme.colors.primary};
  ${(props) => props.disabled ? '' : `&:hover {
    box-shadow: inset 0 6px 20px rgb(0 118 255 / 23%);
  }`}
  ${media.tablet`
    height: 2.3rem;
    font-size: 0.75em;
    width: 140px;
  `}
`;

const toastOptions = {
  duration: 4000
};

const redirectDelay = 2000;

export interface UnsubscribeProps {
  email: string;
  token: string;
}

export default function Unsubscribe({ email, token }: UnsubscribeProps) {
  const [loading, setLoading] = useState(false);

  const unsubscribe = async () => {
    setLoading(true);
    try {
      const fetchResponse = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });
      const fetchResponseJson: { reason?: string } = await fetchResponse.json();
      if (!fetchResponse.ok) {
        toast.error(fetchResponseJson.reason ?? 'Unexpected error', toastOptions);
        return;
      }
      toast.success('Email has been unsubscribed successfully', toastOptions);
      setTimeout(
        () => {
          window.location.replace('/');
        },
        toastOptions.duration +  redirectDelay
      );
    } catch (error) {
      console.error('Failed to update target lightning address', error);
      toast.error('Unexpected error', toastOptions);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UnsubscribeModule>
      <PageTitle>Lightning to Email</PageTitle>
      <UnsubscribeTitle>Manage Subscription</UnsubscribeTitle>
      <UnsubscribeCardGrid>
        <UnsubscribeCard>
          <UnsubscribeCardTitle>
            Unsubscribe from all emails
          </UnsubscribeCardTitle>
          <UnsubscribeCardDescription>
            Reset configuration for user email{' '}
            <Email>{email}</Email>
            {' '}and unsubscribe from all future emails.
            This includes unsubscribing from the sign-in emails.
            To reactivate the user, you will have to contact
            {' '}<EmailLink href="mailto:support@ln2.email">support@ln2.email</EmailLink>.
          </UnsubscribeCardDescription>
          <CTAWrapper>
            <CTAPrimary
              onClick={unsubscribe}
              disabled={loading}
            >
              { loading ? 'Saving...' : 'Yes, unsubscribe!' }
            </CTAPrimary>
            <CTASecondary
              onClick={() => {
                window.location.href = '/';
              }}
              disabled={loading}
            >
              Go to Homepage
            </CTASecondary>
          </CTAWrapper>
        </UnsubscribeCard>
      </UnsubscribeCardGrid>
      <Toaster />
    </UnsubscribeModule>
  );
}

import React from 'react';
import { Alert, View } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize';

import AppleSvg from '../../assets/apple.svg'
import GoogleSvg from '../../assets/google.svg'
import LogoSvg from '../../assets/logo.svg'
import { SignInSocialButton } from '../../components/SignInSocialButton';
import { useAuth } from '../../hooks/auth';

import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper
} from './styles';

export function SignIn(){
    const { signInWithGoogle, signInWithApple } = useAuth()

    async function handleSignInWithGoogle() {
        try {
            await signInWithGoogle()
        } catch (err) {
            Alert.alert('Não foi possível realizar o login.')
        }
    }

    async function handleSignInWithApple() {
        try {
            await signInWithApple()
        } catch (err) {
            Alert.alert('Não foi possível realizar o login.')
        }
    }

  return (
    <Container>
        <Header>
            <TitleWrapper>
                <LogoSvg 
                    width={RFValue(120)}
                    height={RFValue(68)}
                />
                <Title>
                    Controle suas {'\n'}
                    finanças de forma  {'\n'}
                    muito simples
                </Title>
            </TitleWrapper>

            <SignInTitle>
                Faça seu login com  {'\n'}
                umas das contas abaixo
            </SignInTitle>
        </Header>
        <Footer>
            <FooterWrapper>
                <SignInSocialButton title="Entrar com Google" svg={GoogleSvg} onPress={handleSignInWithGoogle} />
                <SignInSocialButton title="Entrar com Apple" svg={AppleSvg}  onPress={signInWithApple} />
            </FooterWrapper>
        </Footer>
    </Container>
  );
}